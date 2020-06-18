import React from 'react';

import './css/Header.css';

const Header = props => {
  return (
    <div className="header-wrapper">
    <h1>
      Gruppegenerator
    </h1>
    { props.user.loggedIn ? (
        <div className="login-info">
          Logget inn som { props.user.username }<br />
          <a href="/ggs/logout">Logg ut</a>
        </div>
      ) : (
        <div className="login-info">
          <a href="/ggs/login">Logg inn</a><br />
          <a href="/ggs/signup">Lag ny bruker</a>
        </div>
      )
    }
    </div>
  );
};

export default Header;
