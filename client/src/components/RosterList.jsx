import React, { useState, useEffect } from 'react';
import { FaPencilAlt, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup';

import querystring from 'querystring';

import compare from '../compare';
import './css/RosterList.css';

import RosterEdit from './RosterEdit';

const RosterList = props => {
  const [rosters, setRosters] = useState([]);
  const [newRosterName, setNewRosterName] = useState('');
  const [changeCounter, setChangeCounter] = useState(0);

  useEffect(() => {
    fetch(`/ggs/rosters/ownedby/${props.owner}`)
    .then(response => response.json())
    .then(response => {
      setRosters(response.sort(compare));
    });
  }, [props.owner, changeCounter]);

  const handleChange = e => {
    setNewRosterName(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    fetch(`/ggs/rosters/ownedby/${props.owner}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
      body: querystring.stringify({ name: newRosterName })
    })
    .then(() => {
      setChangeCounter(prev => prev + 1);
      setNewRosterName('');
    });
  };

  const deleteRoster = e => {
    if (window.confirm(`Er du sikker på at du vil slette ${e.currentTarget.name}?`)) {
      fetch(`/ggs/rosters/${e.currentTarget.id}`, {
        method: 'DELETE'
      })
      .then(() => {
        setChangeCounter(prev => prev + 1);
      });
    }
  };

  return (
    <div className="container">
    <p>Velg klasse:</p>
      { rosters.map(roster => <div key={roster._id} className="roster-element" style={{ clear: 'both' }}>
        <Link to={'/gg/' + roster._id}>{roster.name}</Link>
        <button className="icon-button" id={roster._id} name={roster.name} onClick={deleteRoster}><FaTimes className="icon" /></button>
        <Popup trigger={<button className="icon-button"><FaPencilAlt className="icon" /></button>} modal>
          {close => (
            <div>
            <a className="close" onClick={close}>
              <FaTimes />
            </a>
            <RosterEdit roster={roster} changes={props.studentChanges} setChanges={props.setStudentChanges} />
            </div>
          )}
        </Popup>
      </div>) }

      <div className="roster-element">
      <form>
        <input type="text" name="new-roster" value={newRosterName} onChange={handleChange} />
        <button onClick={handleSubmit}>Legg til</button>
      </form>
      </div>
    </div>
  );
};

export default RosterList;
