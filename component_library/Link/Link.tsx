import React from 'react';
import classNames from 'classnames';
import '../design/style.css';
import './Link.css';
import '../Button/Button.css';
import { InteractiveProps } from '../types/interactive';

export interface LinkProps extends InteractiveProps {
  /**
   * Children for the link
  */
  children: React.ReactNode
  /**
   * Pass the `href` attribute for the <a> element
   */
  href: string
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
  /**
   * Shift the appearance of the link for semantic vs visual presentation needs
  * */
  type?: 'inline' | 'default' | 'button' | 'inline button'
  look?: 'primary' | 'default' | 'muted' | 'warning' | undefined;
}

const Link = ({
  id = '',
  children = 'Link',
  href = '#',
  target = '_self',
  disabled,
  type,
  onClick,
  look = 'default'
}:LinkProps) => {

  return(
    <a
      id={id}
      href={href}
      target={target}
      className={classNames({
        'Inline': type === 'inline' || type === 'inline button',
        'Disabled': !!disabled,
        'button': type === 'button' || type === 'inline button',
        'Muted': look === 'muted',
        'Primary': look ==='primary',
        'Warning': look === 'warning',
        'link': type !== 'button' && type !== 'inline button',
      })}
      onClick={onClick}
    >
      {children}
    </a>
  )
}

export default Link