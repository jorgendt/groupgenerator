import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

import querystring from 'querystring';
import compare from '../compare';

import './css/RosterEdit.css';

const RosterEdit = props => {
  const [students, setStudents] = useState([]);
  const {changes, setChanges} = props;
  const [newStudentName, setNewStudentName] = useState('');
  const {_id, name} = props.roster;

  useEffect(() => {
    fetch(`/ggs/rosters/${_id}`)
    .then(response => response.json())
    .then(response => {
      setStudents([...response.students.sort(compare)]);
    })
  },[_id, changes]);

  const deleteStudent = e => {
    fetch(`/ggs/rosters/${_id}/students/${e.currentTarget.id}`, {
      method: 'DELETE'
    })
    .then(() => {
      setChanges(prev => prev + 1);
    });
  };

  const handleChange = e => {
    setNewStudentName(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    fetch(`/ggs/rosters/${_id}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
      body: querystring.stringify({ name: newStudentName })
    })
    .then(() => {
      setChanges(prev => prev + 1);
      setNewStudentName('');
    });
  };

  return (
    <div className="container">
      <h2>Elever i {name}</h2>
      <div className="student-container-edit">
      { students.map(student => {
        return (
          <div key={student._id} className="student-element-edit">
          {student.name}
          <button className="icon-button" id={student._id} onClick={deleteStudent}><FaTimes /></button>
          </div>
        );
      }) }
      </div>
      <form>
        <input type="text" name="new-student" value={newStudentName} onChange={handleChange} />
        <button onClick={handleSubmit}>Legg til ny elev</button>
      </form>
    </div>
  );
};

export default RosterEdit;
