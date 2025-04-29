// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import '../styles/LoginPage.css'; // Importando o CSS para estilização
import { FaGoogle, FaFacebookF, FaApple, FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-wrapper">
      <div className="login-box">
        {/* Coluna esquerda */}
        <div className="login-left">
          <h2>Login</h2>

          <form className="login-form">
            <label>Email</label>
            <input type="email" placeholder="example.email@gmail.com" />

            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter at least 8+ characters"
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="forgot">
              <a href="#">Forgot password?</a>
            </div>

            <button type="submit" className="sign-in-btn">Sign in</button>

            <div className="divider">Or sign in with</div>

            <div className="social-icons">
              <button className="google"><FaGoogle /></button>
              <button className="facebook"><FaFacebookF /></button>
              <button className="apple"><FaApple /></button>
            </div>
          </form>
        </div>

        {/* Coluna direita com imagem via CSS */}
        <div className="login-right"></div>
      </div>
    </div>
  );
};

export default LoginPage;


