import React from 'react';

import { IdeaProperty } from '../utils/types';

export default ({
  title,
  value = 10,
  onSelect,
}: {
  title: IdeaProperty;
  value: number;
  onSelect: (title: IdeaProperty, event: React.ChangeEvent<HTMLSelectElement>) => void;
}) => {
  // create an array from 1 to 10
  const options = [...Array(10)].map((_, i) => i + 1);
  return (
    <select defaultValue={value.toString()} onChange={e => onSelect(title, e)}>
      {options.map(opt => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
};
