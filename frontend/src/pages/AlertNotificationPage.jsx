import React, { useState } from 'react';
import '../styles/AlertNotificationPage.css'; // Importa o arquivo de estilos
import { FaSearch, FaBell, FaUserCircle } from 'react-icons/fa'; // Importação dos ícones
import { Link } from 'react-router-dom'; // Importa Link para navegação

const AlertNotificationPage = () => {
  const [cercaGeograficaAtiva, setCercaGeograficaAtiva] = useState(false);
  const [raioCerca, setRaioCerca] = useState('');
  const [notificacaoCercaEmailSMSAtiva, setNotificacaoCercaEmailSMSAtiva] = useState(false);

  const [alertaVelocidadeAtivo, setAlertaVelocidadeAtivo] = useState(false);
  const [velocidadeLimite, setVelocidadeLimite] = useState('');
  const [notificacaoVelocidadeEmailSMSAtiva, setNotificacaoVelocidadeEmailSMSAtiva] = useState(false);

  const handleSalvarAlerta = () => {
    // Aqui você implementaria a lógica para salvar os alertas
    console.log('Alertas salvos!');
  };

  return (
    <div className="alertNotificationPageContainer">
      <header className="header">
        <div className="navbar">
          <h1>Sistema De Monitoramento GPS</h1>
          <div className="nav-links">
            <div className="left-links">
              <Link to="/">Home</Link>
              <Link to="/painel">Painel</Link>
              <Link to="/rastreamento">Rastreamento de veículos</Link>
              <Link to="/alertas" className="active">Alertas e notificações</Link>
            </div>
            <div className="right-links">
              <FaSearch className="headerIcon" />
              <FaBell className="headerIcon" />
              <FaUserCircle className="headerIcon" />
            </div>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="alertCreationSection">
          <h2>Crie alertas de veículos</h2>
          <div className="alertSection">
            <h3 className="sectionTitle">Alertas De Cerca Geográfica</h3>
            <div className="switchRow">
              <p>Alertas De Cerca Geográfica</p>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={cercaGeograficaAtiva}
                  onChange={(e) => setCercaGeograficaAtiva(e.target.checked)}
                />
                <span className="slider round"></span>
              </label>
            </div>
            {cercaGeograficaAtiva && (
              <div>
                <div className="inputGroup"> {/* Novo grupo para label e input */}
                  <p>Raio da cerca geográfica</p>
                  <div className="inputUnit">
                    <input
                      type="number"
                      className="input short" 
                      value={raioCerca}
                      onChange={(e) => setRaioCerca(e.target.value)}
                    />
                    <p className="unit">metros</p>
                  </div>
                </div>
                <div className="switchRow">
                  <p>Notificações por e-mail/SMS</p>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={notificacaoCercaEmailSMSAtiva}
                      onChange={(e) => setNotificacaoCercaEmailSMSAtiva(e.target.checked)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="alertSection">
            <h3 className="sectionTitle">Alerta De Velocidade</h3>
            <div className="switchRow">
              <p>Alerta De Velocidade</p>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={alertaVelocidadeAtivo}
                  onChange={(e) => setAlertaVelocidadeAtivo(e.target.checked)}
                />
                <span className="slider round"></span>
              </label>
            </div>
            {alertaVelocidadeAtivo && (
              <div>
                <div className="inputGroup"> {/* Novo grupo para label e input */}
                  <p>Velocidade limite</p>
                  <div className="inputUnit">
                    <input
                      type="number"
                      className="input short"
                      value={velocidadeLimite}
                      onChange={(e) => setVelocidadeLimite(e.target.value)}
                    />
                    <p className="unit">km/h</p>
                  </div>
                </div>
                <div className="switchRow">
                  <p>Notificações por e-mail/SMS</p>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={notificacaoVelocidadeEmailSMSAtiva}
                      onChange={(e) => setNotificacaoVelocidadeEmailSMSAtiva(e.target.checked)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
            )}
          </div>

          <button className="saveButton" onClick={handleSalvarAlerta}>SALVAR ALERTA</button>
        </div>

        <div className="mapContainer">
          {/* A imagem agora é um background no CSS */}
        </div>

        <div className="activeAlertsSection">
          <h3 className="sectionTitle">Alertas Ativos</h3>
          <div className="activeAlertsGrid"> {/* Novo container para os alertas ativos */}
            <div className="activeAlertCard">
              <h4 className="alertTitle">Alerta do motor</h4>
              <p>Alta temperatura do motor detectada</p>
              <p>2 horas atrás</p>
            </div>
            <div className="activeAlertCard">
              <h4 className="alertTitle">Alerta de roubo</h4>
              <p>Tentativa de roubo, na muamba</p>
              <p>3 horas atrás</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Text = (props) => <p>{props.children}</p>;
const Switch = ({ value, onValueChange }) => (
  <label className="switch">
    <input type="checkbox" checked={value} onChange={(e) => onValueChange(e.target.checked)} />
    <span className="slider round"></span>
  </label>
);

export default AlertNotificationPage;