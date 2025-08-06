import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@components/Layout';
import Home from './pages/Home/Home';
import Form from './pages/Form/Form';
import Login from './pages/Login/Login';
import Overview from './pages/Overview/Overview';
import Annuaire from './pages/Annuaire/Annuaire';
import { ProgressProvider } from './context/ProgressContext';

const AppRouter = () => (
  <BrowserRouter>
    <ProgressProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<Form />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/annuaire" element={<Annuaire />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </ProgressProvider>
  </BrowserRouter>
);

export default AppRouter;