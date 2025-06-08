import React from 'react';
import './Headbar.css';
import Logo from '../../assets/logo.svg';
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
    <header className="headbar mb-6">
      <div className="headbar-left"></div>
      <div className="headbar-center">
        <img src={Logo} alt="Logo" className="logo" />
          {isFormPage && currentStep !== undefined && totalSteps !== undefined && (
            <div className="w-full max-w-md mx-auto bg-gray-300 rounded h-6 relative">
              <div
                id="progressBar"
                className="bg-green-500 h-6 rounded flex items-center justify-center text-white font-bold text-sm"
                style={{ width: `${progressPercent}%` }}
              >
                <span className="absolute inset-0 flex items-center justify-center text-gray-800 font-bold text-sm">
                  Étape {currentStep} sur {totalSteps}
                </span>
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
