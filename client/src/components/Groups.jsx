import React from 'react';

import './css/Groups.css';

const Groups = props => {
  const shuffle = array => {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  const chunkify = (array, idealSize, mode) => {
    let out = [],
      i = 0,
      n, size;

    if (mode === "min") {
      n = Math.floor(array.length / idealSize);
    } else {
      n = Math.ceil(array.length / idealSize);
    }

    while (i < array.length) {
      size = Math.ceil((array.length - i) / n--);
      out.push(array.slice(i, i += size));
    }

    return out;
  }

  if (props.generatorConfig.present.length === 0) {
    return (<div className="groups-wrapper"></div>);
  } else {
    const groups = chunkify(shuffle(props.generatorConfig.present), props.generatorConfig.n, props.generatorConfig.mode);
    return (
      <div className="groups-wrapper">
        { groups.map((group, index) => {
          return (
            <div key={index+1} className="container">
            <h2>Gruppe&nbsp;{index+1}:</h2>
            { group.map(student => <p key={student._id}>{student.name}</p>) }
            </div>
          );
        }) }
      </div>
    );
  }
};

export default Groups;
