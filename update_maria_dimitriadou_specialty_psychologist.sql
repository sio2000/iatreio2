-- =============================================================================
-- ΜΟΝΗ αλλαγή: Μαρία Κ. Δημητριάδου → ειδικότητα «Ψυχολόγος»
-- Τρέξε στο Supabase → SQL Editor (τμήμα-τμήμα ή όλο μαζί)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- ΒΗΜΑ 1: Τι υπάρχει ΤΩΡΑ στη βάση (τρέξε πρώτα αυτά)
-- -----------------------------------------------------------------------------

-- Όλοι οι γιατροί και οι ειδικότητές τους
SELECT id, name, specialty, active
FROM public.doctors
ORDER BY specialty, name;

-- Μόνο η Μαρία (αν δεν επιστρέψει γραμμή, δες το ΒΗΜΑ 1β)
SELECT id, name, specialty, active
FROM public.doctors
WHERE name = 'Μαρία Κ. Δημητριάδου';

-- 1β) Αν το πάνω είναι κενό — ψάξε με τμήμα ονόματος
SELECT id, name, specialty, active
FROM public.doctors
WHERE name ILIKE '%Δημητριάδου%'
   OR name ILIKE '%Dimitriadou%';

-- Ραντεβού της Μαρίας (ειδικότητα όπως αποθηκεύτηκε στο appointment)
SELECT a.id, a.date, a.time, a.specialty AS appointment_specialty,
       d.name AS doctor_name, d.specialty AS doctor_specialty
FROM public.appointments a
JOIN public.doctors d ON d.id = a.doctor_id
WHERE d.name ILIKE '%Δημητριάδου%'
ORDER BY a.date DESC, a.time DESC
LIMIT 20;


-- -----------------------------------------------------------------------------
-- ΒΗΜΑ 2: ΔΙΟΡΘΩΣΗ (μόνο Μαρία Κ. Δημητριάδου — τίποτα άλλο)
-- -----------------------------------------------------------------------------

UPDATE public.doctors
SET specialty = 'Ψυχολόγος'
WHERE name = 'Μαρία Κ. Δημητριάδου';

-- Αν το UPDATE πάνω έβγαλε 0 rows, χρησιμοποίησε αυτό (ίδιο αποτέλεσμα, μία γραμμή):
-- UPDATE public.doctors
-- SET specialty = 'Ψυχολόγος'
-- WHERE id = (
--   SELECT id FROM public.doctors
--   WHERE name ILIKE '%Δημητριάδου%'
--   LIMIT 1
-- );

-- Συγχρονισμός πεδίου specialty στα ραντεβού ΤΗΣ Μαρίας μόνο (όχι άλλων γιατρών)
UPDATE public.appointments
SET specialty = 'Ψυχολόγος'
WHERE doctor_id = (
  SELECT id FROM public.doctors WHERE name = 'Μαρία Κ. Δημητριάδου'
);


-- -----------------------------------------------------------------------------
-- ΒΗΜΑ 3: Έλεγχος μετά την αλλαγή
-- -----------------------------------------------------------------------------

SELECT id, name, specialty, active
FROM public.doctors
WHERE name = 'Μαρία Κ. Δημητριάδου';

-- Οι υπόλοιποι γιατροί δεν πρέπει να άλλαξαν
SELECT id, name, specialty, active
FROM public.doctors
ORDER BY specialty, name;

-- Μαρία πρέπει να εμφανίζεται μόνο ως Ψυχολόγος
SELECT COUNT(*) AS maria_as_psychologist
FROM public.doctors
WHERE name = 'Μαρία Κ. Δημητριάδου'
  AND specialty = 'Ψυχολόγος';
