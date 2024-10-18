import React, {useState} from 'react';
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

const TabGroup: React.FC<TabGroupProps> = ({
  id,
  tabs,
  initialTab
  }) => {

  const initialActiveTab = initialTab || tabs[0].name
  const initialContent = tabs.find(tab => tab.name === initialActiveTab)?.content;
  const [activeTabName, setActiveTabName] = useState<string>(initialActiveTab);
  const [activeTabContent, setActiveTabContent] = useState<React.ReactNode>(initialContent);

  const updateTab = function (name) {
    setActiveTabName(name);
    const content = tabs.find(tab => tab.name === name)?.content
    setActiveTabContent(content);
  }

  return (
    <div className='tabgroup' id={id}>
      <div className='tabgroup_tab-selection'>
        {tabs.map((tab, idx) => {
          const tabId = `tabgroup-tab-${tab}`;
          return (
            <Tab
              id={tab.id}
              key={`tab-${tab.name}`}
              labelText={tab.name}
              isActive={activeTabName === tab.name}
              onClick={() => updateTab(tab.name)}
            />
            )
        })}
      </div>

      <div className='tabgroup_content'>
        {activeTabContent}
      </div>
    </div>
  )
}

export default TabGroup;