import React, {useState} from 'react';
import { UniversalProps } from '../types/universal';
import Tab from './Tab';
import './TabGroup.css';
import classNames from 'classnames';

export interface TabGroupProps extends UniversalProps {
  tabs: String[],
}

const TabGroup = function (props) {

  const [activeTabId, setActiveTabId] = useState<String>("");

  const updateTab = function (event: React.SyntheticEvent) {
    setActiveTabId(event.target.id);
  }

  const {
    id,
    tabs
  } = props;
  return (
    <div className='tabgroup'
    >
      {tabs.map((tab, idx) => {
        const tabId = `tabgroup-tab-${tab}`;
        return (
          <Tab
            id={tabId}
            key={`tabgroup-tab-${idx}`}
            labelText={tab}
            isActive={activeTabId === tabId}
            onClick={updateTab}
          />
          )
      })}
    </div>
  )
}

export default TabGroup;