import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home/Home';
import Form from './pages/Form/Form';
import { ProgressProvider } from './context/ProgressContext';

const AppRouter = () => (
  <BrowserRouter>
    <ProgressProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<Form />} />
        </Route>
      </Routes>
    </ProgressProvider>
  </BrowserRouter>
);

export default AppRouter;