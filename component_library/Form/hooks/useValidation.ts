import { useState } from 'react';

export const useValidation = (value, required, pattern, maxLength) => {
    const [localValid, setLocalValid] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const validateValue = (value, required, pattern) => {
        setLocalValid(false);
        if (required && !value) {
          console.log("not valid")
          return "This field is required"
        }

        if (maxLength && value.length > maxLength) {
          return `This field can only be ${maxLength} characters long!`;
        }

        if (pattern) {
          const regexPattern = new RegExp(pattern);
          const invalidCharacterSet = new Set();
          for (const char of value) {
            if (!regexPattern.test(char)) {
              invalidCharacterSet.add(char);
            }
          }
          const invalidCharactersArray = Array.from(invalidCharacterSet);

          if (invalidCharactersArray.length > 0) {
            return `Please remove these characters: ${invalidCharactersArray.join(', ')}.`;
          }
        }
        return "";
        setLocalValid(true); 
    };

    const validate = () => {
        const error = validateValue(value, required, pattern);
        setError(error);
        setLocalValid(!error);
    };

    return { localValid, error, validate };
};