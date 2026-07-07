-- ============================================================================
-- Προσθήκη της νέας ιατρού «Νίκη Τσιμπίδη» στη βάση (Supabase → SQL Editor)
-- Ειδικότητα: Ψυχολόγος
-- ============================================================================
--
-- ⚠️ ΠΡΟΣΟΧΗ ΤΙΜΗ / TEST MODE:
--   Η κανονική τιμή συνεδρίας της Νίκης Τσιμπίδη είναι €80 (8000 cents).
--   ΠΡΟΣΩΡΙΝΑ ορίζουμε 0,60€ (60 cents) ώστε να γίνει ΕΝΑ χειροκίνητο test
--   πραγματικής συναλλαγής πριν το τελικό deploy.
--   Το checkout σε live χρησιμοποιεί το ποσό από το frontend
--   (src/config/stripe-doctor-overrides.ts → amountCents). Ο πίνακας
--   stripe_products κρατιέται ευθυγραμμισμένος για αναφορές/UI.
--   Μετά το test, τρέξε το update στο τέλος του αρχείου (βλ. ΒΗΜΑ 4) για €80.
-- ----------------------------------------------------------------------------

-- 1. Νέα ιατρός (ίδιο pattern με add_maria_dimitriadou.sql)
INSERT INTO doctors (name, specialty, active) VALUES
  ('Νίκη Τσιμπίδη', 'Ψυχολόγος', true)
ON CONFLICT (name) DO UPDATE SET
  specialty = EXCLUDED.specialty,
  active = EXCLUDED.active;

-- 2. Stripe product placeholder — ΠΡΟΣΩΡΙΝΑ 0,60€ (60 cents) για το test
INSERT INTO public.stripe_products (doctor_id, stripe_product_id, stripe_price_id, price_amount_cents, currency)
VALUES (
  (SELECT id FROM public.doctors WHERE name = 'Νίκη Τσιμπίδη'),
  'placeholder_niki_tsimpidi_product',
  'placeholder_niki_tsimpidi_price',
  60,
  'eur'
)
ON CONFLICT (stripe_product_id) DO UPDATE SET
  price_amount_cents = EXCLUDED.price_amount_cents,
  updated_at = now();

-- 3. Έλεγχος ότι προστέθηκαν σωστά
SELECT id, name, specialty, active FROM doctors
WHERE name = 'Νίκη Τσιμπίδη';

SELECT sp.stripe_product_id, sp.stripe_price_id, sp.price_amount_cents, sp.currency, d.name AS doctor_name
FROM public.stripe_products sp
JOIN public.doctors d ON sp.doctor_id = d.id
WHERE d.name = 'Νίκη Τσιμπίδη';

-- ----------------------------------------------------------------------------
-- 4. ⏭️ ΜΕΤΑ ΤΟ TEST: όρισε την κανονική τιμή €80 (8000 cents)
--    Τρέξε ΚΑΙ το παρακάτω UPDATE ΚΑΙ άλλαξε το amountCents σε 8000 στο
--    src/config/stripe-doctor-overrides.ts (η μόνη πηγή τιμής στο live checkout).
-- ----------------------------------------------------------------------------
-- UPDATE public.stripe_products
-- SET price_amount_cents = 8000, updated_at = now()
-- WHERE doctor_id = (SELECT id FROM public.doctors WHERE name = 'Νίκη Τσιμπίδη');
