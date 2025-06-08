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
      {/* Ajoute ici les autres types selon ton besoin */}
    </div>
  )
}

export default QuestionField
