-- Προσθήκη της νέας ιατρού Μαρία Κ. Δημητριάδου στη βάση
-- Αντίγραψε και επικόλλησε αυτές τις εντολές στο SQL Editor του Supabase

-- 1. Νέα ιατρός (ίδιο pattern με add_doctors.sql)
-- Η Μαρία Κ. Δημητριάδου ανήκει στην κατηγορία «Κλινική Παιδοψυχολόγος & Ψυχοθεραπεύτρια»
INSERT INTO doctors (name, specialty, active) VALUES
  ('Μαρία Κ. Δημητριάδου', 'Κλινική Παιδοψυχολόγος & Ψυχοθεραπεύτρια', true)
ON CONFLICT (name) DO UPDATE SET
  specialty = EXCLUDED.specialty,
  active = EXCLUDED.active;

-- 2. Stripe product placeholder για €1 (100 cents) test
-- Σε live mode το create-checkout-session.js αγνοεί το stripe_price_id και χρησιμοποιεί price_data,
-- οπότε τα placeholder ids είναι ασφαλή. Επιπλέον, το stripe-doctor-overrides.ts entry παρακάμπτει
-- τελείως το stripe_products query για τη Μαρία στο frontend.
INSERT INTO public.stripe_products (doctor_id, stripe_product_id, stripe_price_id, price_amount_cents, currency)
VALUES (
  (SELECT id FROM public.doctors WHERE name = 'Μαρία Κ. Δημητριάδου'),
  'placeholder_maria_dimitriadou_product',
  'placeholder_maria_dimitriadou_price',
  100,
  'eur'
)
ON CONFLICT (stripe_product_id) DO NOTHING;

-- 3. Έλεγχος ότι προστέθηκαν σωστά
SELECT id, name, specialty, active FROM doctors
WHERE name = 'Μαρία Κ. Δημητριάδου';

SELECT sp.stripe_product_id, sp.stripe_price_id, sp.price_amount_cents, sp.currency, d.name AS doctor_name
FROM public.stripe_products sp
JOIN public.doctors d ON sp.doctor_id = d.id
WHERE d.name = 'Μαρία Κ. Δημητριάδου';
