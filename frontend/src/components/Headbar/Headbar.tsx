import React from 'react';
import { useState } from 'react';
import './Headbar.css';
import Logo from '@assets/logo.svg';
import { RiArrowLeftLine, RiDoorLine, RiDoorOpenLine, RiKeyLine } from '@remixicon/react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

interface HeadbarProps {
  currentStep?: number;
  totalSteps?: number;
}

const Headbar: React.FC<HeadbarProps> = ({ currentStep, totalSteps}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isFormPage = location.pathname === '/form';
  const isOverviewPage = location.pathname === '/overview';
  const showConnectionButton = location.pathname === '/';
  const showBackButton = location.pathname === '/overview' || location.pathname === '/annuaire' || location.pathname === '/policy';

  const isLoggedIn = Boolean(localStorage.getItem('token'));

  const [isHovered, setIsHovered] = useState(false);
  const progressPercent =
    currentStep && totalSteps ? Math.round((currentStep / totalSteps) * 100) : 0;


  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };
  
  return (
    <header
      className="headbar flex items-center justify-between p-4 mb-4"
      style={{
        ...(showBackButton && { flexDirection: 'row' }),
        ...(showConnectionButton && { flexDirection: 'row-reverse' }),
        ...(isFormPage && { padding: '60px 20px' }),
      }}
    >
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

      {showBackButton && (
        <div>
          <button className="back-button bg-blue-500 hover:bg-blue-600 text-white" onClick={() => {
            if (isOverviewPage && sessionStorage.getItem('insideFeedbacks') === 'true') {
              sessionStorage.removeItem('insideFeedbacks');
              navigate('/overview', { replace: true, state: { reset: true } });
            } else {
              navigate('/');
            }
          }}>
            <span className="flex items-center gap-2 font-bold">
              <RiArrowLeftLine />
              <span className="hidden sm:inline">Retour</span>
            </span>
          </button>
        </div>
      )}

      {showConnectionButton && isLoggedIn && (
        <div>
          <button
            className="admin-button"
            onClick={() => handleLogout()}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <span className="flex items-center gap-2 font-bold">
              {isHovered ? <RiDoorOpenLine /> : <RiDoorLine />}
              <span className="hidden sm:inline">Se déconnecter</span>
            </span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Headbar;
