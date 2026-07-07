// Scheduled Netlify Function: υλοποιεί (materialize) τα εβδομαδιαία μοτίβα των
// ιατρών σε συγκεκριμένες διαθεσιμότητες για τον τρέχοντα + επόμενους μήνες.
// Τρέχει ΑΥΤΟΜΑΤΑ (schedule στο netlify.toml) ώστε το πρόγραμμα κάθε ιατρού να
// επεκτείνεται μόνο του κάθε μήνα, χωρίς να χρειάζεται να μπει η ιατρός.
// Προσθετικό (additive) & idempotent: δεν διαγράφει, δεν φτιάχνει διπλότυπα.
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://vdrmgzoupwyisiyrnjdi.supabase.co',
  process.env.SUPABASE_SERVICE_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkcm1nem91cHd5aXNpeXJuamRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTUzMDAxNiwiZXhwIjoyMDc1MTA2MDE2fQ.uH3E-xqFmKkMF6Uul3jaSHTqloqklWDg7KaIAMxq_CQ'
);

const MONTHS_AHEAD = 3; // τρέχων + επόμενοι 2
const pad = (n) => String(n).padStart(2, '0');
const hm = (t) => (t || '').slice(0, 5);
const toMin = (t) => {
  const [h, m] = hm(t).split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
};

// «Σήμερα» σε Ελληνική ώρα (YYYY-MM-DD)
function athensToday() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Athens',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());
}

function monthDatesForWeekday(year, month0, weekday, todayStr) {
  const res = [];
  const days = new Date(year, month0 + 1, 0).getDate();
  for (let d = 1; d <= days; d++) {
    const dt = new Date(year, month0, d);
    if (dt.getDay() === weekday) {
      const ds = `${year}-${pad(month0 + 1)}-${pad(d)}`;
      if (ds >= todayStr) res.push(ds);
    }
  }
  return res;
}

async function materializeDoctor(doctorId, blocks, todayStr) {
  if (!blocks.length) return 0;
  const [ty, tm] = todayStr.split('-').map(Number);
  const startY = ty;
  const startM = tm - 1;
  const endObj = new Date(startY, startM + MONTHS_AHEAD, 0);
  const rangeEnd = `${endObj.getFullYear()}-${pad(endObj.getMonth() + 1)}-${pad(endObj.getDate())}`;

  const { data: existing } = await supabase
    .from('availability')
    .select('date,start_time,end_time')
    .eq('doctor_id', doctorId)
    .gte('date', todayStr)
    .lte('date', rangeEnd);

  const byDate = new Map();
  (existing || []).forEach((a) => {
    const arr = byDate.get(a.date) || [];
    arr.push({ s: toMin(a.start_time), e: toMin(a.end_time) });
    byDate.set(a.date, arr);
  });

  const toInsert = [];
  for (let mo = 0; mo < MONTHS_AHEAD; mo++) {
    const y = startY + Math.floor((startM + mo) / 12);
    const m = (startM + mo) % 12;
    for (const b of blocks) {
      const bs = toMin(b.start_time);
      const be = toMin(b.end_time);
      if (be <= bs) continue;
      for (const ds of monthDatesForWeekday(y, m, b.weekday, todayStr)) {
        const ex = byDate.get(ds) || [];
        if (ex.some((r) => !(be <= r.s || bs >= r.e))) continue;
        toInsert.push({
          doctor_id: doctorId,
          date: ds,
          start_time: b.start_time,
          end_time: b.end_time,
          increment_minutes: b.increment_minutes,
          source: 'template'
        });
        ex.push({ s: bs, e: be });
        byDate.set(ds, ex);
      }
    }
  }

  for (let i = 0; i < toInsert.length; i += 200) {
    const { error } = await supabase.from('availability').insert(toInsert.slice(i, i + 200));
    if (error) throw error;
  }
  return toInsert.length;
}

exports.handler = async () => {
  try {
    const todayStr = athensToday();

    const { data: docs } = await supabase.from('doctors').select('id').eq('active', true);
    const activeIds = new Set((docs || []).map((d) => d.id));

    const { data: templates } = await supabase.from('availability_templates').select('*');
    const byDoctor = new Map();
    (templates || []).forEach((r) => {
      if (!activeIds.has(r.doctor_id)) return;
      const arr = byDoctor.get(r.doctor_id) || [];
      arr.push({
        weekday: r.weekday,
        start_time: hm(r.start_time),
        end_time: hm(r.end_time),
        increment_minutes: r.increment_minutes
      });
      byDoctor.set(r.doctor_id, arr);
    });

    let total = 0;
    const results = [];
    for (const [doctorId, blocks] of byDoctor) {
      try {
        const n = await materializeDoctor(doctorId, blocks, todayStr);
        total += n;
        results.push({ doctorId, created: n });
      } catch (e) {
        results.push({ doctorId, error: e.message });
      }
    }

    console.log('[generate-monthly-availability] done', { today: todayStr, totalCreated: total });
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, today: todayStr, totalCreated: total, results })
    };
  } catch (e) {
    console.error('[generate-monthly-availability] error', e);
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: e.message }) };
  }
};
