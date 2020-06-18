import React, { useState } from 'react';

import './css/StudentElement.css';

import 'pretty-checkbox';
import { Checkbox } from 'pretty-checkbox-react';
import { FaTimes } from 'react-icons/fa';

const StudentElement = props => {
  const [checked, setChecked] = useState(false);

  const handleChange = e => {
    if (checked) {
      props.setPresent(prev => [...prev, props.student]);
    } else {
      props.setPresent(prev => prev.filter(student => student._id !== props.student._id));
    }

    setChecked(prev => !prev);
  };

  return (
    <div className="student-element">
      <Checkbox checked={checked} onChange={handleChange} shape="curve" icon={<FaTimes />}>
        <span className={checked ? 'checked' : ''}>{props.student.name}</span>
      </Checkbox>
    </div>
  );
};

export default StudentElement;
