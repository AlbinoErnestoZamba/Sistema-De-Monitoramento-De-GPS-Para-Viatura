import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RegisterPage.css';
import { CheckCircle, AlertCircle } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
    marca: '',
    modelo: '',
    ano: '',
    vin: '',
  });

  const handleCancel = () => navigate('/');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleSubmit = (e) => {
     e.preventDefault();

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const vinValido = /^[A-HJ-NPR-Z0-9]{17}$/i;

  if (!emailValido.test(formData.email)) {
    setFormError('Por favor, insira um endereço de e-mail válido!');
    return;
  }

  if (formData.senha !== formData.confirmarSenha) {
    setFormError('As senhas não coincidem!');
    return;
  }

  if (!vinValido.test(formData.vin)) {
    setFormError('O VIN do veículo deve conter exatamente 17 caracteres válidos.');
    return;
  }

  setFormSuccess(true);
  setFormError('');
  setTimeout(() => setFormSuccess(false), 4000);

  // Aqui você pode enviar os dados para a API
  };

  return (
    <div className="register-container">
      <h2>Crie uma conta</h2>

      {formSuccess && (
        <div className="success-bar">
          <CheckCircle size={20} />
          <span>Dados enviados com sucesso!</span>
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
          <legend>Informações do usuário</legend>
          <p>Forneça seu nome, endereço de e-mail e senha.</p>

          <input type="text" name="nome" placeholder="Digite seu primeiro nome" onChange={handleChange} required />
          <input type="text" name="sobrenome" placeholder="Digite seu sobrenome" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Digite seu endereço de e-mail" onChange={handleChange} required />
          <input type="tel" name="telefone" placeholder="Número de telefone" onChange={handleChange} required />
          <input type="password" name="senha" placeholder="Digite sua senha" onChange={handleChange} required />
          <input type="password" name="confirmarSenha" placeholder="Confirme sua senha" onChange={handleChange} required />
        </fieldset>

        <fieldset>
          <legend>Detalhes do veículo</legend>
          <p>Informe a marca, o modelo e o ano do seu veículo.</p>

          <input type="text" name="marca" placeholder="Toyota" onChange={handleChange} required />
          <input type="text" name="modelo" placeholder="Insira o modelo do seu veículo" onChange={handleChange} required />
          <input type="number" name="ano" placeholder="2020" onChange={handleChange} required />
          <input type="text" name="vin" placeholder="Insira o VIN do seu veículo" onChange={handleChange} required />
        </fieldset>

        <div className="register-buttons">
          <button type="button" onClick={handleCancel}>Cancela</button>
          <button type="submit" className="submit-btn">Enviar</button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;


