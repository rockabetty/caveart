import React from 'react'
import './Button.css'

export interface ButtonSetProps {
  id?: string
  children: React.ReactNode
  classes?: string
}

const Button = ({
  children,
  classes = '',
  ...props}: ButtonSetProps) => {
  return (
    <div
      className={`buttonset ${classes}`.trim()}
    >
      {children}
    </div>
  )
}

export default Button