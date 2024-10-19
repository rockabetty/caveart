import React from 'react'
import classNames from 'classnames'
import '../design/style.css'
import './Button.css'

interface ButtonAtomProps {
  id?: string;
  children: React.ReactNode;
  look?: 'primary' | 'default' | 'muted' | 'warning' | undefined;
  classes?: string;
  disabled?: boolean;
  onClick?: (...params: any) => any;
  role?: string;
  tabIndex?: number;
  type?: 'button' | 'reset' | 'submit';
  loading?: boolean;
  inline?: boolean;
}

const ButtonAtom = ({
  id ='',
  look,
  children,
  disabled = false,
  loading,
  onClick = () => {},
  role = "button",
  tabIndex,
  type = "button",
  inline = false,
  classes
  }: ButtonAtomProps) => {

  return(
    <button
      id={id}
      disabled={disabled}
      onClick={(e) => {onClick(e)}}
      className={`button ${classes} ${classNames({
        'Disabled': !!disabled,
        'Muted': look === 'muted',
        'Primary': look ==='primary',
        'Warning': look === 'warning',
        'Inline': inline === true,
      })}`.trim()}
      role={role}
      tabIndex={tabIndex}
      type={type}
    >
      {loading ? "..." : children}
    </button>
  )
}

export default ButtonAtom