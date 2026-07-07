// Εβδομαδιαίο επαναλαμβανόμενο πρόγραμμα ιατρών (self-service).
// Η κάθε ιατρός ορίζει ένα εβδομαδιαίο μοτίβο (availability_templates) που
// υλοποιείται (materialize) αυτόματα σε συγκεκριμένες διαθεσιμότητες (availability)
// για τον τρέχοντα + τους επόμενους μήνες. Χρησιμοποιεί το service-role client
// ώστε να μπορεί να γράφει (ίδιο pattern με το DoctorPanel/AdminPanel).
import { supabaseAdmin } from './supabase';
import { getUserTimezone, getCurrentDateInTimezone } from './timezone';

export interface TemplateBlock {
  weekday: number; // 0=Κυριακή ... 6=Σάββατο (JS getDay())
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  increment_minutes: 30 | 60;
}

// Πόσους μήνες μπροστά κρατάμε γεμάτους (τρέχων + επόμενοι 2 = κυλιόμενο 3μηνο).
export const MONTHS_AHEAD = 3;

const pad = (n: number) => String(n).padStart(2, '0');
export const hm = (t: string) => (t || '').slice(0, 5);
const toMin = (t: string) => {
  const [h, m] = hm(t).split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
};

const todayString = (): string => {
  const tz = getUserTimezone();
  const now = getCurrentDateInTimezone(tz);
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

// Όλες οι ημερομηνίες (YYYY-MM-DD) ενός μήνα που πέφτουν σε συγκεκριμένη ημέρα
// εβδομάδας και είναι >= σήμερα.
const monthDatesForWeekday = (
  year: number,
  month0: number,
  weekday: number,
  todayStr: string
): string[] => {
  const res: string[] = [];
  const days = new Date(year, month0 + 1, 0).getDate();
  for (let d = 1; d <= days; d++) {
    const dt = new Date(year, month0, d);
    if (dt.getDay() === weekday) {
      const ds = `${year}-${pad(month0 + 1)}-${pad(d)}`;
      if (ds >= todayStr) res.push(ds);
    }
  }
  return res;
};

export const loadTemplate = async (doctorId: string): Promise<TemplateBlock[]> => {
  if (!doctorId) return [];
  const { data } = await supabaseAdmin
    .from('availability_templates')
    .select('*')
    .eq('doctor_id', doctorId)
    .order('weekday')
    .order('start_time');
  return (data || []).map((r: any) => ({
    weekday: r.weekday,
    start_time: hm(r.start_time),
    end_time: hm(r.end_time),
    increment_minutes: r.increment_minutes
  }));
};

// Υλοποιεί (additive) το μοτίβο σε συγκεκριμένες διαθεσιμότητες για τρέχοντα +
// επόμενους μήνες. Δεν διαγράφει τίποτα, δεν δημιουργεί διπλότυπα/επικαλύψεις.
export const materializeTemplate = async (
  doctorId: string,
  blocks?: TemplateBlock[]
): Promise<number> => {
  if (!doctorId) return 0;
  const tpl = blocks || (await loadTemplate(doctorId));
  if (!tpl.length) return 0;

  const tz = getUserTimezone();
  const now = getCurrentDateInTimezone(tz);
  const startY = now.getFullYear();
  const startM = now.getMonth();
  const todayStr = todayString();

  const endDateObj = new Date(startY, startM + MONTHS_AHEAD, 0);
  const rangeEnd = `${endDateObj.getFullYear()}-${pad(endDateObj.getMonth() + 1)}-${pad(endDateObj.getDate())}`;

  const { data: existing } = await supabaseAdmin
    .from('availability')
    .select('date,start_time,end_time')
    .eq('doctor_id', doctorId)
    .gte('date', todayStr)
    .lte('date', rangeEnd);

  const existingByDate = new Map<string, { s: number; e: number }[]>();
  (existing || []).forEach((a: any) => {
    const arr = existingByDate.get(a.date) || [];
    arr.push({ s: toMin(a.start_time), e: toMin(a.end_time) });
    existingByDate.set(a.date, arr);
  });

  const toInsert: any[] = [];
  for (let mo = 0; mo < MONTHS_AHEAD; mo++) {
    const y = startY + Math.floor((startM + mo) / 12);
    const m = (startM + mo) % 12;
    for (const b of tpl) {
      const bs = toMin(b.start_time);
      const be = toMin(b.end_time);
      if (be <= bs) continue;
      const dates = monthDatesForWeekday(y, m, b.weekday, todayStr);
      for (const ds of dates) {
        const ex = existingByDate.get(ds) || [];
        const overlap = ex.some((r) => !(be <= r.s || bs >= r.e));
        if (overlap) continue;
        toInsert.push({
          doctor_id: doctorId,
          date: ds,
          start_time: b.start_time,
          end_time: b.end_time,
          increment_minutes: b.increment_minutes,
          source: 'template'
        });
        ex.push({ s: bs, e: be });
        existingByDate.set(ds, ex);
      }
    }
  }

  for (let i = 0; i < toInsert.length; i += 200) {
    const chunk = toInsert.slice(i, i + 200);
    const { error } = await supabaseAdmin.from('availability').insert(chunk);
    if (error) throw error;
  }
  return toInsert.length;
};

// Αποθηκεύει (SAVE) νέο εβδομαδιαίο μοτίβο: αντικαθιστά το template, αφαιρεί
// μελλοντικές auto-generated (source='template') διαθεσιμότητες σε ημέρες ΧΩΡΙΣ
// κράτηση (ώστε αλλαγές/αφαιρέσεις ημερών να ισχύσουν), και υλοποιεί εκ νέου.
export const saveTemplate = async (doctorId: string, blocks: TemplateBlock[]): Promise<void> => {
  if (!doctorId) return;

  await supabaseAdmin.from('availability_templates').delete().eq('doctor_id', doctorId);
  if (blocks.length) {
    const rows = blocks.map((b) => ({
      doctor_id: doctorId,
      weekday: b.weekday,
      start_time: b.start_time,
      end_time: b.end_time,
      increment_minutes: b.increment_minutes
    }));
    const { error } = await supabaseAdmin.from('availability_templates').insert(rows);
    if (error) throw error;
  }

  const todayStr = todayString();
  const { data: futTpl } = await supabaseAdmin
    .from('availability')
    .select('id,date')
    .eq('doctor_id', doctorId)
    .eq('source', 'template')
    .gte('date', todayStr);

  if (futTpl && futTpl.length) {
    // Κράτα ό,τι πέφτει σε ημέρα με κράτηση (ασφάλεια), διάγραψε τα υπόλοιπα.
    const { data: appts } = await supabaseAdmin
      .from('appointments')
      .select('date')
      .eq('doctor_id', doctorId)
      .gte('date', todayStr);
    const bookedDates = new Set((appts || []).map((a: any) => a.date));
    const deletableIds = futTpl
      .filter((r: any) => !bookedDates.has(r.date))
      .map((r: any) => r.id);
    for (let i = 0; i < deletableIds.length; i += 200) {
      const chunk = deletableIds.slice(i, i + 200);
      if (chunk.length) {
        await supabaseAdmin.from('availability').delete().in('id', chunk);
      }
    }
  }

  await materializeTemplate(doctorId, blocks);
};
