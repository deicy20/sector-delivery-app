import React from "react";

const SectorItem = ({ sector }) => {
  return (
    <tr>
      <td>{sector.nombre}</td>
      <td>{`${sector.coordenadas.lat}, ${sector.coordenadas.lng}`}</td>
      <td>
        {Object.keys(sector.horarios).map((dia) => (
          <div key={dia}>
            <strong>{dia.charAt(0).toUpperCase() + dia.slice(1)}:</strong>{" "}
            {sector.horarios[dia].join(" - ")}
          </div>
        ))}
      </td>
    </tr>
  );
};

export default SectorItem;
