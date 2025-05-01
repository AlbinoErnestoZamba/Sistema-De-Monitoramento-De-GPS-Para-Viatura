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
         {/* <div className="logo_mucune"></div> */}
          {/* Logo do sistema */}
          <h1>Sistema De Monitoramento GPS</h1>

          <div className="nav-links">
            <div className="left-links">
            <Link to="/">Home</Link> {/* ⬅️ Link para a homepage */}
            <Link to="/painel" className="active">Painel</Link>
              <a href="#">Rastreamento de veículos</a>
              <Link to="/alertas">Alertas e notificações</Link>
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
     {/* Equipe de Desenvolvimento */}
<section className="developer-team">
  <h2>Nossa Equipe de Desenvolvimento</h2>
  <div className="developer-card">
    <img src="../assets/dev1.jpg" alt="Dev 1" />
    <p>Garcia Gaspa<br />Frontend Developer</p>
  </div>
  <div className="developer-card">
    <img src="../assets/dev2.jpg" alt="Dev 2" />
    <p>João Silva<br />Backend Developer</p>
  </div>
  <div className="developer-card">
    <img src="../assets/dev3.jpg" alt="Dev 3" />
    <p>Ana Sousa<br />UI/UX Designer</p>
  </div>
</section>

      {/* Rodapé */}
<footer className="footer">
  <div className="newsletter">
    <p>Receba novidades por e-mail:</p>
    <input type="email" placeholder="Digite seu e-mail" />
    <button>Inscrever-se</button>
  </div>
  <div className="footer-links">
    <a href="#">Política de Privacidade</a>
    <a href="#">Termos de Uso</a>
    <a href="#">Ajuda</a>
  </div>
  <p>&copy; {new Date().getFullYear()} Sistema de Monitoramento GPS. Todos os direitos reservados.</p>
</footer>

    </div>
  );
};

export default HomePage;

