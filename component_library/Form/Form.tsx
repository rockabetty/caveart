import React, { useState, ReactNode } from 'react';
import './Form.css';
import { Button } from '../Button';
import { InteractiveProps, InteractiveDefaults } from '../types/interactive';

type FormValues = {
  [key: string]: any
}

export interface FormProps extends InteractiveProps {
  onSubmit: (formValues: FormValues) => any;
  onSuccess?: (...params: any) => any;
  onFailure?: (...params: any) => any;
  submissionError?: string | null;
  submitLabel?: string;
  children: ReactNode;
  isLoading?: boolean;
  formValues: FormValues
}

export const formDefaults: Partial<FormProps> = {
  ...InteractiveDefaults,
  onSubmit: () => {},
  onSuccess: () => {},
  onFailure: () => {},
  submissionError: '',
  submitLabel: 'Submit',
};

const Form: React.FC<FormProps> = (props) => {
  const {
    children,
    id,
    onSubmit,
    onFailure,
    onSuccess,
    formValues,
    submissionError,
    submitLabel,
  } = props;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = document.querySelector(`#${id}`);
    const errorCount = form ? form.getElementsByClassName('Error').length : 0;

    if (errorCount === 0) {
      try {
        setIsLoading(true);
        await onSubmit(formValues);
        onSuccess && onSuccess(formValues);
        setIsLoading(false);
      } catch (err) {
        onFailure && onFailure(err);
      }
    }
  }

  return (
    <form id={id} className="form" noValidate onSubmit={handleSubmit}>
      {children}
      {submissionError ? (
        <p className="form-feedback Error">{submissionError}</p>
      ) : null}
      <Button
        id={`${id}-form-submit`}
        type="submit"
        look="primary"
        loading={isLoading}
      >
        {submitLabel}
      </Button>
    </form>
  );
};

Form.defaultProps = formDefaults;

export default Form;