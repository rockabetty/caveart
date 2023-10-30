import React, { useMemo, useState } from 'react'
import Badge from '../Button'
import '../design/style.css'
import './Accordion.css'

export interface AccordionProps {
  id?: string
  /**
   * Children are visible when the accordion is open
  */
  children: React.ReactNode
  classes?: string
  defaultOpen?: boolean
}

const Accordion = ({
  id = '',
  children,
  classes = '',
  defaultOpen = false
}:AccordionProps) => {

  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen)

  function toggleOpen() {
    const openState = !isOpen
    setIsOpen(openState)
  }

  // The first child is going to be visible at all times.
  // The subsequent children aren't.
  const heading = useMemo(() => {
    if (children) {
      return React.Children.toArray(children)[0]
    }
    return null
  }, [children])

  const body = useMemo(() => {
    if (children) {
      return React.Children.toArray(children).slice(1)
    }
    return null
  }, [children])

  return(
    <div className={`accordion ${classes}`.trim()} id={id}>
      <div className="accordion_heading">
        <span className="accordion_title">
          {heading}
        </span>
        <Badge
          look="muted"
          height={16}
          width={16}
          viewbox="0 0 16 9"
          icon={ isOpen ? 'arrowUp' : 'arrowDown'}
          onClick={toggleOpen}
        />
      </div>
      <div className={`accordion_body ${isOpen === true ? "Open" : "Closed"}`}>
        {body}
      </div>
    </div>
  )
}

export default Accordion