-- Τιμή συνεδρίας για Μαρία Κ. Δημητριάδου: €80 (8000 cents)
-- Τρέξε το στο Supabase SQL Editor αν η γραμμή στο stripe_products υπάρχει ήδη με παλιό ποσό (π.χ. δοκιμή €1).
-- Το checkout στο live χρησιμοποιεί το ποσό από το frontend (src/config/stripe-doctor-overrides.ts)·
-- αυτό το UPDATE κρατά συγχρονισμένο τον πίνακα stripe_products για αναφορές και συνέπεια.

UPDATE public.stripe_products
SET
  price_amount_cents = 8000,
  updated_at = now()
WHERE doctor_id = (SELECT id FROM public.doctors WHERE name = 'Μαρία Κ. Δημητριάδου');

SELECT d.name AS doctor_name, sp.stripe_product_id, sp.price_amount_cents, sp.currency
FROM public.stripe_products sp
JOIN public.doctors d ON d.id = sp.doctor_id
WHERE d.name = 'Μαρία Κ. Δημητριάδου';
