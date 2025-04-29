import React from 'react';
import { Link } from 'react-router-dom'; // Importa Link para navegação SPA
import { FaMapMarkerAlt, FaShieldAlt, FaCogs } from 'react-icons/fa';
import { motion } from 'framer-motion';
import '../styles/HomePage.css';

const HomePage = () => {
  return (
    <div>
      {/* Cabeçalho */}
      <header className="header">
        <div className="navbar">
          <h1>Sistema De Monitoramento GPS</h1>

          <div className="nav-links">
            <div className="left-links">
              <a href="#">Home</a>
              <a href="#">Painel</a>
              <a href="#">Rastreamento de veículos</a>
              <a href="#">Alertas e notificações</a>
            </div>

            <Link to="/login">
              <button className="login-btn">Entrar</button>
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <div className="hero">
          <h2>Acompanhe O Seu Veículo 24 HORAS Por Dia</h2>
          <p>Rastreie e gerencie sua frota com eficiência</p>
          <Link to="/register">
  <button className="register-btn">Registrar-se</button>
</Link>

        </div>
      </header>

      {/* Features com animações */}
      <section className="features">
        <motion.div 
          className="feature"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FaMapMarkerAlt className="feature-icon" />
          <h3>Rastreamento em tempo real</h3>
          <p>Acompanhe seu veículo a qualquer momento.</p>
        </motion.div>

        <motion.div 
          className="feature"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <FaShieldAlt className="feature-icon" />
          <h3>Maior Segurança e Proteção</h3>
          <p>Proteja sua frota contra roubos e perdas.</p>
        </motion.div>

        <motion.div 
          className="feature"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <FaCogs className="feature-icon" />
          <h3>Eficiência operacional aprimorada</h3>
          <p>Gerencie sua frota de forma inteligente.</p>
        </motion.div>
      </section>

      {/* Seção de Equipe */}
      <section className="developer-team">
        <h2>EQUIPE DE DESENVOLVIMENTO</h2>
        <div className="developer-card">
          <img src="/assets/developer-photo.jpg" alt="Foto do desenvolvedor" />
          <p>Nome: Albino Nzaba Ernesto Zamba</p>
          <p>Estudante de Ciências de Computação</p>
        </div>
      </section>

      {/* Rodapé */}
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

