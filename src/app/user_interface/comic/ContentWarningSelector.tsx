import React from 'react';
import { Accordion, Radio } from '../../../../component_library';

type ContentWarning = {
  id: string;
  name: string;
  children: ContentWarning[];
};

type ContentWarningProps = {
  options: ContentWarning[];
  selection: { [key: string]: `${number}` | number };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const ContentWarningSelector: React.FC<ContentWarningProps> = (props) => {
  const {
    options,
    selection,
    onChange
  } = props;

  return (
    <div className="ReactiveGrid">
      {options && options.map((warning: ContentWarning, idx: number) => {
        console.log(selection)
        return (
          <Accordion key={idx}>
            {warning.name}
            {warning.children.map((child: ContentWarning, idx: number) => {
              const name = child.name;
              return (
                <fieldset className="form-field" key={`content-warning-${idx}`}>
                  <legend><strong>{child.name}:</strong></legend>
                  <Radio
                    id={`no-cw-${name}`}
                    onChange={onChange}
                    labelText="No"
                    checked={selection && selection[name] === undefined}
                    name={name}
                    value="none"
                  />
                  {child.children.map((option: ContentWarning, idx: number) => {
                    return (
                      <Radio
                        id={`cw-${name}-${option.id}`}
                        key={`cw-key-${idx}`}
                        onChange={onChange}
                        labelText={["Some", "Frequent"][idx]}
                        name={name}
                        checked={selection && selection[name] == option.id}
                        value={option.id}
                      />
                    );
                  })}
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