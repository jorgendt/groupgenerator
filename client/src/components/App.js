import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import './css/App.css';

import Header from './Header';
import GroupGenerator from './GroupGenerator';

const App = () => {
  const [user, setUser] = useState({
    username: '',
    id: '',
    loggedIn: false
  });

  useEffect(() => {
    fetch('/ggs/login/ensure', { credentials: 'include' })
    .then(response => {
      if (response.status === 401) {
        setUser(prev => {
          return {
            ...prev,
            loggedIn: false
          };
        });
      } else if (response.status === 200) {
        setUser(prev => {
          return {
            ...prev,
            loggedIn: true
          }
        });
      }
      return response.json();
    })
    .then(response => {
      setUser(prev => {
        return {
          ...prev,
          username: response.username,
          id: response._id
        };
      });
    });
  }, []);

  return (
    <Router>
    <div>
      <Header user={user} />
      { user.loggedIn && <GroupGenerator user={user} /> }
    </div>
    </Router>
  );
};

export default App;
