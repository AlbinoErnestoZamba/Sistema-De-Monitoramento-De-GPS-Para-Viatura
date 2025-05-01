import React, { useState, useEffect } from 'react';
import './HomePage.css'; // Importe seu arquivo de estilos da HomePage
import { Link } from 'react-router-dom';
import { FaCar, FaMapMarkerAlt, FaBell } from 'react-icons/fa'; // Importe os ícones que você usa

const HomePage = () => {
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    // Simula um carregamento da página
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 500); // Ajuste o tempo conforme necessário

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="homePageContainer">
      <header className="header">
        <div className="navbar">
          <h1>Sistema De Monitoramento GPS</h1>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/painel">Painel</Link>
            <Link to="/rastreamento">Rastreamento de veículos</Link>
            <Link to="/alertas">Alertas e notificações</Link>
            <button className="login-btn">Entrar</button>
          </div>
        </div>
      </header>

      <main className="mainContent">
        <section className={`hero ${pageLoaded ? 'loaded' : ''}`} style={{ opacity: pageLoaded ? 1 : 0, transition: 'opacity 1s ease-in-out' }}>
          <h2>Monitore Seus Veículos em Tempo Real</h2>
          <p>Acompanhe a localização, receba alertas e otimize a gestão da sua frota.</p>
          <button className="register-btn">Cadastre-se Grátis</button>
        </section>

        <section className={`features ${pageLoaded ? 'loaded' : ''}`} style={{ opacity: pageLoaded ? 1 : 0, transition: 'opacity 1s ease-in-out' }}>
          <div className="feature">
            <FaCar className="feature-icon" />
            <h3>Rastreamento Preciso</h3>
            <p>Localização em tempo real com alta precisão.</p>
          </div>
          <div className="feature">
            <FaMapMarkerAlt className="feature-icon" />
            <h3>Cercas Geográficas</h3>
            <p>Defina áreas e receba alertas de entrada e saída.</p>
          </div>
          <div className="feature">
            <FaBell className="feature-icon" />
            <h3>Alertas Inteligentes</h3>
            <p>Notificações personalizadas para eventos importantes.</p>
          </div>
        </section>

        <section className="developer-team">
          <h2>Equipe de Desenvolvimento</h2>
          <div className="developer-card">
            <img src="../assets/dev1.jpg" alt="Desenvolvedor 1" />
            <p>Nome do Desenvolvedor 1</p>
          </div>
          <div className="developer-card">
            <img src="../assets/dev2.jpg" alt="Desenvolvedor 2" />
            <p>Nome do Desenvolvedor 2</p>
          </div>
          {/* Adicione mais membros da equipe conforme necessário */}
        </section>
      </main>

      <footer className="footer">
        <div className="newsletter">
          <h3>Assine nossa Newsletter</h3>
          <input type="email" placeholder="Seu e-mail" />
          <button>Assinar</button>
        </div>
        <div className="footer-links">
          <Link to="/">Início</Link>
          <Link to="/painel">Painel</Link>
          <Link to="/sobre">Sobre Nós</Link>
          <Link to="/contato">Contato</Link>
        </div>
        <p>&copy; 2023 Sistema de Monitoramento GPS. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default HomePage;