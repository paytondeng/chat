import React from 'react';

function Avatar(props) {
  const avatarUrl = props.url || 'logo.png';
  const size = props.width || '50';
  const cssClass = props.cssClass || 'avatar';

  return (
    <img
        className={`avatar ${cssClass}`}
        src={avatarUrl}
        width={size}
        height={size}
        alt="avatar"
        data-url={avatarUrl}
        onClick={props.click} />
  );
}

export default Avatar;
