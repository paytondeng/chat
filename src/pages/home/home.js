import React from 'react';
import { Link } from "react-router-dom";
import logo from '../../assets/images/logo.svg';
import './home.scss';

function Home() {
  return (
    <section className="page-home">
      <img src={logo} className="app-logo" alt="logo" />
      <nav>
        <Link className="link" to="/login">登录</Link> | <Link className="link" to="/register">注册</Link>
      </nav>
    </section>
  );
}

export default Home;
