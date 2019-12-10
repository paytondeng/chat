import React from 'react';
import './user.scss';
import Avatar from '../avatar/avatar';

function User(props) {
  const user = props.user || {};
  return (
    <li className="user-item" key={user.id}>
      <Avatar url={user.avatar}></Avatar>
      <span className="nick-name">{user.name}</span>
    </li>
  );
}

export default User;
