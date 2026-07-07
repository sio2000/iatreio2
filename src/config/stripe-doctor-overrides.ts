export interface DoctorStripeOverride {
  doctorId?: string;
  doctorName?: string;
  priceId: string;
  amountCents: number;
}

export const normalizeDoctorOverrideKey = (value?: string) =>
  (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

export const doctorStripeOverrides: DoctorStripeOverride[] = [
  // Μαρία Κ. Δημητριάδου: €80 ανά συνεδρία (checkout σε live χρησιμοποιεί amount από frontend · το placeholder price id στο Stripe είναι διακοσμητικό)
  {
    doctorName: 'Μαρία Κ. Δημητριάδου',
    priceId: 'placeholder_maria_dimitriadou_price',
    amountCents: 8000
  },
  // Νίκη Τσιμπίδη: κανονική τιμή €80 ανά συνεδρία.
  // ⚠️ TEST MODE: προσωρινά 0,60€ (60 cents) για χειροκίνητο test πραγματικής συναλλαγής.
  //    Πριν το τελικό deploy άλλαξε το amountCents σε 8000 (= €80).
  {
    doctorName: 'Νίκη Τσιμπίδη',
    priceId: 'placeholder_niki_tsimpidi_price',
    amountCents: 60
  }
];

export const findDoctorStripeOverride = (
  doctorId?: string,
  doctorName?: string
): DoctorStripeOverride | undefined => {
  const normalizedId = normalizeDoctorOverrideKey(doctorId);
  const normalizedName = normalizeDoctorOverrideKey(doctorName);

  return doctorStripeOverrides.find((override) => {
    if (override.doctorId && normalizedId) {
      if (normalizeDoctorOverrideKey(override.doctorId) === normalizedId) {
        return true;
      }
    }

    if (override.doctorName && normalizedName) {
      if (normalizeDoctorOverrideKey(override.doctorName) === normalizedName) {
        return true;
      }
    }

    return false;
  });
};


