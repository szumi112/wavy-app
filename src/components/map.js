import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useSelector } from "react-redux";

function Leaflet() {
  const savedApiData = useSelector((state) => state.api);
  const bigAPIkey =
    "AmEegwsAf3xKvAG75QCdBaNgVMImZ1tse-uXa5Z2LbS8ZwioZUfBw6m7G-Z5zvU1";
  const [infoFromApi, setInfoFromApi] = useState([]);

  useEffect(() => {
    async function fetchLatLng() {
      for (let i = 0; i < savedApiData.data.length; i++) {
        const address = savedApiData.data[i].Address;
        try {
          const res = await axios.get(
            `https://dev.virtualearth.net/REST/v1/Locations?q=${address}&key=${bigAPIkey}`
          );
          const lat =
            res.data.resourceSets[0].resources[0].point.coordinates[0];
          const lng =
            res.data.resourceSets[0].resources[0].point.coordinates[1];
          setInfoFromApi((prev) => [
            ...prev,
            { ...savedApiData.data[i], Latitude: lat, Longitude: lng },
          ]);
        } catch (err) {
          console.error(err);
        }
      }
    }
    fetchLatLng();
  }, [savedApiData.data]);

  return (
    <>
      <h3>Wykres lokalizacji wyszukanych przez inwestorów</h3>
      <div className="mapMargin">
        <MapContainer center={[52.13, 21.01]} zoom={6} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {infoFromApi.map((data, index) => (
            <Marker key={index} position={[data.Latitude, data.Longitude]}>
              <Popup>{data.Address}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </>
  );
}

export default Leaflet;
