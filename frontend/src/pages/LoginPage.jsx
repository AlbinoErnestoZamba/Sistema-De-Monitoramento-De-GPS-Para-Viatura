// frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import '../styles/LoginPage.css';
import { FaGoogle, FaFacebookF, FaApple, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login realizado com sucesso!', data);
        localStorage.setItem('access_token', data.access_token);
        navigate('/painel');
      } else {
        setError(data.detail || 'Erro ao fazer login. Verifique suas credenciais.');
        console.error('Erro ao fazer login:', data);
      }
    } catch (error) {
      setError('Erro de conexão com o servidor.');
      console.error('Erro ao conectar com o servidor:', error);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="login-left">
          <h2>Login</h2>

          <form className="login-form" onSubmit={handleLogin}>
            {error && <p className="error-message">{error}</p>}

            <label>Email</label>
            <input
              type="email"
              placeholder="example.email@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter at least 8+ characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

        <div className="login-right"></div>
      </div>
    </div>
  );
};

export default LoginPage;

