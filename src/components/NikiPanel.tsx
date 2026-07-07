import React from 'react';
import DoctorPanel from './DoctorPanel';

interface NikiPanelProps {
  language: 'gr' | 'en';
  onLogout?: () => void;
}

const NikiPanel: React.FC<NikiPanelProps> = ({ language, onLogout }) => {
  return (
    <DoctorPanel
      doctorName="Νίκη Τσιμπίδη"
      doctorId="" // Δεν χρειάζεται πλέον - βρίσκεται με βάση το όνομα
      language={language}
      onLogout={onLogout}
    />
  );
};

export default NikiPanel;
