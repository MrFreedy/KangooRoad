// src/pages/Login.tsx
import './Login.css';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DarkLogo from '@assets/logo-dark.svg';
import api from '@src/services/apiService';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrMsg('');
    setLoading(true);
    try {
      const res = await api.login(email.trim(), password);

      if ((res as any)?.success) {
        localStorage.setItem('token', res.token);
        window.location.href = '/';
        return;
      }

      setErrMsg((res as any)?.message || 'Identifiants incorrects');

    } catch (error: any) {
      console.error('Erreur lors de la connexion :', error);
      const msg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        'Une erreur est survenue. Réessaie.';
      setErrMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <img src={DarkLogo} alt="Logo" className="mx-auto mb-4" />
          <h1 className="text-2xl text-gray-900 font-bold mb-4 text-center">
            Connexion
          </h1>

          <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
            <input
              type="email"
              placeholder="Email"
              className="p-2 border rounded"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Mot de passe"
              className="p-2 border rounded"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {errMsg && (
              <p className="text-red-600 text-sm" role="alert">
                {errMsg}
              </p>
            )}

            <button
              type="submit"
              className="login-button disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded cursor-pointer"
            >
              Retour
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;