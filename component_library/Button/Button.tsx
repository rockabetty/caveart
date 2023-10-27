import React from 'react'
import classNames from 'classnames'
import '../design/style.css'
import './Button.css'

export interface ButtonProps {
  id?: string;
  /**
   * Button content.
   */
  children: React.ReactNode;
  /**
   * "primary": highlights the next logical step forward.
   * "warning": denotes the button destroys data, e.g. 'delete'.
   * "muted": For coupling with primary buttons as the 'backward' step.
   */
  look?: 'primary' | 'default' | 'muted' | 'warning' | undefined;
  /**
   * optional additional styling
   */
  classes?: string;
  /**
   * A disabled button renders but can no longer be clicked.
   */
  disabled?: boolean;
  /**
   * A function to be called when the button is clicked
   */
  onClick?: (...params: any) => any;
  /**
   * Specify the role of the button for accessibility
   */
  role?: string;
  tabIndex?: number;
  type?: 'button' | 'reset' | 'submit';
  loading?: boolean;
}

const Button = ({
  id ='',
  look,
  children,
  classes = '',
  disabled,
  loading,
  onClick = () => {},
  role,
  tabIndex,
  type
  }: ButtonProps) => {
  return(
    <button
      id={id}
      disabled={disabled}
      onClick={(e) => {onClick(e)}}
      className={`button ${classes} ${classNames({
        'Disabled': !!disabled,
        'Muted': look === 'muted',
        'Primary': look ==='primary',
        'Warning': look === 'warning'
      })}`.trim()}
      role={role}
      tabIndex={tabIndex}
      type={type}
    >
      {loading ? "..." : children}
    </button>
  )
}

export default Button