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
    //console.log(JSON.parse(localStorage.getItem("geo")));
  }, [sections, step]);

  const totalSteps = sections.length + 1;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
      setIsNextEnabled(false);
      let json;
      //localStorage.setItem("geo",JSON.stringify({'ville':'paris'}));
    }
  };

  const handlePrev = () => {
    if (step > 0 && step != 1){
      setStep(step - 1);
      checkMandatoryFields();
    };
    if (step == 1) navigate('/');
  };

  function checkMandatoryFields() {
    const currentQuestions = sections[step - 1]?.questions || [];
    
    const allValid = currentQuestions.every(question => {
      const answer = answers[question.id] || {};
      const val = answer.main;

      if (!question.is_mandatory) return true;

      if (question.type === 'checkbox') {
        const isChecked = answer.main;
        return isChecked !== undefined ? isChecked : false;
      }

      if (question.type === 'date') {
        const date = new Date(val);
        const today = new Date();
        const minDate = new Date('2000-01-01');

        return (
          val &&
          !isNaN(date.getTime()) &&
          date >= minDate &&
          date <= today
        );
      }

      if (question.type === 'number') {
        const number = parseFloat(val);
        return !isNaN(number) && number >= 0;
      }

      if (!val || val === 'null' || String(val).trim() === '') {
        return false;
      }

      if (question.is_details && (val === 'Oui' || val === 'Autre')) {
        const details = answer.details;
        if (!details || String(details).trim() === '') return false;
      }

      return true;
    });

    setIsNextEnabled(allValid);
  }

  useEffect(() => {
    if (step > 0) {
      checkMandatoryFields();
    }
  }, [answers, step]);

  function checkMandatoryFieldsWith(data: typeof answers) {
    const currentQuestions = sections[step - 1]?.questions || [];

    const allValid = currentQuestions.every(question => {
      const answer = data[question.id] || {};
      const val = answer.main;

      if (!question.is_mandatory) return true;

      if (question.type === 'dynamic') {
        if (!Array.isArray(val) || val.length === 0) return false;

        return val.every(formItem => {
          return (question.options?.dynamic || []).every((field: any) => {
            if (!field.mandatory) return true;
            const value = formItem[field.label];
            return value !== undefined && value !== '' && value !== null;
          });
        });
      }

      if (question.type === 'checkbox') {
        return answer.main !== undefined ? answer.main : false;
      }

      if (question.type === 'date') {
        const date = new Date(val);
        const today = new Date();
        const minDate = new Date('2000-01-01');

        return (
          val &&
          !isNaN(date.getTime()) &&
          date >= minDate &&
          date <= today
        );
      }
      
      if (question.type === 'number') {
        const number = parseFloat(val);
        return !isNaN(number) && number >= 0;
      }

      if (!val || val === 'null' || String(val).trim() === '') {
        return false;
      }

      if (question.is_details && (val === 'Oui' || val === 'Autre')) {
        const details = answer.details;
        if (!details || String(details).trim() === '') return false;
      }

      return true;
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
                value={answers[question.id] || {}}
                onChange={(id, value) => {
                  setAnswers(prev => {
                    const updated = {
                      ...prev,
                      [id]: { ...(prev[id] || {}), main: value }
                    };
                    setTimeout(() => checkMandatoryFieldsWith(updated), 0);
                    return updated;
                  });
                }}
                onChangeDetails={(id, value) => {
                  setAnswers(prev => {
                    const updated = {
                      ...prev,
                      [id]: { ...(prev[id] || {}), details: value }
                    };
                    return { ...updated };
                  });
                }}
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