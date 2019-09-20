import React from 'react';
import { Link } from 'react-router-dom';

import './Sidemenu.scss';

type Props = {
  avatarUrl: string;
  isLoggedIn: boolean;
  name: string;
  onLogout: () => void;
};

const Sidemenu = (props: Props) => (
  <div className="side-menu row flex-column text-center">
    <Link to="/">
      <img
        alt="logo"
        className="logo mx-auto"
        src={require('../images/IdeaPool_icon.png')}
        srcSet={`${require('../images/IdeaPool_icon@2x.png')} 2x`}
      />
      <h1>The Idea Pool</h1>
    </Link>
    {props.isLoggedIn && (
      <>
        <hr className="my-5" />
        <div className="mt-2">
          <img src={props.avatarUrl} alt="avatar" className="avatar rounded-circle mx-auto my-1" />
          <h3>{props.name}</h3>
          <button type="button" className="btn btn-link" onClick={props.onLogout}>
            Log out
          </button>
        </div>
      </>
    )}
  </div>
);

export default Sidemenu;
