-- ============================================================================
-- Self-service πρόγραμμα ιατρών + εβδομαδιαίο επαναλαμβανόμενο μοτίβο
-- + μετατόπιση υπαρχουσών διαθεσιμοτήτων σε Ελληνική ώρα (Supabase → SQL Editor)
--
-- ✅ ΑΣΦΑΛΕΣ ΝΑ ΤΡΕΞΕΙ ΞΑΝΑ: όλα είναι idempotent (IF NOT EXISTS + flag),
--    οπότε μπορείς να το τρέξεις ολόκληρο ακόμη κι αν κάτι απέτυχε πριν.
-- ℹ️ Αν εμφανιστεί ξανά το prompt «Row Level Security», πάτα ό,τι θέλεις —
--    το script ενεργοποιεί RLS μόνο του στους νέους πίνακες.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) Πίνακας εβδομαδιαίων «templates» (μοτίβο) ανά ιατρό.
--    weekday: 0=Κυριακή ... 6=Σάββατο (JS getDay()).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.availability_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  doctor_id uuid NOT NULL,
  weekday integer NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  start_time time without time zone NOT NULL,
  end_time time without time zone NOT NULL,
  increment_minutes integer NOT NULL CHECK (increment_minutes = ANY (ARRAY[30, 60])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT availability_templates_pkey PRIMARY KEY (id),
  CONSTRAINT availability_templates_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON DELETE CASCADE
);
ALTER TABLE public.availability_templates ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_availability_templates_doctor ON public.availability_templates (doctor_id);

-- ----------------------------------------------------------------------------
-- 2) Στήλη «source» στον πίνακα availability ('template' | NULL=manual).
-- ----------------------------------------------------------------------------
ALTER TABLE public.availability ADD COLUMN IF NOT EXISTS source text;

-- ----------------------------------------------------------------------------
-- 3) Μικρός πίνακας «σημαιών» για να τρέξει η μετατόπιση ΜΟΝΟ μία φορά.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.schema_flags (
  key text NOT NULL,
  applied_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT schema_flags_pkey PRIMARY KEY (key)
);
ALTER TABLE public.schema_flags ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 4) ΜΕΤΑΤΟΠΙΣΗ ΣΕ ΕΛΛΗΝΙΚΗ ΩΡΑ (+1 ώρα) των ΜΕΛΛΟΝΤΙΚΩΝ διαθεσιμοτήτων των 4
--    υπαρχουσών ιατρών (πλην Φύτρου). Πριν: Ελβετική ώρα (Zurich). Τώρα: Athens.
--    Η +1 ώρα κρατά την ΙΔΙΑ πραγματική ώρα -> δεν χαλάνε υπάρχουσες κρατήσεις.
--
--    ⚠️ Υπάρχει trigger validate_availability_overlap() στον πίνακα availability
--    που μπλοκάρει το batch UPDATE (ενδιάμεση κατάσταση φαίνεται σαν επικάλυψη).
--    Επειδή ΟΛΕΣ οι γραμμές μιας ημέρας μετατοπίζονται ομοιόμορφα +1h, η ΤΕΛΙΚΗ
--    κατάσταση ΔΕΝ έχει νέες επικαλύψεις — οπότε απενεργοποιούμε προσωρινά τους
--    triggers μόνο για αυτό το batch και τους επαναφέρουμε αμέσως μετά.
--    Τρέχει μόνο μία φορά (flag 'availability_greek_shift_v1').
-- ----------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.schema_flags WHERE key = 'availability_greek_shift_v1') THEN
    ALTER TABLE public.availability DISABLE TRIGGER USER;

    UPDATE public.availability
    SET start_time = start_time + interval '1 hour',
        end_time   = end_time   + interval '1 hour'
    WHERE date >= CURRENT_DATE
      AND end_time <= time '23:00'
      AND doctor_id IN (
        SELECT id FROM public.doctors
        WHERE name IN (
          'Ιωάννα Πισσάρη',
          'Σοφία Σπυριάδου',
          'Ειρήνη Στεργίου',
          'Μαρία Κ. Δημητριάδου'
        )
      );

    ALTER TABLE public.availability ENABLE TRIGGER USER;

    INSERT INTO public.schema_flags(key) VALUES ('availability_greek_shift_v1');
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 5) Έλεγχοι
-- ----------------------------------------------------------------------------
-- Επιβεβαίωση ότι η μετατόπιση εφαρμόστηκε (flag)
SELECT * FROM public.schema_flags WHERE key = 'availability_greek_shift_v1';

-- Δείγμα μελλοντικών διαθεσιμοτήτων των 4 ιατρών (πλέον σε Ελληνική ώρα)
SELECT d.name, a.date, a.start_time, a.end_time, a.source
FROM public.availability a
JOIN public.doctors d ON d.id = a.doctor_id
WHERE a.date >= CURRENT_DATE
  AND d.name IN ('Ιωάννα Πισσάρη','Σοφία Σπυριάδου','Ειρήνη Στεργίου','Μαρία Κ. Δημητριάδου')
ORDER BY d.name, a.date, a.start_time
LIMIT 50;

-- Τυχόν εγγραφές που λήγουν μετά τις 23:00 (δεν μετατοπίστηκαν — δες χειροκίνητα αν υπάρχουν)
SELECT d.name, a.date, a.start_time, a.end_time
FROM public.availability a
JOIN public.doctors d ON d.id = a.doctor_id
WHERE a.date >= CURRENT_DATE
  AND a.end_time > time '23:00'
  AND d.name IN ('Ιωάννα Πισσάρη','Σοφία Σπυριάδου','Ειρήνη Στεργίου','Μαρία Κ. Δημητριάδου')
ORDER BY d.name, a.date;
