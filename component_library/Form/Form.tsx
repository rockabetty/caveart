import React, { useState, useMemo, ReactNode } from 'react';
import axios from 'axios';
import './Form.css';
import { Button } from '../Button'
import { InteractiveProps, InteractiveDefaults } from '../types/interactive';

export interface FormProps extends InteractiveProps {
  /**
   * API endpoint to post to
   */
  onSubmit: (formValues: { [key: string]: any }) => Promise<void>;
  /**
   * Function to call if post request is successful
   */
  onSuccess: (res: any) => void;
  /**
   * Function to call if post request fails
   */
  onFailure: (err: any) => void;
  /**
   * Submission error message
   */
  submissionError?: string;
  /**
   * Submit button label
   */
  submitLabel?: string;
  /**
   * Children components (form elements)
   */
  children: ReactNode;
  /**
   * Whether the form is pending 
  */
  isLoading: boolean;
}

export const formDefaults: Partial<FormProps> = {
  ...InteractiveDefaults,
  onSubmit: () => {},
  onSuccess: () => {},
  onFailure: () => {},
  submissionError: '',
  submitLabel: 'Submit',
  isLoading: false
};

const Form: React.FC<FormProps> = (props) => {
  const { children, id, onSubmit, onFailure, onSuccess, submissionError, submitLabel, isLoading } = props;

  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
 
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = document.querySelector(`#${id}`);
    const errorCount = form ? form.getElementsByClassName('Error').length : 0;

    if (errorCount === 0 && onSubmit) {
      try {
        await onSubmit(formValues)
      } catch (err) {
        onFailure(err);
      }
    }
  }

  const patchedChildren = useMemo(() => {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        if (child.props.name) {
          return React.cloneElement(child, {
            onChange: handleChange,
            value: formValues[child.props.name] || '',
          });
        }
        return child;
      }
      return null;
    });
  }, [children, formValues]);

  return (
    <form 
      id={id}
      className="form"
      noValidate
      onSubmit={handleSubmit}
    >
      {patchedChildren}
      {submissionError 
        ? <p className="form-feedback Error">{submissionError}</p>
        : null
      }
      <Button
        id={`${id}-form-submit`}
        type="button"
        onClick={onSubmit}
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