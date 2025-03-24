import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./trainmap.css";

const API_URL = "https://rata.digitraffic.fi/api/v1/train-locations/latest/";

const TrainMap = () => {
  const [trains, setTrains] = useState([]);
  const [mapPosition, setMapPosition] = useState({ center: [60.1695, 24.9354], zoom: 6 });
  const [selectedRegion, setSelectedRegion] = useState("All");

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        if (Array.isArray(data)) {
          setTrains(data);
        } else {
          console.error("Unexpected API response:", data);
          setTrains([]);
        }
      } catch (error) {
        console.error("Error fetching train data:", error);
        setTrains([]);
      }
    };

    fetchTrains();
    const interval = setInterval(fetchTrains, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      <TopBar />
      <div className="main-content">
        <Sidebar trains={trains} selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} />
        <MapContainer
          center={mapPosition.center}
          zoom={mapPosition.zoom}
          className="map-container"
          whenCreated={(map) => {
            map.on('moveend', () => {
              setMapPosition({ center: map.getCenter(), zoom: map.getZoom() });
            });
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <TrainMarkers trains={trains} />
        </MapContainer>
      </div>
    </div>
  );
};

const TopBar = () => (
  <div className="topbar">
    <h1>Train Tracker</h1>
    <p>by Niko Rautio</p>
  </div>
);

const regions = ["All", "Uusimaa", "Pirkanmaa", "Central Finland", "Northern Ostrobothnia", "Lapland", "Other"];

const getRegion = (lat, lon) => {
  if (lat > 59.8 && lat < 60.5 && lon > 24.4 && lon < 25.5) return "Uusimaa";
  if (lat > 60.5 && lat < 61.7 && lon > 23.5 && lon < 24.5) return "Pirkanmaa";
  if (lat > 61.7 && lat < 63.0 && lon > 25.0 && lon < 27.0) return "Central Finland";
  if (lat > 63.0 && lat < 66.0 && lon > 25.0 && lon < 30.0) return "Northern Ostrobothnia";
  if (lat > 66.0) return "Lapland";
  return "Other";
};

const Sidebar = ({ trains, selectedRegion, setSelectedRegion }) => {
  const sortedTrains = [...trains].sort((a, b) => (b.speed || 0) - (a.speed || 0));

  return (
    <div className="sidebar dark-theme">
      <h2>Active Trains</h2>
      <label>Select Region: </label>
      <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
        {regions.map((region) => (
          <option key={region} value={region}>{region}</option>
        ))}
      </select>
      {selectedRegion === "All" ? (
        <ul>
          {sortedTrains.map((train, index) => (
            <li key={index}>
              <b>Train {train.trainNumber}</b> → {train.speed} km/h {train.heading}
            </li>
          ))}
        </ul>
      ) : (
        <ul>
          {sortedTrains.filter(train => getRegion(train.location.coordinates[1], train.location.coordinates[0]) === selectedRegion).map((train, index) => (
            <li key={index}>
              <b>Train {train.trainNumber}</b> → {train.speed} km/h {train.heading}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};



const TrainMarkers = ({ trains }) => (
  <>
    {trains.map((train, index) =>
      train.location && train.location.coordinates ? (
        <Marker
          key={index}
          position={[train.location.coordinates[1], train.location.coordinates[0]]}
          icon={getTrainIcon(train.speed || 0, train.heading || 0)}
        >
          <Popup>
            <div className="popup-content">
              <h3>Train {train.trainNumber}</h3>
              <p><b>Speed:</b> {train.speed || "N/A"} km/h</p>
              <p><b>Heading:</b> {train.heading || "N/A"}</p>
            </div>
          </Popup>
        </Marker>
      ) : null
    )}
  </>
);

const getTrainIcon = (speed = 0) => {
  const color = speed > 120 ? "red" : "green";
  const iconUrl = createPinpointSVG(color);

  return L.icon({
    iconUrl: iconUrl,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  });
};

const createPinpointSVG = (color) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50">
      <path fill="${color}" stroke="black" stroke-width="2" d="M20,2 C10,2 2,10 2,20 C2,30 20,48 20,48 C20,48 38,30 38,20 C38,10 30,2 20,2 Z"/>
      <circle cx="20" cy="20" r="8" fill="white"/>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export default TrainMap;
