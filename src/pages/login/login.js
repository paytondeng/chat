import React from 'react';
import {
  Link
} from "react-router-dom";
import './login.scss';
import { post } from '../../core/request';

class Login extends React.Component {
  history

  constructor(props) {
    super(props);
    this.history = props.history;
    this.state = {
      email: '',
      password: '',
      errMsg: '',
    }
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

  async handleSubmit(event) {
    this.setState({
      errMsg: '',
    });
    event.preventDefault();
    try {
      const result = await post('auth/login', {
        username: this.state.email,
        password: this.state.password,
      });
      localStorage.setItem('accessToken', result.token);
      const { token, ...user } = result;
      localStorage.setItem('user', JSON.stringify(user));
      this.history.replace('/chat');
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
      <div className="pannel-wrapper panel-wrapper-login">
        <div className="panel">
          <div className="panel-heading">登录</div>
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
                      required />
                </div>
                <div className="item-input item-password">
                  <input
                      id="password"
                      type="password"
                      className="form-control"
                      name="password"
                      onChange={this.handleChange}
                      placeholder="请输入密码"
                      required />
                  <button type="submit" className="btn btn-login btn-primary">
                    <i className="fa fa-btn fa-sign-in"></i>
                  </button>
                </div>
              </div>

              <div className="form-group from-group-more-actions">
                <label className="remember-me">
                  <input type="checkbox" name="remember" /> 记住邮箱
                </label>
                <label>
                  {/* <Link className="link forgot-link" to="/">忘记密码</Link> |*/} <Link className="link register-link" to="/register">注册</Link>
                </label>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
