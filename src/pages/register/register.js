import React from 'react';
import {
  Link
} from "react-router-dom";
import './register.scss';
import { post } from '../../core/request';

class Register extends React.Component {
  history

  constructor(props) {
    super(props);
    this.history = props.history || {};
    this.state = {
      nickName: '',
      email: '',
      password: '',
      confirmPassword: '',
      errMsg: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    event.preventDefault();
    this.setState({
      [name]: value,
    });
  }

  async handleSubmit(ev) {
    this.setState({
      errMsg: '',
    });
    ev.preventDefault();
    try {
      await post('user/register', {
        nickName: this.state.nickName,
        email: this.state.email,
        password: this.state.password,
      });
      this.history.replace('/login');
    } catch (err) {
      this.setState({
        errMsg: err.message,
      });
    }
  }

  render() {
    let message;
    if (this.state.errMsg) {
      message = <p className="errmsg">{ this.state.errMsg }</p>
    }
    return (
      <div className="pannel-wrapper panel-wrapper-register">
        <div className="panel">
          <div className="panel-heading">注册</div>
          <div className="panel-body">
            {message}
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <div className="item-input item-email">
                  <input
                      id="email"
                      type="email"
                      className="form-control"
                      name="email"
                      onChange={this.handleChange}
                      placeholder="请输入邮箱"
                      autoComplete="off"
                      required />
                </div>
                <div className="item-input">
                  <input
                      id="password"
                      type="password"
                      className="form-control"
                      name="password"
                      onChange={this.handleChange}
                      placeholder="请输入密码"
                      autoComplete="new-password"
                      required />
                </div>

                <div className="item-input">
                  <input
                      id="confirmPassword"
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      onChange={this.handleChange}
                      placeholder="请再次输入密码"
                      autoComplete="new-password"
                      required />
                </div>

                <div className="item-input item-password">
                  <input
                      id="nickName"
                      type="text"
                      className="form-control"
                      name="nickName"
                      onChange={this.handleChange}
                      placeholder="请输入昵称"
                      required />
                  <button type="submit" className="btn btn-login btn-primary">
                    <i className="fa fa-btn fa-sign-in"></i>
                  </button>
                </div>
              </div>

              <div className="form-group from-group-more-actions">
                <label>
                  已有账号？<Link className="link forgot-link" to="/login">登录</Link>
                </label>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
