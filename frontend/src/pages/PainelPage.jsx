import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/PainelPage.css';
import { FaSearch, FaBell, FaUserCircle, FaMapMarkedAlt, FaCar, FaHistory, FaShieldAlt, FaExclamationTriangle, FaTruck, FaPhone, FaPowerOff, FaPaperPlane } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Ícones padrão do Leaflet
import defaultIconUrl from 'leaflet/dist/images/marker-icon.png';
import defaultIconShadowUrl from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: defaultIconUrl,
  shadowUrl: defaultIconShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// AQUI: Definimos o ícone padrão para todos os marcadores,
// a menos que especificado de outra forma.
L.Marker.prototype.options.icon = DefaultIcon;

// Não precisamos mais de uma definição específica para 'vehicleIcon'
// pois vamos usar DefaultIcon diretamente no Marker do veículo.

const center = [-8.839, -13.234]; // Centro padrão inicial
const zoom = 13;

// --- Componentes de Botões (mantidos como estavam) ---
const DesligarCarroButton = () => {
  const handleDesligarCarro = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/comando/desligar_carro', {
        method: 'POST',
      });
      if (response.ok) {
        alert('Comando para bloquear o carro enviado!');
        console.log('Comando para bloquear o carro enviado!');
      } else {
        alert('Erro ao enviar comando para bloquear o carro.');
        console.error('Erro ao enviar comando para bloquear o carro:', response.status);
      }
    } catch (error) {
      alert('Erro de rede ao enviar comando para bloquear o carro.');
      console.error('Erro de rede ao enviar comando para bloquear o carro:', error);
    }
  };

  return (
    <button onClick={handleDesligarCarro} className="logisticsButton desligar">
      <FaPowerOff /> Bloquear
    </button>
  );
};

const LigarCarroButton = () => {
  const handleLigarCarro = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/comando/ligar_carro', {
        method: 'POST',
      });
      if (response.ok) {
        alert('Comando para desbloquear o carro enviado!');
        console.log('Comando para desbloquear o carro enviado!');
      } else {
        alert('Erro ao enviar comando para desbloquear o carro.');
        console.error('Erro ao enviar comando para desbloquear o carro:', response.status);
      }
    } catch (error) {
      alert('Erro ao enviar comando para desbloquear o carro.');
      console.error('Erro ao enviar comando para desbloquear o carro:', error);
    }
  };

  return (
    <button onClick={handleLigarCarro} className="logisticsButton ligar">
      <FaPowerOff /> Desbloquear
    </button>
  );
};

const EnviarMensagemComponent = () => {
  const [mensagem, setMensagem] = useState('');
  const [numeroTelefone, setNumeroTelefone] = useState('');

  const handleMensagemChange = (event) => {
    setMensagem(event.target.value);
  };

  const handleNumeroTelefoneChange = (event) => {
    setNumeroTelefone(event.target.value);
  };

  const handleEnviarMensagem = async () => {
    if (mensagem && numeroTelefone) {
      try {
        const response = await fetch('http://localhost:8000/api/comando/enviar_mensagem', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mensagem, numeroTelefone }),
        });
        if (response.ok) {
          alert(`Mensagem "${mensagem}" enviada para ${numeroTelefone}!`);
          console.log(`Mensagem "${mensagem}" enviada para ${numeroTelefone}!`);
          setMensagem('');
          setNumeroTelefone('');
        } else {
          // --- BLOCO ATUALIZADO PARA EXIBIR ERROS DETALHADOS DO BACKEND ---
          let errorMessage = 'Erro desconhecido ao enviar mensagem.';
          try {
              const errorData = await response.json(); // Tenta ler a resposta de erro como JSON
              if (errorData && errorData.detail) {
                  // Mensagens de erro do FastAPI/Pydantic geralmente vêm em 'detail'
                  errorMessage = `Erro do servidor: ${errorData.detail}`;
              } else {
                  // Fallback se não houver 'detail' ou se não for JSON
                  errorMessage = `Erro do servidor: ${response.status} - ${response.statusText || 'Resposta desconhecida'}`;
              }
          } catch (e) {
              // Se a resposta de erro não for JSON (acontece com 400s mais genéricos)
              errorMessage = `Erro do servidor: ${response.status} - ${response.statusText || 'Resposta não JSON ou vazia'}`;
          }
          alert(errorMessage);
          console.error('Erro ao enviar mensagem:', response.status, errorMessage);
          // --- FIM DO BLOCO ATUALIZADO ---
        }
      } catch (error) {
        alert('Erro de rede ao enviar mensagem.');
        console.error('Erro de rede ao enviar mensagem:', error);
      }
    } else {
      alert('Por favor, digite o número de telefone e a mensagem.');
    }
  };

  return (
    <div className="enviarMensagemContainer">
      <div className="inputGroup">
        <label htmlFor="numeroTelefone">
          <FaPhone /> Número:
        </label>
        <input
          type="tel"
          id="numeroTelefone"
          value={numeroTelefone}
          onChange={handleNumeroTelefoneChange}
          placeholder="Ex: +2449xxxxxxx"
          className="logisticsInput"
        />
      </div>
      <div className="inputGroup">
        <label htmlFor="mensagem">
          <FaPaperPlane /> Mensagem:
        </label>
        <textarea
          id="mensagem"
          value={mensagem}
          onChange={handleMensagemChange}
          placeholder="Digite a mensagem"
          className="logisticsTextarea"
        />
      </div>
      <button onClick={handleEnviarMensagem} className="logisticsButton enviar">
        <FaPaperPlane /> Enviar
      </button>
    </div>
  );
};
// --- FIM dos Componentes de Botões ---

const PainelPage = () => {
  const [vehicleLocation, setVehicleLocation] = useState(null); 
  const [mapCenter, setMapCenter] = useState(center);
  const [totalVeiculos, setTotalVeiculos] = useState(0); 
  const [veiculosEmMovimento, setVeiculosEmMovimento] = useState(0);
  const [veiculosParados, setVeiculosParados] = useState(0);
  const [veiculosOffline, setVeiculosOffline] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchVehicleData = async () => {
      setIsUpdating(true); // Ativa o efeito de piscar

      try {
        const response = await fetch('http://localhost:8000/api/veiculo_localizacao_mais_recente'); 
        
        if (!response.ok) {
          throw new Error(`Erro HTTP! status: ${response.status}`);
        }
        const data = await response.json();

        if (data && data.latitude !== undefined && data.longitude !== undefined) {
          const latestLocation = {
            device_id: data.device_id || "Veículo Principal",
            latitude: parseFloat(data.latitude),
            longitude: parseFloat(data.longitude),
            status: data.status || "desconhecido", 
            hora: data.hora || 'N/A', 
            timestamp: new Date().toISOString() 
          };

          setVehicleLocation(latestLocation);
          setMapCenter([latestLocation.latitude, latestLocation.longitude]);

          setTotalVeiculos(1); 
          setVeiculosEmMovimento(latestLocation.status === "em_movimento" ? 1 : 0);
          setVeiculosParados(latestLocation.status === "parado" ? 1 : 0);
          setVeiculosOffline(0); 

        } else {
          console.warn("Nenhum dado de localização de veículo válido encontrado no backend.");
          setVehicleLocation(null);
          setTotalVeiculos(0);
          setVeiculosEmMovimento(0);
          setVeiculosParados(0);
          setVeiculosOffline(0);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do veículo:", error);
        setVehicleLocation(null);
      } finally {
        const timeout = setTimeout(() => setIsUpdating(false), 300);
        return () => clearTimeout(timeout);
      }
    };

    fetchVehicleData();
    const intervalId = setInterval(fetchVehicleData, 5000); 

    return () => {
      clearInterval(intervalId); 
    };
  }, []);

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
          </div>
          <div className="right-links">
            <FaSearch className="headerIcon" />
            <FaBell className="headerIcon" />
            <FaUserCircle className="headerIcon" />
          </div>
        </div>
      </header>

      <div className="dashboardLayout">
        <aside className="sidebar">
          <Link to="/painel" className="sidebarItem active">
            <FaMapMarkedAlt className="sidebarIcon" />
            Mapa Em Tempo Real
          </Link>
          <Link to="/veiculos" className="sidebarItem">
            <FaCar className="sidebarIcon" />
            Veículo
          </Link>
          <Link to="/historico" className="sidebarItem">
            <FaHistory className="sidebarIcon" />
            Histórico De Rotas
          </Link>
          <Link to="/zonas" className="sidebarItem">
            <FaShieldAlt className="sidebarIcon" />
            Zonas Seguras
          </Link>
          <Link to="/alertas" className="sidebarItem">
            <FaExclamationTriangle className="sidebarIcon" />
            Alertas
          </Link>
          <Link to="/logistica" className="sidebarItem">
            <FaTruck className="sidebarIcon" />
            Logística e Transport
          </Link>
        </aside>

        <main className="mainContent">
          <div className="dashboardOverview">
            <div className="overviewCard">
              <FaCar className="overviewIcon" />
              <h3>Total de Veículos</h3>
              <p>{totalVeiculos}</p>
            </div>
            <div className="overviewCard">
              <FaCar className="overviewIcon" />
              <h3>Em Movimento</h3>
              <p>{veiculosEmMovimento}</p>
            </div>
            <div className="overviewCard">
              <FaCar className="overviewIcon" />
              <h3>Parados</h3>
              <p>{veiculosParados}</p>
            </div>
            <div className="overviewCard">
              <FaCar className="overviewIcon" />
              <h3>Offline</h3>
              <p>{veiculosOffline}</p>
            </div>
          </div>

          <div className="dashboardContent">
            <div className="mapContainer">
              <MapContainer center={mapCenter} zoom={zoom} style={{ width: '100%', height: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {vehicleLocation && ( 
                  <Marker
                    key={vehicleLocation.device_id}
                    position={[vehicleLocation.latitude, vehicleLocation.longitude]}
                    icon={DefaultIcon} // <-- USANDO O ÍCONE PADRÃO DO LEAFLET AQUI
                  >
                    <Popup>
                      Dispositivo: {vehicleLocation.device_id} <br />
                      Lat: {vehicleLocation.latitude.toFixed(6)}, Lng: {vehicleLocation.longitude.toFixed(6)} <br />
                      Status: {vehicleLocation.status} <br />
                      Hora: {vehicleLocation.hora} 
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
            <div className="sidebarRight">
              <div className={`sidebarSection locationSection ${isUpdating ? 'gps-active' : ''}`}>
                <h3>Localização do GPS</h3>
                <div className="locationInfo">
                  {vehicleLocation ? (
                    <>
                      <p><span>Dispositivo:</span> <span className="gps-data">{vehicleLocation.device_id}</span></p>
                      <p><span>Longitude:</span> <span className="gps-data">{vehicleLocation.longitude.toFixed(6)}</span></p>
                      <p><span>Latitude:</span> <span className="gps-data">{vehicleLocation.latitude.toFixed(6)}</span></p>
                      <p><span>Hora:</span> <span className="gps-data">{vehicleLocation.hora}</span></p> 
                    </>
                  ) : (
                    <p>Obtendo localização do veículo...</p>
                  )}
                </div>
              </div>
              <div className="sidebarSection logisticsSection">
                <h3 className="logisticsTitle">Controles do Carro</h3>
                <div className="logisticsControls">
                  <DesligarCarroButton />
                  <LigarCarroButton />
                </div>
                <h3 className="logisticsTitle">Notificar por Mensagem</h3>
                <EnviarMensagemComponent />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PainelPage;