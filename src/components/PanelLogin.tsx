import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { login } from '../lib/panelAuth';

interface PanelLoginProps {
  identityKey: string;
  language: 'gr' | 'en';
  title?: string;
  onSuccess: () => void;
}

const PanelLogin: React.FC<PanelLoginProps> = ({ identityKey, language, title, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const content = {
    gr: {
      title: title || 'Σύνδεση',
      subtitle: 'Εισάγετε το email και τον κωδικό σας για να συνεχίσετε',
      emailLabel: 'Email',
      emailPlaceholder: 'το email σας',
      passwordLabel: 'Κωδικός Πρόσβασης',
      passwordPlaceholder: 'ο κωδικός σας',
      loginButton: 'Σύνδεση',
      loggingIn: 'Σύνδεση...',
      errorMessage: 'Λάθος email ή κωδικός'
    },
    en: {
      title: title || 'Login',
      subtitle: 'Enter your email and password to continue',
      emailLabel: 'Email',
      emailPlaceholder: 'your email',
      passwordLabel: 'Password',
      passwordPlaceholder: 'your password',
      loginButton: 'Login',
      loggingIn: 'Logging in...',
      errorMessage: 'Incorrect email or password'
    }
  };
  const c = content[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const ok = await login(identityKey, email, password);
    setIsLoading(false);
    if (ok) {
      onSuccess();
    } else {
      setError(c.errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-100"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-full w-fit mx-auto mb-6"
          >
            <Lock className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 font-poppins">{c.title}</h1>
          <p className="text-gray-600 font-nunito">{c.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 font-poppins">{c.emailLabel}</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={c.emailPlaceholder}
                autoComplete="username"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-nunito text-lg"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 font-poppins">{c.passwordLabel}</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={c.passwordPlaceholder}
                autoComplete="current-password"
                className="w-full px-4 py-4 pr-12 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-nunito text-lg"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl font-nunito flex items-center space-x-2"
            >
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={isLoading || !email.trim() || !password.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-2xl font-semibold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                <span>{c.loggingIn}</span>
              </>
            ) : (
              <>
                <Lock className="h-5 w-5" />
                <span>{c.loginButton}</span>
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default PanelLogin;
