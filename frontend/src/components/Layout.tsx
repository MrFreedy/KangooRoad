import React from 'react';
import Headbar from './Headbar/Headbar';
import Footbar from './Footbar/Footbar';
import { Outlet } from 'react-router-dom';
import { useProgress } from '@context/ProgressContext';

const Layout: React.FC = () => {
  const { currentStep, totalSteps } = useProgress();
  return (
    <>
      <Headbar currentStep={currentStep} totalSteps={totalSteps} />
      <main>
        <Outlet />
      </main>
      <Footbar />
    </>
  );
};

export default Layout;
