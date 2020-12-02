import React from 'react';
import { Link } from "react-router-dom";
import './home.scss';

function Home() {
  return (
    <section className="page-home">
      <div class="page-home__logo">聊</div>
      <p className="page-home__desc">聊一聊，一个纯聊天工具</p>
      <nav className="page-home__nav">
        <Link className="link" to="/login">登录</Link> | <Link className="link" to="/register">注册</Link>
      </nav>
    </section>
  );
}

export default Home;
