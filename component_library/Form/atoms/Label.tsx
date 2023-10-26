import React from 'react'
import classNames from 'classnames'
import Icon from '../../Icon'
import {InteractiveProps, InteractiveDefaults} from '../../types/universal'

export interface LabelProps extends InteractiveProps {
  htmlFor: string;
  labelText: string;
  hasError?: boolean;
  required?: boolean;
}

export const labelDefaults: LabelProps = {
  ...InteractiveDefaults,
  htmlFor: '',
  labelText: '',
} as LabelProps

const Label: React.FC<LabelProps> = (props) => {

  const {labelText, classes, htmlFor, disabled, required, hasError} = props

  return ( 
    <label
      htmlFor={htmlFor}
      className={`form-field ${classes} ${classNames({
        'Disabled': disabled,
        'Error': hasError,
      })}`.trim()}
    >
      <span>{labelText}</span>
      {required ? <Icon classes="form-field_requirement-icon" width={8} height={8} viewbox="0 0 16 14" name="asterisk" /> : ""}
    </label>
  )
}

Label.defaultProps = labelDefaults;
export default Label