import React from 'react';
import classNames from 'classnames';
import '../design/style.css';
import './Link.css';
import '../Button/Button.css';

export interface LinkProps {
  id: string
  /**
   * Children for the link
  */
  children: React.ReactNode
  /**
   * Pass the `href` attribute for the <a> element
   */
  href: string
  /**
   * Optional additional styling
  * */
  classes?: string
  inline?: boolean
  /**
   * Pass the <a> element target attribute
  * */
  target?: '_blank' | '_self' | '_parent' | '_top' | 'framename'
  disabled?: boolean
  /**
   * custom on click event function
  * */
  onClick?: (...params: any) => any
}

const Link = ({
  id = '',
  children = 'Link',
  href = '#',
  target = '_self',
  classes = '',
  disabled,
  type,
  onClick,
}:LinkProps) => {

  return(
    <a
      id={id}
      href={href}
      target={target}
      className={`${classes} ${classNames({
        'Inline': type === 'inline',
        'Disabled': !!disabled,
        'button': type === 'button',
        'link': type !== 'button',
        'Primary': type === 'button'
      })}`.trim()}
      onClick={onClick}
    >
      {children}
    </a>
  )
}

export default Link