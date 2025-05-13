import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/PainelPage.css'; // Ajuste o caminho conforme necessário
import { FaSearch, FaBell, FaUserCircle, FaMapMarkedAlt, FaCar, FaHistory, FaShieldAlt, FaExclamationTriangle, FaTruck } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const center = [-8.839, -13.234]; // Centro inicial do mapa (Luanda)
const zoom = 13; // Nível de zoom inicial

const PainelPage = () => {
  const [vehicleLocations, setVehicleLocations] = useState([]);
  const [mapCenter, setMapCenter] = useState(center);

  useEffect(() => {
    const fetchVehicleLocations = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/vehicles/locations'); // Use a URL do seu backend
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setVehicleLocations(data);

        // Se houver alguma localização, centralize o mapa no primeiro veículo (pode ajustar isso)
        if (data.length > 0) {
          // Encontre a localização do Arduino (ou outro veículo principal)
          const arduinoLocation = data.find(loc => loc.device_id === 'ARDUINO_SERIAL');
          if (arduinoLocation) {
            setMapCenter([arduinoLocation.latitude, arduinoLocation.longitude]);
          } else {
            // Se não encontrar o Arduino, use a primeira localização disponível
            setMapCenter([data[0].latitude, data[0].longitude]);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar localizações:', error);
      }
    };

    fetchVehicleLocations();

    // Opcional: Atualizar as localizações periodicamente
    const intervalId = setInterval(fetchVehicleLocations, 5000); // Buscar a cada 5 segundos
    return () => clearInterval(intervalId); // Limpar o intervalo ao desmontar o componente
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
              <p>10</p>
            </div>
            <div className="overviewCard">
              <FaCar className="overviewIcon" />
              <h3>Em Movimento</h3>
              <p>6</p>
            </div>
            <div className="overviewCard">
              <FaCar className="overviewIcon" />
              <h3>Parados</h3>
              <p>3</p>
            </div>
            <div className="overviewCard">
              <FaCar className="overviewIcon" />
              <h3>Offline</h3>
              <p>1</p>
            </div>
          </div>

          <div className="dashboardContent">
            <div className="mapContainer">
              <MapContainer center={mapCenter} zoom={zoom} style={{ width: '100%', height: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {vehicleLocations.map(vehicle => (
                  <Marker key={vehicle.device_id} position={[vehicle.latitude, vehicle.longitude]}>
                    <Popup>
                      Dispositivo: {vehicle.device_id} <br />
                      Lat: {vehicle.latitude}, Lng: {vehicle.longitude}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
            <div className="sidebarRight">
              <div className="sidebarSection locationSection">
                <h3>Localização</h3>
                <div className="locationInfo">
                  <p><span>Última Coordenada (IMEI):</span> 123456789012345</p>
                  <p><span>Longitude:</span> -8.839</p>
                  <p><span>Latitude:</span> -13.234</p>
                </div>
              </div>
              <div className="sidebarSection logisticsSection">
                <h3>Logística e Transport</h3>
                <div className="logisticsInfo">
                  <p>Informação de logística...</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PainelPage;