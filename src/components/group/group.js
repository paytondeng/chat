import React from 'react';
import Avatar from '../avatar/avatar';
import './group.scss';
import { format, parseISO, isSameDay } from 'date-fns';

class Group extends React.Component {

  constructor(props) {
    super(props);
    this.handleClickGroup = this.handleClickGroup.bind(this);
  }

  handleClickGroup(ev) {
    this.props.click(this.props.group);
  }

  render() {
    const props = this.props;
    const group = props.group || {};
    const currentId = props.currentId || 0;
    let time = '';
    if (group.time) {
      const lastMessageTime = parseISO(group.time);
      let formaStr = 'yyyy-MM-dd';
      if (isSameDay(lastMessageTime, new Date())) {
        formaStr = 'HH:mm';
      }
      time = format(lastMessageTime, formaStr);
    }

    let messageContent = '';
    switch(group.lastMessageType) {
      case 2:
        messageContent = '[图片]'
        break;
      default:
        messageContent = group.lastMessage;
    }

    return (
      <li
          className={currentId === group.id ? 'chat-item chat-item-active' : 'chat-item'}
          key={group.id}
          onClick={this.handleClickGroup}>
        <Avatar></Avatar>
        <div className="chat-info">
          <h3 className="chat-name-wrapper">
            <span className="chat-name">{group.name}</span>
            <span className="time">{time}</span>
          </h3>
          <p className="last-message">{messageContent}</p>
        </div>
      </li>
    );
  }
}

export default Group;
