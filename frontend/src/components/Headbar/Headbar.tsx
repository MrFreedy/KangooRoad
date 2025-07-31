import React from 'react';
import './Headbar.css';
import Logo from '@assets/logo.svg';
import { RiVipCrownLine } from '@remixicon/react';
import { useLocation } from 'react-router-dom';

interface HeadbarProps {
  currentStep?: number;
  totalSteps?: number;
  isAdminButtonVisible?: boolean;
}

const Headbar: React.FC<HeadbarProps> = ({ currentStep, totalSteps, isAdminButtonVisible = true }) => {
  const location = useLocation();
  const isFormPage = location.pathname === '/form';
  isAdminButtonVisible = location.pathname === '/';
  
  const progressPercent =
    currentStep && totalSteps ? Math.round((currentStep / totalSteps) * 100) : 0;

  return (
    <header className="headbar flex flex-row-reverse items-center justify-between p-4 mb-4" style={isFormPage ? { padding: "60px 20px" } : {}}>
      <div className="headbar-center flex flex-col items-center w-full">
        <img src={Logo} alt="Logo" className="logo mb-4" style={isFormPage ? {} : {marginTop:"20px"}} />

        {isFormPage && currentStep !== undefined && totalSteps !== undefined && (
          <div className="w-full px-4 sm:px-8 max-w-3xl">
            <div className="bg-gray-300 rounded h-6 relative w-full">
              <div
                id="progressBar"
                className="bg-green-500 h-6 rounded flex items-center justify-center text-white font-bold text-sm transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              >
                <span className="absolute inset-0 flex items-center justify-center text-gray-800 font-bold text-sm">
                  Étape {currentStep} sur {totalSteps}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {isAdminButtonVisible && (
        <div className="headbar-right">
          <button className="admin-button">
            <span className="flex items-center gap-2 font-bold">
              <RiVipCrownLine />
              <span className="hidden sm:inline">Administrateur</span>
            </span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Headbar;
