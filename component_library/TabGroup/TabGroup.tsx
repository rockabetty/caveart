import React, { useState } from 'react';
import { UniversalProps } from '../types/universal';
import Tab from './Tab';
import './TabGroup.css';
import classNames from 'classnames';

interface TabData extends UniversalProps {
  name: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabGroupProps extends UniversalProps {
  tabs: TabData[];
  initialTab?: string;
}

const TabGroup: React.FC<TabGroupProps> = ({ id, tabs, initialTab }) => {
  const initialActiveTab = initialTab || tabs[0].name;
  const [activeTabName, setActiveTabName] = useState<string>(initialActiveTab);

  const updateTab = (name: string) => {
    setActiveTabName(name);
  };

  const activeTabContent = tabs.find((tab) => tab.name === activeTabName)?.content;

  return (
    <div className="tabgroup" id={id}>
      <div className="tabgroup_tab-selection">
        {tabs.map((tab) => (
          <Tab
            id={tab.id}
            key={`tab-${tab.name}`}
            labelText={tab.name}
            isActive={activeTabName === tab.name}
            onClick={() => updateTab(tab.name)}
            disabled={tab.disabled}
          />
        ))}
      </div>

      <div className="tabgroup_content">{activeTabContent}</div>
    </div>
  );
};

export default TabGroup;