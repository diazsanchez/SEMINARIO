import { useState } from "react";
import "./tienda.css"; // CSS separado para estilos

export default function Tienda() {
  const [avatares, setAvatares] = useState([
    { id: 1, nombre: "Avatar Ninja", precio: 100, imagen: "/avatars/ninja.png" },
    { id: 2, nombre: "Avatar Pirata", precio: 150, imagen: "/avatars/pirata.png" },
    { id: 3, nombre: "Avatar Robot", precio: 200, imagen: "/avatars/robot.png" },
    { id: 4, nombre: "Avatar Mago", precio: 180, imagen: "/avatars/mago.png" },
  ]);

  const comprarAvatar = (avatar) => {
    alert(`Has comprado: ${avatar.nombre} por ${avatar.precio} monedas`);
    // Aquí podrías integrar lógica de pago o descontar monedas del usuario
  };

  return (
    <div className="tienda-container">
      <h2>Tienda de Avatares</h2>
      <div className="tienda-grid">
        {avatares.map((avatar) => (
          <div key={avatar.id} className="tienda-card">
            <img src={avatar.imagen} alt={avatar.nombre} className="tienda-avatar" />
            <h3>{avatar.nombre}</h3>
            <p>{avatar.precio} monedas</p>
            <button onClick={() => comprarAvatar(avatar)}>Comprar</button>
          </div>
        ))}
      </div>
    </div>
  );
}
