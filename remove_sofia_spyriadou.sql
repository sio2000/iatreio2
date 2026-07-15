-- ============================================================
-- Αφαίρεση ιατρού Σοφίας Σπυριάδου — ΜΟΝΟ αυτής
-- Τρέξτε το στο Supabase SQL Editor (όλο μαζί ή βήμα-βήμα).
--
-- ΓΙΑΤΙ soft-delete (active=false) και ΟΧΙ DELETE:
-- 9 πίνακες έχουν foreign key στο doctors.id (appointments, payments,
-- availability, stripe_products, waiting_list, clinic_closures,
-- session_deposits, session_deposit_transactions, availability_templates)
-- ΧΩΡΙΣ ON DELETE CASCADE. DELETE της γραμμής της είτε θα αποτύχει
-- είτε θα κατέστρεφε ιστορικά ραντεβού/πληρωμές.
--
-- Με active=false:
--   * Admin panel: τη φορτώνει με .eq('active', true) -> εξαφανίζεται
--   * Booking form / User panel: φιλτράρουν active=true -> εξαφανίζεται
--   * generate-monthly-availability (scheduled): παράγει slots μόνο για
--     active=true -> σταματά να δημιουργεί πρόγραμμά της
--   * Ιστορικά ραντεβού/πληρωμές της: μένουν άθικτα
-- ============================================================

-- ΒΗΜΑ 1 — Προεπισκόπηση: δείτε ΤΙ θα επηρεαστεί (πρέπει να γυρίσει
-- ΑΚΡΙΒΩΣ 1 γραμμή, τη δική της):
SELECT id, name, specialty, active
FROM public.doctors
WHERE name ILIKE '%Σπυριάδου%' OR name ILIKE '%Spyriadou%';

-- ΒΗΜΑ 2 — Απενεργοποίηση (μόνο αν το ΒΗΜΑ 1 έδειξε 1 σωστή γραμμή):
UPDATE public.doctors
SET active = false
WHERE name ILIKE '%Σπυριάδου%' OR name ILIKE '%Spyriadou%';

-- ΒΗΜΑ 3 — Επιβεβαίωση: η Σπυριάδου πρέπει να έχει active = false,
-- όλοι οι υπόλοιποι αμετάβλητοι:
SELECT id, name, specialty, active
FROM public.doctors
ORDER BY name;

-- ============================================================
-- ΠΡΟΑΙΡΕΤΙΚΟ (καθάρισμα προγράμματος — ασφαλές, κανένας πίνακας
-- δεν δείχνει σε availability/availability_templates):
-- Σβήνει το εβδομαδιαίο template της + τα ΜΕΛΛΟΝΤΙΚΑ κενά slots της,
-- ώστε να μην επανεμφανιστούν αν κάποιος την ξανακάνει active κατά λάθος.
-- Ξε-σχολιάστε για να τρέξουν:
-- ============================================================

-- DELETE FROM public.availability_templates
-- WHERE doctor_id IN (
--   SELECT id FROM public.doctors
--   WHERE name ILIKE '%Σπυριάδου%' OR name ILIKE '%Spyriadou%'
-- );

-- DELETE FROM public.availability
-- WHERE date >= CURRENT_DATE
--   AND doctor_id IN (
--     SELECT id FROM public.doctors
--     WHERE name ILIKE '%Σπυριάδου%' OR name ILIKE '%Spyriadou%'
--   );

-- ΣΗΜΑΝΤΙΚΟ: ΜΗΝ τρέξετε ΠΟΤΕ:
--   DELETE FROM public.doctors WHERE ...
-- Θα αποτύχει λόγω foreign keys ή θα καταστρέψει ιστορικό.
