import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RegisterPage.css';
import { CheckCircle, AlertCircle } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    username: '', // Usando 'username' para corresponder ao backend
    password: '',
    confirmarSenha: '',
  });

  const handleCancel = () => navigate('/');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmarSenha) {
      setFormError('As senhas não coincidem!');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (response.ok) {
        setFormSuccess(true);
        setFormError('');
        setTimeout(() => navigate('/login'), 2000); // Redirecionar para a página de login após o sucesso
      } else {
        const errorData = await response.json();
        setFormError(errorData.detail || 'Erro ao registrar usuário.');
      }
    } catch (error) {
      setFormError('Erro de conexão com o servidor.');
    }
  };

  return (
    <div className="register-container">
      <h2>Crie uma conta</h2>

      {formSuccess && (
        <div className="success-bar">
          <CheckCircle size={20} />
          <span>Conta criada com sucesso! Redirecionando para login...</span>
        </div>
      )}

      {formError && (
        <div className="error-bar">
          <AlertCircle size={20} />
          <span>{formError}</span>
        </div>
      )}

      <form className="register-form" onSubmit={handleSubmit}>
        <fieldset>
          <legend>Informações de login</legend>
          <p>Escolha um nome de usuário e senha.</p>

          <input
            type="text"
            name="username"
            placeholder="Digite seu nome de usuário"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Digite sua senha"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmarSenha"
            placeholder="Confirme sua senha"
            onChange={handleChange}
            required
          />
        </fieldset>

        <div className="register-buttons">
          <button type="button" onClick={handleCancel}>
            Cancela
          </button>
          <button type="submit" className="submit-btn">
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;

