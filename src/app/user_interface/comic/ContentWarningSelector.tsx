import React from "react";
import { Accordion, Radio } from "../../../../component_library";
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

const ContentWarningSelector: React.FC<ContentWarningProps> = (props) => {
  const { options, selection, onChange } = props;
  const { t } = useTranslation();

  return (
    <div className="ReactiveGrid">
      {options &&
        options.map((warning, idx) => {
          return (
            <Accordion key={idx}>
              {t(`contentWarnings.${warning.name}`)}
              {warning.children.map((child, idx) => {
                const name = child.name;
                return (
                  <fieldset
                    className="form-field"
                    key={`content-warning-${idx}`}
                  >
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
                    {child.children.map(
                      (option, idx) => {
                        const labelString = `${["some", "frequent"][idx]}${name
                          .charAt(0)
                          .toUpperCase()}${name.substr(1)}`;
                        return (
                          <Radio
                            id={labelString}
                            key={`cw-key-${idx}`}
                            onChange={onChange}
                            labelText={t(`contentWarnings.${child.name}.${labelString}`)}
                            name={name}
                            checked={
                              selection[name] &&
                              selection[name].id == Number(option.id)
                            }
                            value={option.id}
                          />
                        );
                      },
                    )}
                  </fieldset>
                );
              })}
            </Accordion>
          );
        })}
    </div>
  );
};

export default ContentWarningSelector;
