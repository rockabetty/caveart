import React, {useState, useEffect, useRef} from 'react'
import classNames from 'classnames'
import '../design/style.css'
import FormField from './atoms/FormField'
import Label, {LabelProps, labelDefaults} from './atoms/Label'
import {WriteInFieldProps, writeInDefaults} from './atoms/WriteInField'

export interface TextAreaProps extends WriteInFieldProps, LabelProps {
  /**
   * Give the user information to understand the field
   */
  helperText?: string;
  /**
   * Give the user feedback on why their input is wrong
   */ 
  errorText?: string; 
  /**
   * A maximum value when entering dates or numbers
  */
}

export const TextAreaDefaults = {
  ...labelDefaults,
  ...writeInDefaults,
  helperText: "",
  errorText: "",
}

const TextArea: React.FC<WriteInFieldProps> = (props) => {
  
  const {
    id,
    classes,
    defaultValue,
    disabled,
    errorText,
    helperText,
    isValid,
    labelText,
    max,
    min,
    name,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onBlur = () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onChange = () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onClick = () => {},
    pattern,
    placeholderText = 'Placeholder',
    type,
    required,
    value
  } = props

  const [dirty, setDirty] = useState<boolean>(false)
  const [autoHeight, setAutoHeight] = useState<string>('10rem');
  const [localValid, setLocalValid] = useState<boolean>(false)
  const [localError, setLocalError] = useState<string>("")
  const filter = useRef(new RegExp(pattern))
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const updateTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset the height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set the new height
    }
  };

  useEffect(() => {
    updateTextareaHeight()
  },[value])

  function handleChange (e): null {
    setLocalValid(false)
    setDirty(true)
    onChange(e)
  }

  function validateValue(value, required, pattern): string {
    if (required && !value) {
      return "Filling this part out is required.";
    }

    if (pattern) {
      const filtered = value.match(new RegExp(pattern)) || [];
      if (value !== filtered[0]) {
        return "Please revise this field.";
      }
    }

    return "";
  }

  function validate (): null {
    const error = validateValue(value, required, pattern);
    setLocalError(error);
    setLocalValid(!error);
  }

  return(
    <FormField
      classes={classNames({
        'Disabled': disabled,
        'Error': errorText || localError,
        'Valid': isValid || localValid 
      })}
    >
      <Label
        classes="form-field_label"
        htmlFor={id}
        labelText={labelText}
        required={required}
      />
      <textarea
        id={id}
        ref={textareaRef}
        type={type || 'text'}
        value={value}
        disabled={disabled}
        max={max}
        min={min}
        name={name}
        onBlur={(e): null => {
          validate()
          onBlur(e)
        }}
        onChange={(e): null => {
          handleChange(e)
        }}
        onClick={(e): null => {
          onClick(e)
        }}
        placeholder={placeholderText}
        className={`form-field_control ${classes}`.trim()}
      />
      { helperText || localError || errorText ?
        <p className={classNames({
          "form-field_helpertext": true,
          "Error": localError || errorText
        })}>
          { localError ? `${localError} ` : '' }{errorText ? errorText : helperText }
        </p>
        :
        ''
      }
    </FormField>
  )
}

TextArea.defaultProps = TextAreaDefaults

export default TextArea;