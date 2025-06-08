import React, { createContext, useContext, useState } from 'react';

interface ProgressContextType {
  currentStep: number;
  totalSteps: number;
  setCurrentStep: (step: number) => void;
  setTotalSteps: (total: number) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress must be used within a ProgressProvider');
  return context;
};

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(1);

  return (
    <ProgressContext.Provider value={{ currentStep, totalSteps, setCurrentStep, setTotalSteps }}>
      {children}
    </ProgressContext.Provider>
  );
};
