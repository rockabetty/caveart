import React, {useState, useRef} from 'react'
import { InputProps, InputDefaults } from '../../types/input'
import classNames from 'classnames'
import '../../design/style.css'
import { default as Label } from './Label';
import { default as FormField } from './FormField';
import { useValidation } from '../hooks/useValidation'; 

export interface WriteInFieldProps extends InputProps {  
  /**
   * Add placeholder text to provide an example input value.
  */
  placeholderText?: string
  /**
   * Specify the input type.
  */ 
  type?: 'text' | 'number' | 'email' | 'password' | 'search' | 'tel' | 'datetime-local' | 'date' | 'time' | 'url' | 'week' | 'textarea'
  /**
   * A maximum value when entering dates or numbers
  */
  max?: string | number;
  /**
   * A minimum value when entering dates or numbers
  */
  min?: string | number;
  /*
  * A maximum character length
  */
  maxLength?: number;
  /*
  * Restrict valid input
  */
  pattern?: string;
  /**
   * Give the user information to understand the field
   */
  helperText?: string;
  /**
   * Give the user feedback on why their input is wrong
   */ 
  errorText?: string; 
}

export const writeInDefaults: WriteInFieldProps = {
  ...InputDefaults,
  placeholderText: '',
  type: 'text',
  min: '',
  max: '',
  maxLength: null,
  helperText: "",
  errorText: "",
} as WriteInFieldProps

const WriteInField: React.FC<WriteInFieldProps> = (props) => {
  const {
    id,
    type,
    disabled,
    max,
    min,
    maxLength,
    name,
    onBlur,
    onChange,
    onClick,
    pattern,
    labelText,
    placeholderText,
    helperText,
    isValid,
    classes,
    required,
    value
  } = props

  const { localValid, error, validate } = useValidation(value, required, pattern, maxLength);
  const [dirty, setDirty] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const renderHelperOrErrorText = () => {
    if (!helperText && !error) return null;
    return (
      <p className={classNames({ "form-field_helpertext": true, "Error": !!error })}>
        { error || helperText }
      </p>
    );
  }

  const textAreaChangeHandler = function (e) {
    setDirty(true);
    console.log(isValid)
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'; // Reset the height
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set the new height
      }
      onChange(e);
  }

  const inputChangeHandler = function (e) {
    console.log(isValid)
    setDirty(true);
    onChange(e);
  }

  const handleChange = type === 'textarea' ? textAreaChangeHandler : inputChangeHandler;

  const inputProps = {
    className: `form-field_control ${classes}`.trim(),
    value,
    disabled,
    id,
    max,
    maxLength,
    name,
    min, 
    onBlur: (e) => {
      validate();
      onBlur(e);
    },
    onChange: handleChange,
    onClick,
    pattern: pattern ? new RegExp(pattern) : undefined,
    placeholder: placeholderText,
    required,
    type
  };

  const renderInputField = () => {
    if (type === 'textarea') {
      return <textarea ref={textareaRef} {...inputProps} />;
    } else {
      return <input {...inputProps} />
    }
  }

  return(
    <FormField
      classes={classNames({
        'Disabled': disabled,
        'Error': error,
        'Valid': isValid || localValid 
      })}
    >
      <Label
        classes="form-field_label"
        htmlFor={id}
        labelText={labelText}
        required={required}
      />
      {renderInputField()}
      {renderHelperOrErrorText()}
    </FormField>
  )
}

WriteInField.defaultProps = writeInDefaults

export default WriteInField