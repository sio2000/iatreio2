/**
 * Configuration για timezones των γιατρών
 * Προσθέστε εδώ τους γιατρούς που είναι από Ελβετία
 */

export const DOCTORS_IN_SWITZERLAND: Set<string> = new Set([
  // Όλοι οι γιατροί του admin προγράμματος λειτουργούν με ώρα Ελβετίας.
  'Dr. Άννα Μαρία Φύτρου',
  'Dr. Anna-Maria Fytrou',
  'Dr. Anna Maria Fytrou',
  'Δρ. Άννα Μαρία Φύτρου',
  'Δρ. Άννα-Μαρία Φύτρου',
  'Άννα Μαρία Φύτρου',
  'Άννα-Μαρία Φύτρου',
  'Ιωάννα Πισσάρη',
  'Ioanna Pissari',
  'Σοφία Σπυριάδου',
  'Sofia Spyriadou',
  'Ειρήνη Στεργίου',
  'Eirini Stergiou',
  'Μαρία Κ. Δημητριάδου',
  'Maria K. Dimitriadou',
  'Maria Dimitriadou'
]);

/**
 * Ελέγχει αν ένας γιατρός είναι από Ελβετία
 */
export function isDoctorInSwitzerland(doctorName?: string | null): boolean {
  if (!doctorName) return false;
  return DOCTORS_IN_SWITZERLAND.has(doctorName.trim());
}

