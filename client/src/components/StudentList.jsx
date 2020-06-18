import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import compare from '../compare';
import './css/StudentList.css';

import StudentElement from './StudentElement';

const StudentList = props => {
  const { id } = useParams();
  const { setGeneratorConfig, studentChanges } = props;
  const [students, setStudents] = useState([]);
  const [present, setPresent] = useState([]);
  const [mode, setMode] = useState('min');
  const [n, setN] = useState('2');

  useEffect(() => {
    fetch(`/ggs/rosters/${id}`)
    .then(response => response.json())
    .then(response => {
      setStudents([...response.students.sort(compare)]);
      setPresent([...response.students]);
    });
    setGeneratorConfig({
      mode: 'min',
      n: '2',
      present: [],
      shuffles: 0
    });
  },[id, setGeneratorConfig, studentChanges]);

  const handleModeChange = e => {
    setMode(e.target.value);
  };

  const handleNChange = e => {
    const newN = e.target.value;
    const regexp = new RegExp('^[1-9]\\d*$');

    if (regexp.test(newN) || newN === '') {
      setN(newN);
    }
  };

  const passGeneratorConfig = () => {
    if (n === '') {
      window.alert('Skriv inn et tall i feltet for antall elever per gruppe.');
    } else {
      setGeneratorConfig(prev => {
        return {
          present: [...present],
          mode: mode,
          n: n,
          shuffles: prev.shuffles + 1
        };
      });
    }
  };

  return (
    <div className="container student-container">
    <p>Sett kryss ved fraværende elever:</p>
      {students.map(student => {
        return (
          <StudentElement key={student._id} student={student} present={present} setPresent={setPresent} />
        );
      })}
    <p>
      Det skal være <select value={mode} onChange={handleModeChange}>
        <option value="min">minst</option>
        <option value="max">høyst</option>
      </select> <input type="text" size="2" value={n} onChange={handleNChange} /> elever per gruppe. <button onClick={passGeneratorConfig}>Lag grupper</button>
    </p>
    </div>
  );
};

export default StudentList;
