import './Form.css';
import { useEffect, useState } from 'react';
import { RiTimeLine } from '@remixicon/react';
import { useProgress } from '@context/ProgressContext';
import QuestionField from '@components/QuestionField/QuestionField';
import API_BASE_URL from '@src/config';
import { useNavigate } from 'react-router-dom';

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

function Form() {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [sections, setSections] = useState<Section[]>([]);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [isNextEnabled, setIsNextEnabled] = useState(false);

  const { setCurrentStep, setTotalSteps } = useProgress();
  let allValid = false;

  useEffect(() => {
    const fetchSectionsAndQuestions = async () => {
      try {

        const [sectionsRes, questionsRes] = await Promise.all([
          fetch(`${API_BASE_URL}sections`),
          fetch(`${API_BASE_URL}questions`)
        ]);

        const sectionsJson: Omit<Section, 'questions'>[] = await sectionsRes.json();
        const questionsJsonRaw = await questionsRes.json();

        const questionsJson: Question[] = questionsJsonRaw.map((q: any) => ({
          ...q,
          sectionId: q.section_id
        }));

        questionsJson.sort((a, b) => a.order - b.order);

        const enrichedSections: Section[] = sectionsJson.map(section => ({
          ...section,
          questions: questionsJson.filter(q => q.sectionId === section.id)
        }));

        enrichedSections.sort((a, b) => a.order - b.order);

        setSections(enrichedSections);
      } catch (error) {
        console.error('Erreur lors du chargement des sections/questions:', error);
      }
    };

    fetchSectionsAndQuestions();
  }, []);


  useEffect(() => {
    if (sections.length > 0) {
      setTotalSteps(sections.length);
      setCurrentStep(step);
    }
  }, [sections, step]);

  const totalSteps = sections.length + 1;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
      setIsNextEnabled(false);
    }
  };

  const handlePrev = () => {
    if (step > 0 && step != 1){
      setStep(step - 1);
    };
    if (step == 1) navigate('/');
  };

  function checkMandatoryFields() {
    const requiredFields = document.querySelectorAll('[data-is-mandatory="true"]');
    allValid = Array.from(requiredFields).every((el) => {
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
          <h2 className="text-3xl font-semibold mb-4 text-center">
            Étape {step} : {sections[step - 1]?.name}
          </h2>
          <div className="flex flex-col items-center">
            {sections[step - 1]?.questions.map(question => (
              <QuestionField
              key={question.id}
              question={question}
              value={answers[question.id]}
              onChange={(id, value) => setAnswers(prev => ({ ...prev, [id]: value }))}
              onValidate={checkMandatoryFields}
              />
            ))}
            <div className="flex justify-between w-150">
              <button
                onClick={handlePrev}
                className={`self-start text-white px-4 py-2 rounded
                  ${step == 1 ? 'bg-red-500 hover:bg-red-600':'bg-gray-500 hover:bg-gray-600'}`}
              >
                {step > 1 ? "Précédent" : "Quitter"}
              </button>
              <button
                id="next-btn"
                onClick={handleNext}
                disabled={!isNextEnabled}
                className={`self-end px-4 py-2 rounded text-white transition 
                  ${isNextEnabled ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
              >
                Suivant
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}

export default Form;