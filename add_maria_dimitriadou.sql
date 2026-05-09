-- Προσθήκη της νέας ιατρού Μαρία Κ. Δημητριάδου στη βάση
-- Αντίγραψε και επικόλλησε αυτές τις εντολές στο SQL Editor του Supabase

-- 1. Νέα ιατρός (ίδιο pattern με add_doctors.sql)
-- Η Μαρία Κ. Δημητριάδου ανήκει στην κατηγορία «Κλινική Παιδοψυχολόγος & Ψυχοθεραπεύτρια»
INSERT INTO doctors (name, specialty, active) VALUES
  ('Μαρία Κ. Δημητριάδου', 'Κλινική Παιδοψυχολόγος & Ψυχοθεραπεύτρια', true)
ON CONFLICT (name) DO UPDATE SET
  specialty = EXCLUDED.specialty,
  active = EXCLUDED.active;

-- 2. Stripe product placeholder για €80 (8000 cents) ανά συνεδρία
-- Σε live mode το create-checkout-session.js χρησιμοποιεί το amount από το frontend (stripe-doctor-overrides.ts).
-- Το stripe_products.price_amount_cents κρατιέται ευθυγραμμισμένο για αναφορές/UI που διαβάζουν τη βάση.
INSERT INTO public.stripe_products (doctor_id, stripe_product_id, stripe_price_id, price_amount_cents, currency)
VALUES (
  (SELECT id FROM public.doctors WHERE name = 'Μαρία Κ. Δημητριάδου'),
  'placeholder_maria_dimitriadou_product',
  'placeholder_maria_dimitriadou_price',
  8000,
  'eur'
)
ON CONFLICT (stripe_product_id) DO UPDATE SET
  price_amount_cents = EXCLUDED.price_amount_cents,
  updated_at = now();

-- 3. Έλεγχος ότι προστέθηκαν σωστά
SELECT id, name, specialty, active FROM doctors
WHERE name = 'Μαρία Κ. Δημητριάδου';

SELECT sp.stripe_product_id, sp.stripe_price_id, sp.price_amount_cents, sp.currency, d.name AS doctor_name
FROM public.stripe_products sp
JOIN public.doctors d ON sp.doctor_id = d.id
WHERE d.name = 'Μαρία Κ. Δημητριάδου';
