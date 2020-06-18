import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';

import './css/GroupGenerator.css';

import RosterList from './RosterList';
import StudentList from './StudentList';
import Groups from './Groups';

const GroupGenerator = props => {
  const [studentChanges, setStudentChanges] = useState(0);
  const [generatorConfig, setGeneratorConfig] = useState({
    mode: 'min',
    n: '2',
    present: [],
    shuffles: 0
  });

  return (
    <div className="gg-wrapper">
      <RosterList owner={props.user.id} studentChanges={studentChanges} setStudentChanges={setStudentChanges} />

      <Switch>
        <Route path="/gg/:id" children={<StudentList studentChanges={studentChanges} setGeneratorConfig={setGeneratorConfig} />} />
      </Switch>

      <Groups generatorConfig={generatorConfig} />

    </div>
  );
};

export default GroupGenerator;
