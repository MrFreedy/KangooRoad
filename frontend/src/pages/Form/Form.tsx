import './Form.css';
import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiTimeLine } from '@remixicon/react';
import { useProgress } from '@context/ProgressContext';
import QuestionField from '@components/QuestionField/QuestionField';
import api from '@src/services/apiService';

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

const Form = () => {
  const navigate = useNavigate();
  const hasPromptedRef = useRef(false);
  const [step, setStep] = useState(0);
  const [sections, setSections] = useState<Section[]>([]);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [isNextEnabled, setIsNextEnabled] = useState(false);

  const { setCurrentStep, setTotalSteps } = useProgress();
  const totalSteps = sections.length + 1;
  const isLastStep = step === totalSteps - 1;

  useEffect(() => {
    fetchFormStructure();
    if (hasPromptedRef.current) return;
    hasPromptedRef.current = true;
    checkLocalStorage();
  }, []);

  useEffect(() => {
    if (sections.length > 0) {
      setTotalSteps(sections.length);
      setCurrentStep(step);
    }
  }, [sections, step]);

  useEffect(() => {
    if (step > 0) checkMandatoryFields();
  }, [answers, step]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const fetchFormStructure = async () => {
    try {
      const [sectionsData, questionsRaw] = await Promise.all([
        api.get<Omit<Section, 'questions'>[]>('/sections'),
        api.get<any[]>('/questions'),
      ]);

      const questions: Question[] = questionsRaw
        .map((q: any) => ({ ...q, sectionId: q.section_id }))
        .sort((a, b) => a.order - b.order);

      const enrichedSections: Section[] = sectionsData
        .map((section) => ({
          ...section,
          questions: questions.filter((q) => q.sectionId === section.id),
        }))
        .sort((a, b) => a.order - b.order);

      setSections(enrichedSections);
    } catch (error: any) {
      console.error('Erreur de chargement :', error);
    }
  };

  const checkLocalStorage = () => {
    const saved = localStorage.getItem('formProgress');
    if (!saved) return;

    try {
      const { step: savedStep, answers: savedAnswers, savedAt } = JSON.parse(saved);
      const formattedDate = new Date(savedAt).toLocaleString('fr-FR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });

      const shouldResume = window.confirm(`Souhaitez-vous reprendre là où vous vous étiez arrêté ?\nDernière sauvegarde : ${formattedDate}`);

      if (shouldResume) {
        setStep(savedStep || 0);
        setAnswers(savedAnswers || {});
      } else {
        localStorage.removeItem('formProgress');
      }
    } catch (e) {
      console.warn("Erreur lecture localStorage", e);
    }
  };

  const handleNext = async () => {
    if (step < totalSteps - 1) {
      const next = step + 1;
      setStep(next);
      setIsNextEnabled(false);

      localStorage.setItem('formProgress', JSON.stringify({
        step: next,
        answers,
        savedAt: Date.now()
      }));
    }else {
      const form_data = buildFormData();

      await api.post('/feedbacks', { form_data });

      alert("Formulaire enregistré avec succès !");
      localStorage.removeItem('formProgress');
      navigate('/');
    }
  };

  const handlePrev = () => {
    if (step === 1) return navigate('/');
    if (step > 0) {
      setStep(step - 1);
      checkMandatoryFields();
    }
  };

  const checkMandatoryFields = () => {
    const currentQuestions = sections[step - 1]?.questions || [];
    const valid = currentQuestions.every(question => {
      const answer = answers[question.id] || {};
      const val = answer.main;

      if (!question.is_mandatory) return true;
      if (question.type === 'checkbox') return answer.main !== undefined ? answer.main : false;
      if (question.type === 'date') {
        const date = new Date(val);
        const today = new Date();
        return val && !isNaN(date.getTime()) && date >= new Date('2000-01-01') && date <= today;
      }
      if (question.type === 'number') return !isNaN(parseFloat(val)) && parseFloat(val) >= 0;
      if (!val || val === 'null' || String(val).trim() === '') return false;
      if (question.is_details && (val === 'Oui' || val === 'Autre')) return !!(answer.details && answer.details.trim());
      return true;
    });

    setIsNextEnabled(valid);
  };

  const checkMandatoryFieldsWith = (data: typeof answers) => {
    const currentQuestions = sections[step - 1]?.questions || [];
    const valid = currentQuestions.every(question => {
      const answer = data[question.id] || {};
      const val = answer.main;

      if (!question.is_mandatory) return true;
      if (question.type === 'dynamic') {
        return Array.isArray(val) && val.length > 0 && val.every(item =>
          (question.options?.dynamic || []).every((field: any) => {
            if (!field.mandatory) return true;
            const v = item[field.label];
            return v !== undefined && v !== '' && v !== null;
          })
        );
      }
      if (question.type === 'checkbox') return answer.main !== undefined ? answer.main : false;
      if (question.type === 'date') {
        const date = new Date(val);
        const today = new Date();
        return val && !isNaN(date.getTime()) && date >= new Date('2000-01-01') && date <= today;
      }
      if (question.type === 'number') return !isNaN(parseFloat(val)) && parseFloat(val) >= 0;
      if (!val || val === 'null' || String(val).trim() === '') return false;
      if (question.is_details && (val === 'Oui' || val === 'Autre')) return !!(answer.details && answer.details.trim());
      return true;
    });

    setIsNextEnabled(valid);
  };

  const buildFormData = () => {
    return sections.map(section => {
      const formattedQuestions = section.questions.map(question => {
        const answer = answers[question.id] || {};

        if (question.type === 'dynamic') {
          return {
            type: question.type,
            label: question.content,
            value: Array.isArray(answer.main)
              ? answer.main.map((item: any) => {
                  const obj: any = {};
                  Object.entries(item).forEach(([key, field]) => {
                    obj[key] = {
                      type: field.type,
                      value: field.value,
                      ...(field.option && { option: field.option }),
                    };
                  });
                  return obj;
                })
              : [],
            ...(question.questionId && { questionId: question.questionId }),
          };
        }

        const base = {
          type: question.type,
          label: question.content,
          value: answer.main ?? '',
        };

        if (question.type === 'rating' && answer.option) {
          return { ...base, ratingOption: answer.option };
        }

        if (answer.details) {
          return { ...base, details: answer.details };
        }

        if (question.option) {
          return { ...base, option: question.option };
        }

        return base;
      });

      return {
        questions: formattedQuestions,
        stepLabel: section.name,
        stepVisibility: section.is_active ? "1" : "0",
      };
    });
  };

  return (
    <div className="form-container px-4 sm:px-6 md:px-10 py-2 max-w-4xl mx-auto">
      {step === 0 ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Formulaire 🗒️</h1>
          <p className="mb-2">Merci pour votre participation à cette enquête.</p>
          <p className="mb-4">Vos retours sont précieux pour améliorer notre programme.</p>
          <p className="mb-4">Les champs marqués <span className="text-red-600 font-bold">*</span> sont obligatoires.</p>
          <div className="mb-4">
            <RiTimeLine className="text-xl inline-block mr-2" /> ~ 20-30 min
          </div>
          <button onClick={handleNext} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Commencer
          </button><br />
          <button onClick={() => navigate('/')} className="bg-gray-500 hover:bg-gray-600 text-white font-bold mt-4 py-2 px-4 rounded">
            Retour
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-xl sm:text-3xl font-semibold mb-4 text-center sm:text-start">
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
                    const updated = { ...prev, [id]: { ...(prev[id] || {}), main: value } };
                    setTimeout(() => checkMandatoryFieldsWith(updated), 0);
                    return updated;
                  });
                }}
                onChangeDetails={(id, value) => {
                  setAnswers(prev => ({
                    ...prev,
                    [id]: { ...(prev[id] || {}), details: value }
                  }));
                }}
                onValidate={checkMandatoryFields}
              />
            ))}

            <div className="flex flex-col-reverse sm:flex-row justify-between w-full gap-4 mt-6">
              <button
                onClick={handlePrev}
                className={`w-full sm:w-auto text-white px-4 py-2 rounded ${step === 1 ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-500 hover:bg-gray-600'}`}
              >
                {step > 1 ? "Précédent" : "Quitter"}
              </button>

              <button
                id="next-btn"
                onClick={handleNext}
                disabled={!isNextEnabled}
                className={`w-full sm:w-auto px-4 py-2 rounded text-white transition ${isNextEnabled ? isLastStep ? 'bg-green-500 hover:bg-green-600':'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
              >
                {isLastStep ? 'Terminer' : 'Suivant'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;