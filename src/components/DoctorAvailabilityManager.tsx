import React, { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Info, X, Loader2, Trash2, Save, Repeat } from 'lucide-react';
import { supabaseAdmin } from '../lib/supabase';
import { Appointment, Availability } from '../types/appointments';
import {
  getUserTimezone,
  getCurrentDateInTimezone,
  toDateString,
  convertTimeToTimezone,
  getDoctorTimezone
} from '../lib/timezone';
import {
  TemplateBlock,
  loadTemplate,
  saveTemplate,
  materializeTemplate
} from '../lib/availabilityScheduling';

interface DoctorAvailabilityManagerProps {
  doctorName: string;
  language: 'gr' | 'en';
}

const WEEKDAYS: { v: number; gr: string; en: string }[] = [
  { v: 1, gr: 'Δευτέρα', en: 'Monday' },
  { v: 2, gr: 'Τρίτη', en: 'Tuesday' },
  { v: 3, gr: 'Τετάρτη', en: 'Wednesday' },
  { v: 4, gr: 'Πέμπτη', en: 'Thursday' },
  { v: 5, gr: 'Παρασκευή', en: 'Friday' },
  { v: 6, gr: 'Σάββατο', en: 'Saturday' },
  { v: 0, gr: 'Κυριακή', en: 'Sunday' }
];

const toMinutes = (t: string): number => {
  if (!t) return 0;
  const [h, m] = t.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
};
const formatHM = (t: string) => (t || '').slice(0, 5);

const DoctorAvailabilityManager: React.FC<DoctorAvailabilityManagerProps> = ({ doctorName, language }) => {
  const userTimezone = getUserTimezone();
  const doctorTimezone = getDoctorTimezone(doctorName);

  const t = (gr: string, en: string) => (language === 'gr' ? gr : en);

  const [doctorId, setDoctorId] = useState<string>('');
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Template (weekly) editor
  const [templateBlocks, setTemplateBlocks] = useState<TemplateBlock[]>([]);
  const [tplWeekday, setTplWeekday] = useState<number>(1);
  const [tplFrom, setTplFrom] = useState('15:00');
  const [tplTo, setTplTo] = useState('19:00');
  const [tplInc, setTplInc] = useState<30 | 60>(30);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [templateMsg, setTemplateMsg] = useState<string | null>(null);

  // Single add
  const [from, setFrom] = useState('15:00');
  const [to, setTo] = useState('19:00');
  const [inc, setInc] = useState<30 | 60>(30);
  const [singleDate, setSingleDate] = useState('');
  const [saving, setSaving] = useState(false);

  // Calendar month (YYYY-MM)
  const [month, setMonth] = useState(() => {
    const now = getCurrentDateInTimezone(userTimezone);
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const [cancelTarget, setCancelTarget] = useState<{ id: string; date: string; start: string; end: string } | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [infoAppointment, setInfoAppointment] = useState<Appointment | null>(null);

  const todayStr = toDateString(getCurrentDateInTimezone(userTimezone), userTimezone);

  // Resolve doctorId from name
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabaseAdmin.from('doctors').select('id').eq('name', doctorName).single();
      if (!cancelled && data) setDoctorId(data.id);
    })();
    return () => {
      cancelled = true;
    };
  }, [doctorName]);

  const fetchAvailability = useCallback(async () => {
    if (!doctorId) return;
    const { data } = await supabaseAdmin
      .from('availability')
      .select('*')
      .eq('doctor_id', doctorId)
      .order('date');
    setAvailability((data || []) as Availability[]);
  }, [doctorId]);

  const fetchAppointments = useCallback(async () => {
    if (!doctorId) return;
    const { data } = await supabaseAdmin
      .from('appointments')
      .select('id, date, time, doctor_id, parent_name, email, phone, child_age, concerns, specialty, thematology, urgency, is_first_session, user_timezone, created_at, status')
      .eq('doctor_id', doctorId);
    setAppointments((data || []) as Appointment[]);
  }, [doctorId]);

  // Initial load + auto-materialize upcoming months from the saved template
  useEffect(() => {
    if (!doctorId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const tpl = await loadTemplate(doctorId);
        if (!cancelled) setTemplateBlocks(tpl);
        // Auto-generate concrete slots for current + next months (idempotent)
        if (tpl.length) {
          try {
            await materializeTemplate(doctorId, tpl);
          } catch (e) {
            console.error('materializeTemplate on load failed:', e);
          }
        }
        await fetchAvailability();
        await fetchAppointments();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [doctorId, fetchAvailability, fetchAppointments]);

  // Real-time updates for this doctor
  useEffect(() => {
    if (!doctorId) return;
    const channel = supabaseAdmin
      .channel(`doctor_sched_${doctorId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'availability' }, () => fetchAvailability())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => fetchAppointments())
      .subscribe();
    return () => {
      supabaseAdmin.removeChannel(channel);
    };
  }, [doctorId, fetchAvailability, fetchAppointments]);

  // ---- Template editor handlers ----
  const addTemplateBlock = () => {
    if (toMinutes(tplTo) <= toMinutes(tplFrom)) {
      setTemplateMsg(t('Η ώρα λήξης πρέπει να είναι μετά την έναρξη.', 'End time must be after start time.'));
      return;
    }
    const exists = templateBlocks.some(
      (b) => b.weekday === tplWeekday && b.start_time === tplFrom && b.end_time === tplTo
    );
    if (exists) {
      setTemplateMsg(t('Το μπλοκ υπάρχει ήδη.', 'This block already exists.'));
      return;
    }
    setTemplateBlocks((prev) => [...prev, { weekday: tplWeekday, start_time: tplFrom, end_time: tplTo, increment_minutes: tplInc }]);
    setTemplateMsg(null);
  };

  const removeTemplateBlock = (idx: number) => {
    setTemplateBlocks((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveTemplate = async () => {
    if (!doctorId) return;
    setSavingTemplate(true);
    setTemplateMsg(null);
    try {
      await saveTemplate(doctorId, templateBlocks);
      await fetchAvailability();
      await fetchAppointments();
      setTemplateMsg(
        t(
          '✅ Το πρόγραμμα αποθηκεύτηκε. Θα επαναλαμβάνεται αυτόματα κάθε μήνα.',
          '✅ Schedule saved. It will repeat automatically every month.'
        )
      );
    } catch (e) {
      console.error('saveTemplate failed:', e);
      setTemplateMsg(t('Σφάλμα αποθήκευσης.', 'Save failed.'));
    } finally {
      setSavingTemplate(false);
    }
  };

  // ---- Single add ----
  const addSingle = async () => {
    if (!doctorId || !singleDate) return;
    if (toMinutes(to) <= toMinutes(from)) {
      alert(t('Η ώρα λήξης πρέπει να είναι μετά την έναρξη.', 'End time must be after start time.'));
      return;
    }
    const startM = toMinutes(from);
    const endM = toMinutes(to);
    const conflicts = availability.filter((a) => a.doctor_id === doctorId && a.date === singleDate);
    const overlap = conflicts.some((a) => {
      const aStart = toMinutes(formatHM(String(a.start_time)));
      const aEnd = toMinutes(formatHM(String(a.end_time)));
      return !(endM <= aStart || startM >= aEnd);
    });
    if (overlap) {
      alert(t('Υπάρχει ήδη διαθεσιμότητα που επικαλύπτεται.', 'Overlapping availability already exists.'));
      return;
    }
    setSaving(true);
    const payload = { doctor_id: doctorId, date: singleDate, start_time: from, end_time: to, increment_minutes: inc, source: 'manual' };
    const { data, error } = await supabaseAdmin.from('availability').insert(payload).select();
    setSaving(false);
    if (error) {
      alert(t('Σφάλμα καταχώρησης', 'Save error'));
      return;
    }
    if (data && data.length) {
      setAvailability((prev) => [...prev, data[0] as Availability]);
      setSingleDate('');
    }
  };

  // ---- Calendar helpers ----
  const daysInMonth = (yyyyMM: string) => {
    const [y, m] = yyyyMM.split('-').map(Number);
    return new Date(y, m, 0).getDate();
  };
  const getMonthGrid = (yyyyMM: string): Array<string | null> => {
    const [y, m] = yyyyMM.split('-').map(Number);
    const first = new Date(y, m - 1, 1);
    const firstInTz = new Date(first.toLocaleString('en-US', { timeZone: userTimezone }));
    const firstW = (firstInTz.getDay() + 6) % 7; // Monday=0
    const total = daysInMonth(yyyyMM);
    const grid: Array<string | null> = [];
    for (let i = 0; i < firstW; i++) grid.push(null);
    for (let d = 1; d <= total; d++) grid.push(`${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
    while (grid.length % 7) grid.push(null);
    return grid;
  };

  const goPrevMonth = () => {
    const [ys, ms] = month.split('-');
    const y = Number(ys);
    const mn = Number(ms);
    const pm = mn === 1 ? 12 : mn - 1;
    const py = mn === 1 ? y - 1 : y;
    setMonth(`${py}-${String(pm).padStart(2, '0')}`);
  };
  const goNextMonth = () => {
    const [ys, ms] = month.split('-');
    const y = Number(ys);
    const mn = Number(ms);
    const nm = mn === 12 ? 1 : mn + 1;
    const ny = mn === 12 ? y + 1 : y;
    setMonth(`${ny}-${String(nm).padStart(2, '0')}`);
  };
  const goCurrentMonth = () => {
    const now = getCurrentDateInTimezone(userTimezone);
    setMonth(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
  };

  const monthNames = language === 'gr'
    ? ['Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μάιος', 'Ιούνιος', 'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const formatMonthLabel = (yyyyMM: string) => {
    const [ys, ms] = yyyyMM.split('-');
    return `${monthNames[Number(ms) - 1]} ${ys}`;
  };

  const formatClock = (time: string): string => {
    if (!time) return '';
    const [hStr, mStr] = time.split(':');
    let h = parseInt(hStr, 10);
    const suffix = h < 12 ? 'π.μ.' : 'μ.μ.';
    if (language === 'en') {
      const s = h < 12 ? 'AM' : 'PM';
      let hh = h % 12;
      if (hh === 0) hh = 12;
      return `${String(hh).padStart(2, '0')}:${mStr} ${s}`;
    }
    h = h % 12;
    if (h === 0) h = 12;
    return `${String(h).padStart(2, '0')}:${mStr} ${suffix}`;
  };

  const monthGrid = getMonthGrid(month);
  const rangesByDate = new Map<string, { id: string; start: string; end: string }[]>();
  availability
    .filter((a) => a.doctor_id === doctorId && a.date.startsWith(month))
    .forEach((a) => {
      const list = rangesByDate.get(a.date) || [];
      list.push({ id: a.id, start: formatHM(a.start_time as any), end: formatHM(a.end_time as any) });
      rangesByDate.set(a.date, list);
    });

  const getAppointmentForSlot = (date: string, startTime: string, endTime?: string) => {
    return appointments.find((apt) => {
      if (apt.doctor_id !== doctorId) return false;
      const isBooked = apt.status === 'booked' || apt.status === null || apt.status === undefined;
      if (!isBooked) return false;
      const slotStart = convertTimeToTimezone(date, startTime, doctorTimezone, apt.user_timezone || doctorTimezone).slice(0, 5);
      if (endTime) {
        const slotEnd = convertTimeToTimezone(date, endTime, doctorTimezone, apt.user_timezone || doctorTimezone).slice(0, 5);
        return apt.date === date && apt.time.slice(0, 5) >= slotStart && apt.time.slice(0, 5) < slotEnd;
      }
      return apt.date === date && apt.time.slice(0, 5) === slotStart;
    }) || null;
  };

  const handleCancelAvailability = async () => {
    if (!cancelTarget) return;
    if (!confirm(t(`Ακύρωση διαθεσιμότητας ${cancelTarget.date} ${cancelTarget.start}–${cancelTarget.end};`, `Cancel availability ${cancelTarget.date} ${cancelTarget.start}–${cancelTarget.end}?`))) return;
    setIsCancelling(true);
    try {
      await supabaseAdmin
        .from('appointments')
        .delete()
        .eq('doctor_id', doctorId)
        .eq('date', cancelTarget.date)
        .gte('time', cancelTarget.start)
        .lte('time', cancelTarget.end);
      const { error } = await supabaseAdmin.from('availability').delete().eq('id', cancelTarget.id);
      if (error) {
        alert(t('Σφάλμα ακύρωσης', 'Cancel error'));
        return;
      }
      setAvailability((prev) => prev.filter((a) => a.id !== cancelTarget.id));
      await fetchAppointments();
    } catch (e) {
      console.error('cancel availability failed:', e);
      alert(t('Σφάλμα ακύρωσης', 'Cancel error'));
    } finally {
      setIsCancelling(false);
      setCancelTarget(null);
    }
  };

  // Bulk cancel
  const [bulkFrom, setBulkFrom] = useState('');
  const [bulkTo, setBulkTo] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);
  const runBulkCancel = async () => {
    if (!doctorId) return;
    if (!bulkFrom || !bulkTo) {
      alert(t('Συμπληρώστε Από και Μέχρι.', 'Fill From and To dates.'));
      return;
    }
    if (bulkTo < bulkFrom) {
      alert(t('Η "Μέχρι" πρέπει να είναι μετά την "Από".', '"To" must be after "From".'));
      return;
    }
    if (!confirm(t(`Ακύρωση όλων των διαθεσιμοτήτων από ${bulkFrom} έως ${bulkTo};`, `Cancel all availability from ${bulkFrom} to ${bulkTo}?`))) return;
    setBulkLoading(true);
    try {
      const { data: idsData } = await supabaseAdmin
        .from('availability')
        .select('id')
        .eq('doctor_id', doctorId)
        .gte('date', bulkFrom)
        .lte('date', bulkTo);
      const ids = (idsData || []).map((r: any) => r.id);
      await supabaseAdmin.from('appointments').delete().eq('doctor_id', doctorId).gte('date', bulkFrom).lte('date', bulkTo);
      const { error } = await supabaseAdmin.from('availability').delete().eq('doctor_id', doctorId).gte('date', bulkFrom).lte('date', bulkTo);
      if (error) {
        alert(t('Σφάλμα μαζικής ακύρωσης.', 'Bulk cancel error.'));
        return;
      }
      setAvailability((prev) => prev.filter((a) => !ids.includes(a.id)));
      await fetchAppointments();
      alert(t('Η μαζική ακύρωση ολοκληρώθηκε.', 'Bulk cancel completed.'));
    } catch (e) {
      console.error('bulk cancel failed:', e);
      alert(t('Σφάλμα μαζικής ακύρωσης.', 'Bulk cancel error.'));
    } finally {
      setBulkLoading(false);
    }
  };

  if (!doctorId || loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border-2 border-teal-200 p-12 text-center">
        <Loader2 className="h-8 w-8 text-teal-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 font-nunito">{t('Φόρτωση προγράμματος...', 'Loading schedule...')}</p>
      </div>
    );
  }

  const inputCls = 'w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all';

  return (
    <div className="space-y-6">
      {/* ℹ️ Informative label */}
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-white" />
          </div>
          <div className="text-sm text-teal-900 font-nunito leading-relaxed">
            <p className="font-bold text-base mb-1">
              {t('Πώς λειτουργεί το πρόγραμμά σας', 'How your schedule works')}
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                {t(
                  'Ορίστε το εβδομαδιαίο πρόγραμμά σας παρακάτω. Θα επαναλαμβάνεται ΑΥΤΟΜΑΤΑ κάθε μήνα.',
                  'Set your weekly schedule below. It repeats AUTOMATICALLY every month.'
                )}
              </li>
              <li>
                {t(
                  'Αν το αλλάξετε, πατήστε «Αποθήκευση Προγράμματος» — από εκεί και πέρα θα τρέχει αυτόματα το νέο.',
                  'If you change it, press “Save Schedule” — from then on the new one runs automatically.'
                )}
              </li>
              <li className="font-semibold">
                {t(
                  'Οι ώρες είναι σε Ελληνική ώρα (Ελλάδας) και εμφανίζονται έτσι στους ασθενείς.',
                  'Times are in Greek (Greece) time and are shown that way to patients.'
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 🔁 Weekly recurring template */}
      <div className="bg-gradient-to-br from-teal-50 to-cyan-100 rounded-2xl p-6 border border-teal-200 shadow-sm">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center mr-3">
            <Repeat className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 font-poppins">
              {t('Εβδομαδιαίο Πρόγραμμα (επαναλαμβάνεται κάθε μήνα)', 'Weekly Schedule (repeats every month)')}
            </h3>
            <p className="text-sm text-gray-600">
              {t('Προσθέστε μπλοκ ημέρας/ώρας και πατήστε Αποθήκευση.', 'Add day/time blocks and press Save.')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('Ημέρα', 'Day')}</label>
            <select className={inputCls} value={tplWeekday} onChange={(e) => setTplWeekday(Number(e.target.value))}>
              {WEEKDAYS.map((w) => (
                <option key={w.v} value={w.v}>{language === 'gr' ? w.gr : w.en}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('Από', 'From')}</label>
            <input type="time" className={inputCls} value={tplFrom} onChange={(e) => setTplFrom(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('Έως', 'To')}</label>
            <input type="time" className={inputCls} value={tplTo} onChange={(e) => setTplTo(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('Διάρκεια', 'Duration')}</label>
            <select className={inputCls} value={tplInc} onChange={(e) => setTplInc(Number(e.target.value) as 30 | 60)}>
              <option value={30}>{t('30 λεπτά', '30 min')}</option>
              <option value={60}>{t('60 λεπτά', '60 min')}</option>
            </select>
          </div>
          <div>
            <button onClick={addTemplateBlock} className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700 transition-all shadow">
              {t('➕ Προσθήκη', '➕ Add')}
            </button>
          </div>
        </div>

        {/* Blocks list */}
        <div className="mt-5">
          {templateBlocks.length === 0 ? (
            <p className="text-sm text-gray-500 italic">{t('Δεν έχετε ορίσει ακόμη εβδομαδιαίο πρόγραμμα.', 'You have not set a weekly schedule yet.')}</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {templateBlocks
                .slice()
                .sort((a, b) => (a.weekday === 0 ? 7 : a.weekday) - (b.weekday === 0 ? 7 : b.weekday) || toMinutes(a.start_time) - toMinutes(b.start_time))
                .map((b) => {
                  const realIdx = templateBlocks.indexOf(b);
                  const wd = WEEKDAYS.find((w) => w.v === b.weekday);
                  return (
                    <span key={`${b.weekday}-${b.start_time}-${b.end_time}-${realIdx}`} className="inline-flex items-center gap-2 bg-white border-2 border-teal-200 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 shadow-sm">
                      <span className="font-semibold text-teal-700">{language === 'gr' ? wd?.gr : wd?.en}</span>
                      <span>{b.start_time}–{b.end_time}</span>
                      <span className="text-xs text-gray-400">({b.increment_minutes}′)</span>
                      <button onClick={() => removeTemplateBlock(realIdx)} className="text-red-500 hover:text-red-700" title={t('Αφαίρεση', 'Remove')}>
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  );
                })}
            </div>
          )}
        </div>

        {templateMsg && (
          <div className="mt-4 text-sm font-medium text-teal-800 bg-teal-100 border border-teal-200 rounded-lg px-4 py-2">
            {templateMsg}
          </div>
        )}

        <div className="mt-5">
          <button
            disabled={savingTemplate}
            onClick={handleSaveTemplate}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-bold py-3 px-8 rounded-xl hover:from-teal-700 hover:to-cyan-700 disabled:opacity-50 transition-all shadow-lg"
          >
            {savingTemplate ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {t('Αποθήκευση Προγράμματος', 'Save Schedule')}
          </button>
        </div>
      </div>

      {/* ➕ Single add */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200 shadow-sm">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800 font-poppins">{t('Προσθήκη Μεμονωμένης Διαθεσιμότητας', 'Add Single Availability')}</h3>
          <p className="text-sm text-gray-600">{t('Για συγκεκριμένη ημερομηνία (εκτός μοτίβου).', 'For a specific date (outside the pattern).')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('Ημερομηνία', 'Date')}</label>
            <input type="date" className={inputCls} value={singleDate} min={todayStr} onChange={(e) => setSingleDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('Από', 'From')}</label>
            <input type="time" className={inputCls} value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('Έως', 'To')}</label>
            <input type="time" className={inputCls} value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('Διάρκεια', 'Duration')}</label>
            <select className={inputCls} value={inc} onChange={(e) => setInc(Number(e.target.value) as 30 | 60)}>
              <option value={30}>{t('30 λεπτά', '30 min')}</option>
              <option value={60}>{t('60 λεπτά', '60 min')}</option>
            </select>
          </div>
          <div>
            <button disabled={saving || !singleDate} onClick={addSingle} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition-all shadow">
              {saving ? t('⏳ Προσθήκη...', '⏳ Adding...') : t('✅ Προσθήκη', '✅ Add')}
            </button>
          </div>
        </div>
      </div>

      {/* 📅 Monthly calendar */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 font-poppins">{t('Πρόγραμμα Μήνα', 'Month Schedule')}</h3>
            <p className="text-sm text-gray-600">{t('Κλικ σε συνεδρία για ακύρωση διαθεσιμότητας.', 'Click a slot to cancel availability.')}</p>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200">
            <button onClick={goPrevMonth} className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
            <span className="text-lg font-bold text-gray-800 font-poppins min-w-[160px] text-center">{formatMonthLabel(month)}</span>
            <button onClick={goNextMonth} className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
            <button onClick={goCurrentMonth} className="ml-2 px-3 py-1.5 text-sm font-medium text-teal-600 bg-teal-50 rounded-lg hover:bg-teal-100 border border-teal-200">
              {t('Σήμερα', 'Today')}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4 text-sm">
          <div className="flex items-center bg-green-50 px-3 py-2 rounded-lg border border-green-200">
            <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
            <span className="font-medium text-gray-700">{t('Διαθέσιμη', 'Available')}</span>
          </div>
          <div className="flex items-center bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
            <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
            <span className="font-medium text-gray-700">{t('Κρατημένη', 'Booked')}</span>
          </div>
          <div className="flex items-center bg-red-50 px-3 py-2 rounded-lg border border-red-200">
            <span className="w-3 h-3 rounded-full bg-red-400 mr-2"></span>
            <span className="font-medium text-gray-700">{t('Μη διαθέσιμη', 'Unavailable')}</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-xs sm:text-sm">
          {(language === 'gr'
            ? ['Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο', 'Κυριακή']
            : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          ).map((h) => (
            <div key={h} className="text-center font-bold text-gray-700 py-2 sm:py-3 bg-gray-50 rounded-lg border border-gray-200">{h}</div>
          ))}
          {monthGrid.map((d, idx) => {
            if (!d) return <div key={idx} className="h-12 sm:h-16 rounded-lg bg-gray-50 border border-gray-200" />;
            const rawRanges = rangesByDate.get(d) || [];
            const ranges = rawRanges.slice().sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
            const has = ranges.length > 0;
            return (
              <div key={d} className={`min-h-[3rem] sm:min-h-[4rem] rounded-lg border-2 p-1 sm:p-2 transition-all hover:shadow-md ${has ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`} title={d}>
                <div className="text-center text-xs sm:text-sm font-bold text-gray-800 mb-1 sm:mb-2">{d.slice(-2)}</div>
                {has ? (
                  <div className="flex flex-wrap gap-0.5 sm:gap-1 justify-center">
                    {ranges.map((r, i) => {
                      const appt = getAppointmentForSlot(d, r.start, r.end);
                      const isBooked = !!appt;
                      return (
                        <div key={i} className="relative inline-flex">
                          <button
                            onClick={() => setCancelTarget({ id: r.id, date: d, start: r.start, end: r.end })}
                            className={`px-1 sm:px-2 py-0.5 sm:py-1 rounded-lg text-white text-xs font-medium transition-all hover:scale-105 shadow-sm ${isBooked ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'}`}
                            title={isBooked ? t('Κρατημένη - κλικ για ακύρωση', 'Booked - click to cancel') : t('Διαθέσιμη - κλικ για ακύρωση', 'Available - click to cancel')}
                          >
                            {formatClock(r.start)}–{formatClock(r.end)}
                          </button>
                          {isBooked && appt && (
                            <button
                              type="button"
                              onClick={(ev) => { ev.stopPropagation(); ev.preventDefault(); setInfoAppointment(appt); }}
                              className="absolute -top-3 -left-3 bg-white text-blue-600 border border-blue-200 rounded-full p-1 shadow-md hover:bg-blue-50"
                              title={t('Πληροφορίες κράτησης', 'Booking info')}
                            >
                              <Info className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-xs text-red-500 font-medium">—</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 🗑️ Bulk cancel */}
      <div className="bg-gradient-to-br from-red-50 to-pink-100 rounded-2xl border-2 border-red-200 shadow-lg p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800 font-poppins">{t('Μαζική Ακύρωση', 'Bulk Cancel')}</h3>
          <p className="text-sm text-gray-600">{t('Ακυρώστε διαθεσιμότητες σε εύρος ημερομηνιών.', 'Cancel availability in a date range.')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('Από', 'From')}</label>
            <input type="date" value={bulkFrom} min={todayStr} onChange={(e) => setBulkFrom(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('Μέχρι', 'To')}</label>
            <input type="date" value={bulkTo} min={todayStr} onChange={(e) => setBulkTo(e.target.value)} className={inputCls} />
          </div>
          <div>
            <button disabled={bulkLoading} onClick={runBulkCancel} className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold py-3 rounded-xl hover:from-red-700 hover:to-pink-700 disabled:opacity-50 transition-all shadow">
              {bulkLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
              {t('Μαζική Ακύρωση', 'Bulk Cancel')}
            </button>
          </div>
        </div>
        <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm text-red-700">
            ⚠️ {t('Θα διαγραφούν διαθεσιμότητες και οι σχετικές κρατήσεις στο εύρος.', 'Availability and related bookings in the range will be deleted.')}
          </p>
        </div>
      </div>

      {/* Cancel modal */}
      {cancelTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={() => !isCancelling && setCancelTarget(null)}>
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-lg shadow-2xl border-2 border-red-200" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-red-600 text-2xl">⚠️</span></div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{t('Ακύρωση Διαθεσιμότητας', 'Cancel Availability')}</h3>
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="text-base sm:text-lg font-semibold text-gray-800">{cancelTarget.date}</div>
                <div className="text-sm text-gray-600">{formatClock(cancelTarget.start)} – {formatClock(cancelTarget.end)}</div>
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-700 font-medium">
                ⚠️ {t('Θα διαγραφούν τυχόν κρατήσεις σε αυτή τη διαθεσιμότητα.', 'Any bookings on this availability will be deleted.')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button disabled={isCancelling} onClick={() => setCancelTarget(null)} className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50">{t('Άκυρο', 'Cancel')}</button>
              <button disabled={isCancelling} onClick={handleCancelAvailability} className="px-6 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50 shadow-lg">
                {isCancelling ? t('⏳ Ακύρωση...', '⏳ Cancelling...') : t('🗑️ Ακύρωση', '🗑️ Cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info modal */}
      {infoAppointment && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4" onClick={() => setInfoAppointment(null)}>
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-blue-200 p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setInfoAppointment(null)} className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
            <div className="text-center mb-4">
              <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3"><Info className="w-8 h-8" /></div>
              <h3 className="text-2xl font-bold text-gray-800">{t('Λεπτομέρειες Κράτησης', 'Booking Details')}</h3>
              <p className="text-sm text-gray-500 mt-1">{infoAppointment.date} • {formatClock(infoAppointment.time.slice(0, 5))}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">{t('Στοιχεία Γονέα', 'Parent Info')}</h4>
                <p className="text-sm text-gray-700"><strong>{t('Όνομα', 'Name')}:</strong> {infoAppointment.parent_name || '—'}</p>
                <p className="text-sm text-gray-700 break-all"><strong>Email:</strong> {infoAppointment.email || '—'}</p>
                {infoAppointment.phone && <p className="text-sm text-gray-700"><strong>{t('Τηλέφωνο', 'Phone')}:</strong> {infoAppointment.phone}</p>}
              </div>
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <h4 className="text-sm font-semibold text-green-800 mb-2">{t('Πληροφορίες', 'Information')}</h4>
                {infoAppointment.child_age && <p className="text-sm text-gray-700"><strong>{t('Ηλικία παιδιού', 'Child age')}:</strong> {infoAppointment.child_age}</p>}
                {infoAppointment.specialty && <p className="text-sm text-gray-700"><strong>{t('Ειδικότητα', 'Specialty')}:</strong> {infoAppointment.specialty}</p>}
                {infoAppointment.thematology && <p className="text-sm text-gray-700"><strong>{t('Θεματολογία', 'Topic')}:</strong> {infoAppointment.thematology}</p>}
                {infoAppointment.is_first_session !== undefined && <p className="text-sm text-gray-700"><strong>{t('Πρώτη συνεδρία', 'First session')}:</strong> {infoAppointment.is_first_session ? t('Ναι', 'Yes') : t('Όχι', 'No')}</p>}
              </div>
            </div>
            {infoAppointment.concerns && (
              <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">{t('Σχόλια / Ανησυχίες', 'Notes / Concerns')}</h4>
                <p className="text-sm text-gray-700 whitespace-pre-line">{infoAppointment.concerns}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAvailabilityManager;
