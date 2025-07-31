import React from 'react'
import './QuestionField.css'
interface QuestionProps {
  question: {
    id: number;
    type: string;
    content: string;
    is_mandatory: boolean;
    options?: any;
    is_details?: boolean;
  };
  value: { main?: any; details?: any };
  onChange: (id: number, value: any) => void;
  onChangeDetails?: (id: number, value: any) => void;
  onValidate: () => void;
}

const QuestionField: React.FC<QuestionProps> = ({ question, value, onChange, onChangeDetails, onValidate }) => {
  return (
    <div className="mb-4 w-150">
      {question.type !== 'checkbox' && (
        <label className="block text-lg">
          {question.content}
          {question.is_mandatory && <span className="text-red-600 ml-1"><strong>*</strong></span>}
        </label>
      )}

      {(question.type === 'text' || question.type === 'email') && (
        <>
          <input
            type="text"
            className="mt-1 block w-full border px-3 py-2 rounded-md"
            value={value?.main || ''}
            onChange={(e) => onChange(question.id, e.currentTarget.value)}
          />
          {question.type === 'email' && (
            <span className="text-gray-600">Format attendu: nom@domaine.fr</span>
          )}
        </>
      )}

      {question.type === 'textarea' && (
        <textarea className="mt-1 block w-full border px-3 py-2 rounded-md" value={value?.main || ''} onChange={(e) => onChange(question.id, e.currentTarget.value)}/>
      )}

      {question.type === 'select' && (
        <select
          id={question.id}
          
          className="mt-1 block w-full border px-3 py-2 rounded-md"
          value={value?.main !== undefined ? value.main : 'null'}
          onChange={(e) => {
            onChange(question.id, e.currentTarget.value);
            setTimeout(() => onValidate(), 0); // ⚠️ nécessaire pour is_details dynamique
          }}
         
        >
          <option value="null" disabled>
            {question.is_mandatory ? 'Sélectionnez une option' : 'Optionnel'}
          </option>
          {Array.isArray(question.options) &&
            question.options.map((option: string, index: number) => (
              <option key={index} value={option}>{option}</option>
            ))}
        </select>
      )}

      {question.type === 'checkbox' && (
        <div className="flex items-center">
          <input
            type="checkbox"
            
            className="mr-2"
            checked={value?.main || false}
            onChange={(e) => onChange(question.id, e.currentTarget.checked)}
           
          />
          <label>{question.content} {question.is_mandatory && <span className="text-red-600 ml-1"><strong>*</strong></span>}</label>
        </div>
      )}

      {question.type === 'date' && (
        <input type="date" min="2000-01-01" max="2100-12-31" className="mt-1 block w-full border px-3 py-2 rounded-md" value={value?.main || ''} onChange={(e) => onChange(question.id, e.currentTarget.value)}/>
      )}

      {question.type === 'number' && (
        <input type="number" className="mt-1 block w-full border px-3 py-2 rounded-md" value={value?.main || ''} onChange={(e) => onChange(question.id, e.currentTarget.value)}/>
      )}

      {question.type === 'file' && (
        <input type="file" multiple accept="image/*,video/*" className="mt-1 block w-full border px-3 py-2 rounded-md"/>
      )}

      {question.type === 'rating' && question.options && (
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map(i => (
            <i key={i} className="ri-star-line text-yellow-500 text-xl cursor-pointer"></i>
          ))}
        </div>
      )}

      {question.is_details && (value.main == 'Autre' || value.main == 'Oui') && (
        <textarea
          placeholder="Détails..."
          className="mt-2 block w-full border px-3 py-2 rounded-md"
          value={value?.details || ''}
          onChange={(e) => onChangeDetails(question.id, e.currentTarget.value)}
          onInput={onValidate}
        />
      )}
    </div>
  )}

export default QuestionField