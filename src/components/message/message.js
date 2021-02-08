import React from 'react';
import './message.scss';
import Avatar from '../avatar/avatar';
import { isSameDay, parseISO, format } from 'date-fns';

function Message(props) {
  const message = props.message || {};
  const messageTime = parseISO(message.sentAt);
  const now = new Date();
  let formaStr = 'yyyy-MM-dd HH:mm';
  if (isSameDay(messageTime, now)) {
    formaStr = 'HH:mm';
  }
  const sentAt = format(messageTime, formaStr);
  const className = ['message-info'];

  if (message.senderId === props.userId) {
    className.push('is-owner');
  }
  let sys = <div className="message message-sys">{message.content}</div>
  let normal = <div className="message">
    <div className="sent-time">{sentAt}</div>
    <div className={className.join(' ')}>
      <Avatar cssClass="avatar" size="36" url={message.senderAvatar}></Avatar>
      <div className="message-body">
        <div className="sender-name">{message.senderName}</div>
        <div className="bubble">{message.content}</div>
      </div>
    </div>
  </div>
  return (
    message.type === 'sys' ? sys : normal
  );
}

export default Message;
