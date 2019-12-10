import React from 'react';
import io from 'socket.io-client';
import Message from '../../components/message/message';
import User from '../../components/user/user';
import Group from '../../components/group/group';
import SideBar from '../../components/side-bar/side-bar';
import { apiHost } from '../../core/request';
import './chat.scss';

class Chat extends React.Component {
  socket
  messageList
  history
  timer

  constructor(props) {
    super(props);
    this.history = props.history;
    this.state = {
      chatTitle: '',
      message: '',
      chatGroups: [],
      messages: [],
      onlineUers: [],
      onlinePanelActive: false,
      selectedGroup: {},
      typing: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleEnterKey = this.handleEnterKey.bind(this);
    this.handleClickUserIcon = this.handleClickUserIcon.bind(this);
    this.closeOnlineUsersPanel = this.closeOnlineUsersPanel.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem('accessToken');
    const socket = this.socket = io.connect(apiHost, {
      transports: ['websocket'],
      query: `token=${token}`,
    });

    socket.on('connect', () => {
      console.log('Connected');
      socket.on('onlineusers', users => {
        const onlineUers = users.map(item => {
          return {
            id: item.id,
            name: item.nickName,
            avatar: item.avatar,
          };
        });
        this.setState({
          onlineUers,
        });
      });

      socket.on('chatgroups', groups => {
        this.setState({
          chatGroups: groups,
        });
        if (groups.length > 0) {
          this.setState({
            selectedGroup: groups[0],
          });
        }
      });
    });

    socket.on('message', (message) => {
      const messages = this.state.messages;
      messages.push(message);
      this.setState({
        messages,
      });
      this.updateLastMessage(message);
      this.scrollToBottom();
    });

    socket.on('messages', (messages) => {
      this.setState({
        messages,
      });
      this.scrollToBottom();
    });

    socket.on('userin', (user) => {
      const messages = this.state.messages;
      messages.push({
        type: 'sys',
        sentAt: new Date().toISOString(),
        content: `${user.nickName} 进入群聊`
      });
      this.setState({
        messages,
      });
      this.scrollToBottom();
    });

    socket.on('userleave', (user) => {
      const messages = this.state.messages;
      messages.push({
        type: 'sys',
        sentAt: new Date().toISOString(),
        content: `${user.nickName} 退出群聊`
      });
      this.setState({
        messages,
      });
      this.scrollToBottom();
    });

    socket.on('typing', (user) => {
      this.stopTimer();
      this.setState({
        typing: `${user.nickName} 正在输入中...`
      });
      this.startTimer();
    });

    socket.on('exception', (data) => {
      console.log('exception is', data);
      const { errcode } = data;
      if (errcode === 'ACCESS_TOKEN_EXPIRED' || errcode === 'ACCESS_TOKEN_REQUIRED') {
        this.history.push('/login');
      }
    });

    socket.on('disconnect', () => {
      console.log('Disconnected');
    });

    window.addEventListener('click', this.closeOnlineUsersPanel);
    document.addEventListener('keypress', this.handleEnterKey);
    this.messageList = document.getElementById('messageList');
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.closeOnlineUsersPanel)
    document.removeEventListener('keypress', this.handleEnterKey);
    if (this.socket) {
      this.socket.close();
    }
  }

  closeOnlineUsersPanel() {
    this.setState({
      onlinePanelActive: false,
    });
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({
      message: event.target.value,
    });
  }

  handleEnterKey(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      let message = this.state.message;
      message = message.trim();
      if (!message) {
        return;
      }
      this.socket.emit('message', {
        content: message,
      });
      this.setState({
        message: '',
      });
    } else {
      this.socket.emit('typing');
    }
  }

  handleClickUserIcon(event) {
    event.stopPropagation();
    this.setState({
      onlinePanelActive: !this.state.onlinePanelActive,
    });
  }

  render() {
    const { chatGroups, messages: chatMessages, onlineUers: users, selectedGroup, typing } = this.state;
    const listItems = chatGroups.map((group) => {
      return <Group key={group.id} currentId={selectedGroup.id} group={group}></Group>;
    });

    const chatTitle = selectedGroup.name;

    const messages = chatMessages.filter(message => message.sentAt).map((message, index) => {
      return <Message key={index + 1} message={message} />;
    });

    const onlineUers = users.map(user => {
      return <User className="user" key={user.id} user={user}></User>
    });

    const typingEle = typing ? <div className="note">{typing}</div> : '';

    return (
      <div className="chat">
        <SideBar history={this.history}></SideBar>
        <section className="column-middle">
          <section className="search-bar">
            {/* <input type="text" /> */}
          </section>
          <ul className="chat-list">
            {listItems}
          </ul>
        </section>
        <div className="chat-body">
          <section className="header">
            <h2>{chatTitle}（{onlineUers.length}）</h2>
            <i className="icon-user fa fa-user-o" aria-hidden="true" onClick={this.handleClickUserIcon}></i>
          </section>
          <section className="body">
            {typingEle}
            <section className="messages" id="messageList">
              {messages}
            </section>
            <section className="footer">
              <div className="action-bar">
                {/* <i className="fa fa-smile-o" aria-hidden="true"></i> */}
              </div>
              <textarea
                  className="message-box"
                  onChange={this.handleChange}
                  value={this.state.message}></textarea>
            </section>
            <section
                className={this.state.onlinePanelActive ? 'online-users online-users-active' : 'online-users'}
                onClick={(event) => event.stopPropagation()}>
              <ul>{onlineUers}</ul>
            </section>
          </section>
        </div>
      </div>
    );
  }

  scrollToBottom() {
    setTimeout(() => {
      const ele = this.messageList;
      ele.scrollTop = ele.scrollHeight;
    }, 200);
  }

  updateLastMessage(message) {
    const selectedGroup = this.state.selectedGroup;
    if (selectedGroup) {
      const groups = this.state.chatGroups;
      const targetGroupIndex = groups.findIndex(item => item.id === selectedGroup.id);
      groups[targetGroupIndex] = {
        ...selectedGroup,
        lastMessage: message.content,
        time: message.sentAt,
      };
      this.setState({
        groups,
      });
    }
  }

  stopTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  startTimer() {
    this.stopTimer();
    this.timer = setTimeout(() => {
      this.setState({
        typing: '',
      });
    }, 1500);
  }
}

export default Chat;
