import React from "react";
import { TabGroup, Radio } from "@components";
import { useTranslation } from 'react-i18next';

type ContentWarning = {
  id: string;
  name: string;
  children: ContentWarning[];
};

type ContentWarningProps = {
  options: ContentWarning[];
  selection: { [key: string]: { id: number; name: string } };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => any;
};

const ContentWarningSelector: React.FC<ContentWarningProps> = ({
  options,
  selection,
  onChange,
}) => {
  const { t } = useTranslation();

  if (!options || options.length === 0) return null;

  return (
    <TabGroup
      id="content_warnings"
      tabs={options.map((warning) => ({
        name: t(`contentWarnings.${warning.name}`),
        content: (
          <div key={warning.id}>
            {warning.children.map((child) => (
              <ContentWarningFieldset
                key={child.id}
                child={child}
                selection={selection}
                onChange={onChange}
                t={t}
              />
            ))}
          </div>
        ),
      }))}
    />
  );
};

type ContentWarningFieldsetProps = {
  child: ContentWarning;
  selection: { [key: string]: { id: number; name: string } };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => any;
  t: (key: string) => string;
};

const ContentWarningFieldset: React.FC<ContentWarningFieldsetProps> = ({
  child,
  selection,
  onChange,
  t,
}) => {
  const name = child.name;

  return (
    <fieldset className="form-field" key={`content-warning-${child.id}`}>
      <legend>
        <strong>{t(`contentWarnings.${child.name}.name`)}</strong>
      </legend>
      <p>{t(`contentWarnings.${child.name}.definition`)}</p>
      <Radio
        id={`${name}Absent`}
        onChange={onChange}
        labelText={t('contentWarnings.absent')}
        checked={selection && selection[name] === undefined}
        name={name}
        value="none"
      />
      {child.children.map((option, idx) => {
        const labelKey = idx === 0 ? 'some' : 'frequent';
        const labelString = `${labelKey}${name.charAt(0).toUpperCase()}${name.slice(1)}`;
        return (
          <Radio
            id={labelString}
            key={option.id}
            onChange={onChange}
            labelText={t(`contentWarnings.${child.name}.${labelString}`)}
            name={name}
            checked={selection[name]?.id === Number(option.id)}
            value={option.id}
          />
        );
      })}
    </fieldset>
  );
};

export default ContentWarningSelector;