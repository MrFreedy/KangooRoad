import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@components/Layout';
import Home from './pages/Home/Home';
import Form from './pages/Form/Form';
import Login from './pages/Login/Login';
import Overview from './pages/Overview/Overview';
import Annuaire from './pages/Annuaire/Annuaire';
import { ProgressProvider } from './context/ProgressContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './PrivateRoute';

function LoginGate() {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement…</div>;
  if (user) return <Navigate to="/" replace />;
  return <Login />;
}

const AppRouter = () => (
  <BrowserRouter>
    <AuthProvider>
      <ProgressProvider>
        <Routes>
          {/* Privé */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/form" element={<Form />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/annuaire" element={<Annuaire />} />
            </Route>
          </Route>

          {/* Public */}
          <Route path="/login" element={<LoginGate />} />
        </Routes>
      </ProgressProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default AppRouter;