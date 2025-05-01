import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/PainelPage.css'; // Importe o arquivo de estilos
import { FaSearch, FaBell, FaUserCircle } from 'react-icons/fa'; // Importe os ícones

const PainelPage = () => {
  return (
    <div className="painelPageContainer">
      <header className="header">
        <div className="navbar">
          <h1>Sistema De Monitoramento GPS</h1>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/painel" className="active">Painel</Link>
            <Link to="/rastreamento">Rastreamento de veículos</Link>
            <Link to="/alertas">Alertas e notificações</Link>
            {/* <button className="login-btn">Entrar</button> Você pode adicionar o botão de login se necessário */}
          </div>
          <div className="right-links">
            <FaSearch className="headerIcon" />
            <FaBell className="headerIcon" />
            <FaUserCircle className="headerIcon" />
          </div>
        </div>
      </header>

      <main className="mainContent">
        <div className="dashboardOverview">
          <div className="overviewCard">
            <h3>Total de Veículos</h3>
            <p>10</p>
          </div>
          <div className="overviewCard">
            <h3>Em Movimento</h3>
            <p>6</p>
          </div>
          <div className="overviewCard">
            <h3>Parados</h3>
            <p>3</p>
          </div>
          <div className="overviewCard">
            <h3>Offline</h3>
            <p>1</p>
          </div>
        </div>

        <div className="dashboardContent">
          <div className="mapContainer">
            {/* Aqui você pode integrar um componente de mapa interativo */}
            <img src="../assets/map_placeholder_large.png" alt="Mapa em Tempo Real" className="mapImage" />
          </div>
          <div className="sidebar">
            <div className="sidebarSection">
              <h3>Localização</h3>
              <div className="locationInfo">
                <p><span>Última Coordenada (IMEI):</span> 123456789012345</p>
                <p><span>Longitude:</span> -8.839</p>
                <p><span>Latitude:</span> -13.234</p>
              </div>
            </div>
            <div className="sidebarSection">
              <h3>Logística e Transport</h3>
              <div className="logisticsInfo">
                {/* Adicione informações relevantes sobre logística e transporte aqui */}
                <p>Informação de logística...</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PainelPage;