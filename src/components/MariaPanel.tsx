import React from 'react';
import DoctorPanel from './DoctorPanel';

interface MariaPanelProps {
  language: 'gr' | 'en';
  onLogout?: () => void;
}

const MariaPanel: React.FC<MariaPanelProps> = ({ language, onLogout }) => {
  return (
    <DoctorPanel
      doctorName="Μαρία Κ. Δημητριάδου"
      doctorId="" // Δεν χρειάζεται πλέον - βρίσκεται με βάση το όνομα
      language={language}
      onLogout={onLogout}
    />
  );
};

export default MariaPanel;
