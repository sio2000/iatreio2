import React, { useState } from 'react';
import AdminPanel from '../components/AdminPanel';
import PanelLogin from '../components/PanelLogin';
import { isAuthed, logout } from '../lib/panelAuth';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => isAuthed('admin'));

  const handleLogout = () => {
    logout('admin');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <PanelLogin
        identityKey="admin"
        language="gr"
        title="Ιατρείο — Admin Σύνδεση"
        hideEmailHint
        onSuccess={() => setIsAuthenticated(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminPanel language="gr" onLogout={handleLogout} />
    </div>
  );
};

export default Admin;
