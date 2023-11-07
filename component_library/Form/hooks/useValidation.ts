import { useState } from 'react';

type ValidationOptions = {
  value: string;
  required?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number; 
}

export const useValidation = (options: ValidationOptions) => {

    const {
      value,
      required,
      pattern,
      minLength,
      maxLength,
      min,
      max
    } = options;

    const [valid, setValid] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const validateValue = () => {
        setValid(false);
        if (required && !value) {
          return "This field is required"
        }

        if (maxLength && value.length > maxLength) {
          return `This can only be ${maxLength} characters long.`;
        }

        if (minLength && value.length < minLength) {
          return `This needs to be at least ${minLength} characters long.`
        }

        if (pattern) {
          const regexPattern = new RegExp(pattern);
          const invalidCharacterSet = new Set();
          for (const char of value) {
            if (!regexPattern.test(char)) {
              invalidCharacterSet.add(char.replace(' ', 'spaces'));
            }
          }
          const invalidCharactersArray = Array.from(invalidCharacterSet);

          if (invalidCharactersArray.length > 0) {
            return `Please remove ${invalidCharactersArray.join(', ')}.`;
          }
        }
        return "";
        setValid(true); 
    };

    const validate = () => {
        const error = validateValue();
        setError(error);
        setValid(!error);
    };

    return { valid, setValid, error, setError, validate };
};