// src/pages/HomePage.jsx
import React from 'react';
import '../styles/HomePage.css'; // Depois criamos o CSS

const HomePage = () => {
  return (
    <div>
      <header className="header">
        <div className="navbar">
          <h1>Sistema De Monitoramento GPS</h1>
          <div className="nav-links">
            <a href="#">Home</a>
            <a href="#">Sobre</a>
            <a href="#">Serviços</a>
            <a href="#">Contactos</a>
            <button className="login-btn">Acessar</button>
          </div>
        </div>
        <div className="hero">
          <h2>Acompanhe O Seu Veículo 24 HORAS Por Dia</h2>
          <p>Rastreie e gerencie sua frota com eficiência</p>
          <button className="register-btn">Registrar-se</button>
        </div>
      </header>

      <section className="features">
        <div className="feature">
          <h3>Rastreamento em tempo real</h3>
          <p>Acompanhe seu veículo a qualquer momento.</p>
        </div>
        <div className="feature">
          <h3>Maior Segurança e Proteção</h3>
          <p>Proteja sua frota contra roubos e perdas.</p>
        </div>
        <div className="feature">
          <h3>Eficiência operacional aprimorada</h3>
          <p>Gerencie sua frota de forma inteligente.</p>
        </div>
      </section>

      <section className="developer-team">
        <h2>EQUIPE DE DESENVOLVIMENTO</h2>
        <div className="developer-card">
          <img src="../assets/developer-photo.jpg" alt="Foto do desenvolvedor" />
          <p>Nome: Albino Nzaba Ernesto Zamba</p>
          <p>Estudante de Ciências de Computação</p>
        </div>
      </section>

      <footer className="footer">
        <div className="newsletter">
          <h3>Assine nosso newsletter para receber mais informações</h3>
          <input type="email" placeholder="Digite seu email" />
          <button>Subscrever</button>
        </div>
        <div className="footer-links">
          <a href="#">Sobre</a>
          <a href="#">Serviços</a>
          <a href="#">Contactos</a>
          <a href="#">Termos</a>
        </div>
        <p>© 2025 Sistema De Monitoramento GPS</p>
      </footer>
    </div>
  );
};

export default HomePage;
