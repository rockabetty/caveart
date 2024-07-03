import React, { useState, useMemo, ReactNode } from 'react';
import axios from 'axios';
import './Form.css';
import { Button } from '../Button';
import { InteractiveProps, InteractiveDefaults } from '../types/interactive';

export interface FormProps extends InteractiveProps {
  onSubmit: (formValues: { [key: string]: any }) => Promise<void>;
  onSuccess?: (res: any) => void;
  onFailure?: (err: any) => void;
  submissionError?: string;
  submitLabel?: string;
  children: ReactNode;
  isLoading?: boolean;
}

export const formDefaults: Partial<FormProps> = {
  ...InteractiveDefaults,
  onSubmit: () => {},
  onSuccess: () => {},
  onFailure: () => {},
  submissionError: '',
  submitLabel: 'Submit',
  isLoading: false,
};

const Form: React.FC<FormProps> = (props) => {
  const {
    children,
    id,
    onSubmit,
    onFailure,
    onSuccess,
    submissionError,
    submitLabel,
    isLoading,
  } = props;

  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = document.querySelector(`#${id}`);
    const errorCount = form ? form.getElementsByClassName('Error').length : 0;

    if (errorCount === 0) {
      try {
        await onSubmit(formValues);
        onSuccess && onSuccess(formValues);
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