import React from 'react'
import Button from '../Button'
import classNames from 'classnames'
import Icon from '../../Icon'
import '../../design/style.css'
import './Badge.css'

export interface BadgeProps {
  id?: string
  /**
   * "primary": highlights the next logical step forward.
   * "warning": denotes the button destroys data, e.g. 'delete'.
   * "muted": For coupling with primary buttons as the 'backward' step.
   */
  look?: 'primary' | 'default' | 'muted' | 'warning' | undefined
  /**
   * optional additional styling
   */
  classes?: string
  /**
   * A disabled button renders but can no longer be clicked.
   */
  disabled?: boolean
  /**
   * All buttons must have labels for accessibility purposes
  */
  label?: string
  /**
   * Set 'showLabel' to true to show a text label next to the icon.
  */
  showLabel?: boolean
  /**
   * A function to be called when the button is clicked
   */
  onClick?: (...params: any) => any
  tabIndex?: number
  /**
   * A name for an icon to place in the badge
  */
  icon: string
  /** 
  * Control the width of an icon SVG
  */
  width?: number
  /**
   * Control the height of an icon SVG
   */
  height?: number
   /**
    * Specify the viewbox of an icon SVG
    */
  viewbox?: string
}

const Badge = ({
  id = '',
  width = 24,
  height = 24,
  viewbox = "0 0 16 16",
  look,
  classes = '',
  disabled,
  onClick = () => {},
  tabIndex,
  icon = 'close',
  label,
  showLabel = false
}: BadgeProps) => {
  return(
    <Button
      id={id}
      disabled={disabled}
      onClick={(e) => {onClick(e)}}
      classes={`${classes} ${classNames({
        'Badge': true,
        'Labeled': showLabel === true
      })}`.trim()}
      look={look}
      role='button'
      tabIndex={tabIndex}
      type='button'
    >
      <Icon name={icon} title={label} width={width} height={height} viewbox={viewbox}/>
      <span className={showLabel ? '' : 'Invisible'}>{label}</span>
    </Button>
  )
}

export default Badge