import React, { useState } from 'react';

const AlertPage = () => {
  const [geoFence, setGeoFence] = useState(false);
  const [geoNotification, setGeoNotification] = useState(false);
  const [speedAlert, setSpeedAlert] = useState(false);
  const [speedNotification, setSpeedNotification] = useState(false);
  const [geoRadius, setGeoRadius] = useState(500);
  const [speedLimit, setSpeedLimit] = useState(80);

  return (
    <div className="p-6 md:p-10">
      <h2 className="text-2xl font-semibold mb-4">Crie alertas de veículos</h2>

      {/* Cerca Geográfica */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Alertas De cerca Geográfica</h3>
          <input
            type="checkbox"
            checked={geoFence}
            onChange={() => setGeoFence(!geoFence)}
            className="toggle"
          />
        </div>
        <div className="mt-2 flex items-center gap-2">
          <label htmlFor="radius">Raio da cerca geográfica</label>
          <input
            type="number"
            id="radius"
            value={geoRadius}
            onChange={(e) => setGeoRadius(e.target.value)}
            className="border px-2 py-1 w-24 rounded"
          />
          <span>metros</span>
        </div>
        <div className="mt-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={geoNotification}
              onChange={() => setGeoNotification(!geoNotification)}
              className="toggle"
            />
            Notificações por e-mail/SMS
          </label>
        </div>
      </div>

      {/* Alerta de Velocidade */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Alerta De Velocidade</h3>
          <input
            type="checkbox"
            checked={speedAlert}
            onChange={() => setSpeedAlert(!speedAlert)}
            className="toggle"
          />
        </div>
        <div className="mt-2 flex items-center gap-2">
          <label htmlFor="speed">Velocidade limite</label>
          <input
            type="number"
            id="speed"
            value={speedLimit}
            onChange={(e) => setSpeedLimit(e.target.value)}
            className="border px-2 py-1 w-24 rounded"
          />
          <span>km/h</span>
        </div>
        <div className="mt-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={speedNotification}
              onChange={() => setSpeedNotification(!speedNotification)}
              className="toggle"
            />
            Notificações por e-mail/SMS
          </label>
        </div>
      </div>

      {/* Botões */}
      <div className="mb-10">
        <button className="bg-purple-700 hover:bg-purple-800 text-white font-medium py-2 px-6 rounded">
          SALVA ALERTA
        </button>
        <span className="ml-4 text-purple-600 cursor-pointer">CANCELAR</span>
      </div>

      {/* Alerta Recente com imagem */}
      <div className="grid md:grid-cols-2 gap-6">
        <img
          src="/assets/mapa-alerta.png"
          alt="Mapa"
          className="rounded-xl shadow"
        />
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold">Alerta do motor</h4>
            <p className="text-gray-600 text-sm">Alta temperatura do motor detectada.</p>
            <p className="text-xs text-gray-400">2 horas atrás</p>
          </div>
          <div>
            <h4 className="font-semibold">Alerta de roubo</h4>
            <p className="text-gray-600 text-sm">Tentativa de roubo, na mutamba</p>
            <p className="text-xs text-gray-400">3 horas atrás</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertPage;
