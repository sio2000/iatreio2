/**
 * Configuration για timezones των γιατρών
 * Προσθέστε εδώ τους γιατρούς που είναι από Ελβετία
 */

// ⚠️ ΜΟΝΟ η Δρ. Φύτρου λειτουργεί με ώρα Ελβετίας (Europe/Zurich).
// Όλες οι υπόλοιπες ιατροί λειτουργούν πλέον με Ελληνική ώρα (Europe/Athens):
// συμπληρώνουν το πρόγραμμά τους από τα δικά τους panel σε Ελληνική ώρα και
// εμφανίζεται απευθείας σε Ελληνική ώρα σε ασθενείς/παντού.
export const DOCTORS_IN_SWITZERLAND: Set<string> = new Set([
  'Dr. Άννα Μαρία Φύτρου',
  'Dr. Anna-Maria Fytrou',
  'Dr. Anna Maria Fytrou',
  'Δρ. Άννα Μαρία Φύτρου',
  'Δρ. Άννα-Μαρία Φύτρου',
  'Άννα Μαρία Φύτρου',
  'Άννα-Μαρία Φύτρου'
]);

/**
 * Ελέγχει αν ένας γιατρός είναι από Ελβετία
 */
export function isDoctorInSwitzerland(doctorName?: string | null): boolean {
  if (!doctorName) return false;
  return DOCTORS_IN_SWITZERLAND.has(doctorName.trim());
}

