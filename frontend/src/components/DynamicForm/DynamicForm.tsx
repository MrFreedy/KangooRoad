import { useState, useEffect } from 'react';
import { RiStarFill, RiStarLine } from '@remixicon/react';

interface FieldConfig {
  type: 'text' | 'textarea' | 'rating';
  label: string;
  mandatory?: boolean;
  rating_type?: 'note';
}

interface Props {
  config: {
    dynamic: FieldConfig[];
  };
  values?: Record<string, any>;
  onChange?: (values: Record<string, any>) => void;
  onRemove?: () => void;
}

export default function DynamicForm({ config, values: initialValues = {}, onChange, onRemove }: Props) {
  const [values, setValues] = useState<Record<string, any>>(initialValues);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const updateValue = (key: string, val: any) => {
    const updated = { ...values, [key]: val };
    setValues(updated);
    onChange?.(updated);
  };

  return (
    <div className="bg-gray-100 p-6 rounded-xl space-y-4 w-full my-4">
      {config.dynamic.map((field, index) => (
        <div key={index}>
          <label className="block text-lg font-semibold mb-1">
            {field.label}
            {field.mandatory && <span className="text-red-600 ml-1">*</span>}
          </label>

          {field.type === 'text' && (
            <input
              type="text"
              className="w-full border px-3 py-2 rounded-md"
              value={values[field.label] || ''}
              onChange={(e) => updateValue(field.label, e.target.value)}
            />
          )}

          {field.type === 'textarea' && (
            <textarea
              className="w-full border px-3 py-2 rounded-md"
              value={values[field.label] || ''}
              onChange={(e) => updateValue(field.label, e.target.value)}
            />
          )}

        {field.type === 'rating' && (
            <div className="flex gap-1 pt-1">
                {[1, 2, 3, 4, 5].map((i) => {
                const rating = values[field.label] || 0;
                const FilledStar = i <= rating ? RiStarFill : RiStarLine;
                return (
                    <FilledStar
                    key={i}
                    size={28}
                    className="cursor-pointer text-yellow-400"
                    onClick={() => updateValue(field.label, i)}
                    />
                );
                })}
            </div>
        )}
        </div>
      ))}

      <button
        onClick={onRemove}
        className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
      >
        Supprimer
      </button>
    </div>
  );
}