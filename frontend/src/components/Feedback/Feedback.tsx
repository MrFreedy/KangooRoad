import React, { useState } from 'react';
import { RiCalendar2Line, RiSchoolLine, RiMapPin2Line, RiArrowDownSLine,RiStarFill, RiStarLine } from '@remixicon/react';
import './Feedback.css';

interface FeedbackProps {
  id: number;
  form_data: FormStep[]; // détails ci-dessous
  isVisible: boolean;
  submissionDate: string;
  school?: string;
  year?: number;
  city?: string;
  country?: string;
  user_type?: string;
  is_contact?: boolean;
  firstname?: string;
  lastname?: string;
  email?: string;
}

interface FormStep {
  stepLabel: string;
  stepVisibility: "0" | "1";
  questions: Question[];
}

type Question =
  | BaseQuestion
  | QuestionWithDetails
  | DynamicQuestion;

interface BaseQuestion {
  type:
    | "text"
    | "email"
    | "checkbox"
    | "select-one"
    | "rating"
    | "textarea"
    | "number"
    | "date"
    | "file";
  label: string;
  value: string | number | string[]; // string[] pour les fichiers
  ratingOption?: string;
  option?: string;
  questionId?: string;
}

interface QuestionWithDetails extends BaseQuestion {
  details?: string;
}

interface DynamicQuestion {
  type: "dynamic";
  label: string;
  value: DynamicSubQuestion[];
  questionId?: string;
}

interface DynamicSubQuestion {
  [subLabel: string]: {
    type: string;
    value: string | number;
    option?: string;
  };
}


const Feedback: React.FC<FeedbackProps> = ({
  id,
  form_data,
  isVisible,
  submissionDate,
  school,
  year,
  city,
  country,
  user_type,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSteps, setOpenSteps] = useState<Record<number, boolean>>({});

  const toggleStep = (index: number) => {
    setOpenSteps((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const renderRating = (value: number) => {
      const stars = [];
      for (let i = 1; i <= 5; i++) {
          stars.push(
          i <= value ? (
              <RiStarFill key={i} className="inline text-yellow-500" />
          ) : (
              <RiStarLine key={i} className="inline text-gray-300" />
          )
          );
      }
      return <span className="ml-2">{stars}</span>;
  };

  const isDynamic = (q: Question): q is DynamicQuestion => q.type === 'dynamic';

  const renderDynamic = (dq: DynamicQuestion, renderRating: (v: number) => JSX.Element) => {
    if (!dq.value || dq.value.length === 0) {
      return <em className="text-gray-500">Aucune entrée</em>;
    }

    return (
      <div className="space-y-3">
        {dq.value.map((item, idx) => (
          <div key={idx} className="rounded border border-gray-200 p-2">
            <div className="text-xs text-gray-500 mb-1">Entrée #{idx + 1}</div>
            <ul className="grid sm:grid-cols-2 gap-1">
              {Object.entries(item).map(([subLabel, field]) => (
                <li key={subLabel} className="text-sm text-gray-700">
                  <span className="font-bold">{subLabel} :</span>{' '}
                  {field.type === 'rating'
                    ? renderRating(parseInt(String(field.value), 10))
                    : <span>{String(field.value)}</span>
                  }
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className="feedback-item mb-4 border border-gray-200 rounded-md overflow-hidden w-full justify-self-center"
      data-year={year}
      data-school={school}
      data-country={country}
      data-type={user_type}
    >
      <button
        className="w-full text-left p-4 bg-gray-100 hover:bg-gray-200 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex justify-between items-center p-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RiCalendar2Line className="text-blue-500" />
              <span><strong>Année :</strong> {year}</span>
            </div>
            <div className="flex items-center space-x-2">
              <RiSchoolLine className="text-blue-500" />
              <span><strong>École :</strong> {school}</span>
            </div>
            <div className="flex items-center space-x-2">
              <RiMapPin2Line className="text-blue-500" />
              <span><strong>Lieu :</strong> {city}, {country}</span>
            </div>
          </div>
          <RiArrowDownSLine
            className={`text-2xl text-blue-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="p-4 space-y-4 bg-white">
          {form_data
            .filter((step) => step.stepVisibility === '1')
            .map((step, stepIndex) => (
              <div key={stepIndex} className="border border-gray-200 rounded-md overflow-hidden">
                <button
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                  onClick={() => toggleStep(stepIndex)}
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{step.stepLabel}</span>
                    <RiArrowDownSLine
                      className={`text-2xl text-blue-500 transition-transform ${openSteps[stepIndex] ? 'rotate-180' : ''}`}
                    />
                    </div>
                </button>
                {openSteps[stepIndex] && (
                  <div className="p-3 space-y-2 bg-white">
                    <ul className="space-y-2">
                      {step.questions.map((q, i) => (
                        <li key={i} className="p-2 rounded text-justify">
                          <strong className="block text-sm text-bold text-gray-700">{q.label}</strong>

                          {/* Valeur */}
                          {isDynamic(q) ? (
                            renderDynamic(q, renderRating)
                          ) : q.type === 'rating' ? (
                            <p className="text-sm text-gray-700">
                              {renderRating(typeof q.value === 'number' ? q.value : parseInt(q.value as string, 10))}
                            </p>
                          ) : Array.isArray(q.value) ? (
                            // fichiers ou listes simples
                            <p className="text-sm text-gray-700">{q.value.join(', ')}</p>
                          ) : (
                            <p className="text-sm text-gray-700">{q.value}</p>
                          )}

                          {/* Détails optionnels */}
                          {'details' in q && q.details && (
                            <p className="text-sm text-gray-500">{q.details}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};


export default Feedback;

