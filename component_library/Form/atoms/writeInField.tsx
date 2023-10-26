import React from 'react'
import { InputProps, InputDefaults } from '../../types/input'
import classNames from 'classnames'
import '../../design/style.css'

export interface WriteInFieldProps extends InputProps {  
  /**
   * Add placeholder text to provide an example input value.
  */
  placeholderText?: string
  /**
   * Specify the input type.
  */ 
  type?: 'text' | 'number' | 'email' | 'password' | 'search' | 'tel' | 'datetime-local' | 'date' | 'time' | 'url' | 'week'
  /**
   * A maximum value when entering dates or numbers
  */
  max?: string | number;
  /**
   * A minimum value when entering dates or numbers
  */
  min?: string | number;
  /*
  * Restrict valid input
  */
  pattern?: string;
}

export const writeInDefaults: WriteInFieldProps = {
  ...InputDefaults,
  placeholderText: '',
  type: 'text',
  min: '',
  max: ''
} as WriteInFieldProps

const WriteInField: React.FC<WriteInFieldProps> = (props) => {
  const {
    id,
    refer,
    type,
    defaultValue,
    disabled,
    max,
    min,
    name,
    onBlur,
    onChange,
    onClick,
    pattern,
    placeholderText,
    classes,
    required,
    value
  } = props

  return(
    <input
      className={`form-field_control ${classes}`.trim()}
      defaultValue={defaultValue}
      value={defaultValue ? undefined : value}
      disabled={disabled}
      id={id}
      max={max}
      min={min}
      name={name}
      onBlur={onBlur}
      onChange={onChange}
      onClick={onClick}
      pattern={pattern}
      placeholder={placeholderText}
      ref={refer}
      required={required}
      type={type || 'text'}
    />
  )
}

WriteInField.defaultProps = writeInDefaults

export default WriteInField