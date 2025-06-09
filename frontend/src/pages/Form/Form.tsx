import './Form.css';
import { useEffect, useState } from 'react';
import { RiTimeLine } from '@remixicon/react';
import { useProgress } from '../../context/ProgressContext';
import QuestionField from '../../components/QuestionField/QuestionField';

interface Question {
  id: number;
  sectionId: number;
  type: string;
  content: string;
  is_mandatory: boolean;
  options?: any;
  is_details?: boolean;
  order: number;
}

interface Section {
  id: number;
  name: string;
  order: number;
  is_active: boolean;
  questions: Question[];
}

const sectionsData = [
  { id: 1, name: "Informations Personnelles 👤", order: 1, is_active: false },
  { id: 6, name: "Culture et Coutumes Locales 🗺️", order: 6, is_active: true },
  { id: 5, name: "Vie Sociale et Intégration 👥", order: 5, is_active: true },
  { id: 9, name: "Évaluation Générale et Suggestions 💯", order: 9, is_active: true },
  { id: 2, name: "Informations sur la mobilité 🗺️", order: 2, is_active: true },
  { id: 7, name: "Logement 🏠", order: 7, is_active: true },
  { id: 8, name: "Coût de la Vie 💶", order: 8, is_active: true },
  { id: 4, name: "Aspects Académiques 🏫", order: 4, is_active: true }
];

const questionsData: Question[] = [
  { id: 1, sectionId: 1, type: 'text', content: 'Nom', options: null, order: 1, is_mandatory: true, is_details: false },
  { id: 2, sectionId: 1, type: 'text', content: 'Prénom', options: null, order: 2, is_mandatory: true, is_details: false },
  { id: 3, sectionId: 1, type: 'email', content: 'Email', options: null, order: 3, is_mandatory: false, is_details: false },
  { id: 4, sectionId: 1, type: 'checkbox', content: "En cochant cette case, j'accepte d'être contacté(e) par des étudiants pour partager des informations et des retours d'expérience.", options: [], order: 4, is_mandatory: false, is_details: false },
  { id: 5, sectionId: 1, type: 'select', content: 'Quel était votre âge au moment de la mobilité ?', options: ['18','19','20','21','22','23','24','25','26','27','28','29','30'], order: 5, is_mandatory: true, is_details: false },
  { id: 6, sectionId: 1, type: 'select', content: 'Campus 3iL', options: ['Rodez','Limoges','Nantes'], order: 6, is_mandatory: true, is_details: false },
  { id: 7, sectionId: 1, type: 'select', content: 'Quel était votre statut étudiant ?', options: ['Alternant', 'Etudiant (cycle initial)'], order: 7, is_mandatory: true, is_details: false },
];

function Form() {
  const [step, setStep] = useState(0);
  const [sections, setSections] = useState<Section[]>([]);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [isNextEnabled, setIsNextEnabled] = useState(false);

  const { setCurrentStep, setTotalSteps } = useProgress();

  useEffect(() => {
    const enrichedSections = sectionsData.map(section => ({
      ...section,
      questions: questionsData.filter(q => q.sectionId === section.id)
    }));
    setSections(enrichedSections);
  }, []);

  useEffect(() => {
    if (sections.length > 0) {
      setTotalSteps(sections.length);
      setCurrentStep(step);
    }
  }, [sections, step]);

  const totalSteps = sections.length + 1;

  const handleNext = () => {
    if (step < totalSteps - 1) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  function checkMandatoryFields() {
    const requiredFields = document.querySelectorAll('[data-is-mandatory="true"]');
    const allValid = Array.from(requiredFields).every((el) => {
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) {
        if (el instanceof HTMLInputElement && el.type === 'checkbox') return el.checked;
        return el.value.trim() !== '';
      }
      return false;
    });
    setIsNextEnabled(allValid);
  }

  return (
    <div className="form-container px-4 py-6 max-w-6xl mx-auto">
      {step === 0 ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Formulaire 🗒️</h1>
          <p className="mb-2">Merci de participer à cette enquête de satisfaction. Ce formulaire a pour but de recueillir votre retour d'expérience sur votre semestre d'études à l'étranger.</p>
          <p className="mb-4">En remplissant ce formulaire, vous aiderez les futurs étudiants à mieux se préparer et contribuerez à améliorer notre programme de mobilité internationale.</p>
          <p className="mb-4">Tous les champs avec <span className="text-red-600"><strong>*</strong></span> sont <strong>obligatoires</strong>.</p>
          <div className="mb-4">
            <RiTimeLine className="text-xl inline-block mr-2" /> ~ 20-30 min
          </div>
          <button onClick={handleNext} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Commencer
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-3xl font-semibold mb-4">
            Étape {step} : {sections[step - 1]?.name}
          </h2>
          {sections[step - 1]?.questions.map(question => (
            <QuestionField
              key={question.id}
              question={question}
              value={answers[question.id]}
              onChange={(id, value) => setAnswers(prev => ({ ...prev, [id]: value }))}
              onValidate={checkMandatoryFields}
            />
          ))}
          <div className="flex justify-between mt-6">
            <button onClick={handlePrev} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">Précédent</button>
            <button
              id="next-btn"
              onClick={handleNext}
              disabled={!isNextEnabled}
              className={`px-4 py-2 rounded text-white transition 
                ${isNextEnabled ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Form;