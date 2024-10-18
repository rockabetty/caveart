import React from 'react';
import { InteractiveProps } from '../types/interactive';
import './TabGroup.css';
import classNames from 'classnames';

export interface TabProps extends InteractiveProps {
  labelText: string;
  isActive: boolean;
}

const Tab = function (props) {
  const {
  	id,
    labelText,
    isActive,
    onClick
  } = props;
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      className={
      classNames({
      'tabgroup_tab': true,
      'Active': !!isActive
      })}
    >
      {labelText}
    </button>
  )
}

export default Tab;