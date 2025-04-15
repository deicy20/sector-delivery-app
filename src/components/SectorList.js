import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import { getDistance } from "geolib";

const SectorList = () => {
  const [sectors, setSectors] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [showAvailableSectors, setShowAvailableSectors] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "sectors"), (snapshot) => {
      const sectorData = snapshot.docs.map((doc) => {
        const data = doc.data();
        const coords = data.coordenadas || { lat: 0, lng: 0 };
        return {
          id: doc.id,
          ...data,
          coordenadas: {
            lat: coords.lat,
            lng: coords.lng,
          },
        };
      });
      setSectors(sectorData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error al obtener la ubicación del usuario:", error);
        }
      );
    } else {
      console.error("La geolocalización no está disponible en este navegador.");
    }
  }, []);

  const isWithin5Km = (sectorLocation) => {
    if (!userLocation) return false;

    const distance = getDistance(userLocation, sectorLocation) / 1000;
    return distance <= 5;
  };

  const checkIfInWorkingHours = (horarios) => {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const currentTime = currentDate.getHours() * 60 + currentDate.getMinutes();

    const daysMap = [
      "domingo",
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
    ];
    const today = daysMap[currentDay];
    const todaysHours = horarios[today];

    if (!todaysHours) return false;

    if (todaysHours.cerrado === true) return false;

    const { desde, hasta } = todaysHours;
    const [startHour, startMinute] = desde.split(":").map(Number);
    const [endHour, endMinute] = hasta.split(":").map(Number);

    const openingTime = startHour * 60 + startMinute;
    const closingTime = endHour * 60 + endMinute;

    return currentTime >= openingTime && currentTime <= closingTime;
  };

  const filteredSectors = sectors.filter((sector) => {
    const dentroDeZona = isWithin5Km(sector.coordenadas);
    const dentroDeHorario = checkIfInWorkingHours(sector.horarios);
    return dentroDeZona && dentroDeHorario;
  });

  const handleToggle = () => {
    setShowAvailableSectors(!showAvailableSectors);
  };

  const sectorsToDisplay = showAvailableSectors ? filteredSectors : sectors;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold mb-4">
        {showAvailableSectors ? "Sectores Disponibles" : "Todos los Sectores"}
      </h2>
      <button
        onClick={handleToggle}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-6 hover:bg-blue-700 transition duration-300"
      >
        {showAvailableSectors
          ? "Ver todos los sectores"
          : "Ver solo sectores disponibles"}
      </button>

      {sectorsToDisplay.length === 0 ? (
        <p className="text-xl text-center text-gray-500">
          No hay sectores disponibles en este momento.
        </p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full table-auto text-left text-gray-800">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-6 py-3 font-semibold">Nombre</th>
                <th className="px-6 py-3 font-semibold">Dirección</th>
              </tr>
            </thead>
            <tbody>
              {sectorsToDisplay.map((sector) => (
                <tr key={sector.id} className="border-b">
                  <td className="px-6 py-3">{sector.nombre}</td>
                  <td className="px-6 py-3">{sector.direccion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SectorList;
