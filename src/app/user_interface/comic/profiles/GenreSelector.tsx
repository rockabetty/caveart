import { Checkbox } from "@components";
import "../layout.css";
import { useTranslation } from "react-i18next";
import React from "react";

export type Genre = {
  id: string;
  name: string;
  description?: string;
};

export type GenreUserSelection = {
  [key: `${number}` | number]: Genre;
};

type GenreSectionProps = {
  id?: string;
  selection: GenreUserSelection;
  options: Genre[];
  onChange: (...params: any) => any;
};

const GenreSelector: React.FC<GenreSectionProps> = (props) => {
  const { t } = useTranslation();

  const { id, options, selection, onChange } = props;

  return (
    <div className="ReactiveGrid">
      {options.map((genre, idx) => (
        <Checkbox
          key={`selectable-genre${id ? `-${id}-` : "-"}${idx}`}
          id={`${id ? `${id}-` : null}option-${genre.id}`}
          labelText={t(`genres.${genre.name}`)}
          checked={selection && !!selection[Number(genre.id)]}
          onChange={onChange}
          name="genres"
          value={genre.id.toString()}
        />
      ))}
    </div>
  );
};

export default GenreSelector;
