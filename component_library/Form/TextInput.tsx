import React, {useState, useRef} from 'react'
import classNames from 'classnames'
import '../design/style.css'
import FormField from './atoms/FormField'
import Label, {LabelProps, labelDefaults} from './atoms/Label'
import WriteInField, {WriteInFieldProps, writeInDefaults} from './atoms/WriteInField'

export interface TextInputProps extends WriteInFieldProps, LabelProps {
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

export const textInputDefaults = {
  ...labelDefaults,
  ...writeInDefaults,
  helperText: "",
  errorText: "",
}

const TextInput: React.FC<WriteInFieldProps> = (props) => {
  const {
    id,
    classes,
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
    refer = {},
    pattern,
    placeholderText = 'Placeholder',
    type,
    required,
    value
  } = props

  const [dirty, setDirty] = useState<boolean>(false)
  const [localValid, setLocalValid] = useState<boolean>(false)
  const [adviseRequired, setAdviseRequired] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  function handleChange (e): null {
    setError(false)
    setLocalValid(false)
    setDirty(true)
    onChange(e)
  }

  function validate (): null {
    if (required && !value) {
      setLocalValid(false)
      setError(true)
      setAdviseRequired(true)      
      return
    }

    if (pattern) {
      const filtered = value.match(pattern) || []
      if (value != (filtered[0])) {
        setLocalValid(false)
        setError(true)
        return
      }
    }
    setError(false)
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
      <WriteInField
        id={id}
        refer={refer}
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
        pattern={pattern}
        placeholder={placeholderText}
        className={`form-field_control ${classes}`.trim()}
      />
      { helperText || error ?
        <p className={classNames({
          "form-field_helpertext": true,
          "Error": error
        })}>
          { adviseRequired ? (<span>Filling this part out is required.</span>) : ''}
          { error ? errorText : helperText }
        </p>
        :
        ''
      }
    </FormField>
  )
}

TextInput.defaultProps = textInputDefaults

export default TextInput