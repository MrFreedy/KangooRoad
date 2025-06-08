import React from 'react'

interface QuestionProps {
  question: {
    id: number
    type: string
    content: string
    is_mandatory: boolean
    options?: any
    is_details?: boolean
  }
}

const QuestionField: React.FC<QuestionProps> = ({ question }) => {
  return (
    <div className="mb-4">
      <label className="block text-lg font-medium">
        {question.content}
        {question.is_mandatory && <span className="text-red-600 ml-1">*</span>}
      </label>

      {question.type === 'text' && (
        <input type="text" required={question.is_mandatory} className="mt-1 block w-full border px-3 py-2 rounded-md" />
      )}

      {question.type === 'textarea' && (
        <textarea required={question.is_mandatory} className="mt-1 block w-full border px-3 py-2 rounded-md" />
      )}

      {question.type === 'email' && (
        <>
          <input type="email" required={question.is_mandatory} className="mt-1 block w-full border px-3 py-2 rounded-md" />
          <span className="text-gray-600">Format attendu: nom@domaine.fr</span>
        </>
      )}

      {question.type === 'select' && (
        <select required={question.is_mandatory} className="mt-1 block w-full border px-3 py-2 rounded-md">
          <option value="">Choisissez une option</option>
          {Array.isArray(question.options) && question.options.map((option: string, index: number) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
      )}

      {question.type === 'checkbox' && (
        <div className="flex items-center">
          <input type="checkbox" required={question.is_mandatory} className="mr-2" />
          <label>{question.content}</label>
        </div>
      )}

      {question.type === 'date' && (
        <input type="date" required={question.is_mandatory} className="mt-1 block w-full border px-3 py-2 rounded-md" />
      )}

      {question.type === 'number' && (
        <input type="number" required={question.is_mandatory} className="mt-1 block w-full border px-3 py-2 rounded-md" />
      )}

      {question.type === 'file' && (
        <input type="file" required={question.is_mandatory} multiple accept="image/*,video/*" className="mt-1 block w-full border px-3 py-2 rounded-md" />
      )}

      {question.type === 'rating' && question.options && (
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map(i => (
            <i key={i} className="ri-star-line text-yellow-500 text-xl cursor-pointer"></i>
          ))}
        </div>
      )}

      {question.is_details && (
        <textarea placeholder="Détails..." className="mt-2 block w-full border px-3 py-2 rounded-md"></textarea>
      )}
    </div>
  )}

export default QuestionField