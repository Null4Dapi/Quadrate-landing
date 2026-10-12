import React from "react";

/**
 * Componente funcional de saludo personalizado para el usuario de la plataforma.
 * Recibe datos por medio de props y muestra el contexto del conductor en sesión.
 *
 * @param {Object} props
 * @param {string} props.nombreUsuario - Nombre del conductor o administrador
 * @param {string} props.rolUsuario - Rol del perfil (ej. "Conductor Verificado")
 * @param {number} props.totalCocheras - Total de playas activas sincronizadas
 * @param {string} props.tiempoActivo - Tiempo formateado de la sesión activa
 * @returns {JSX.Element}
 */
export function SaludoUsuario({
  nombreUsuario = "Conductor",
  rolUsuario = "Conductor Verificado",
  totalCocheras = 0,
  tiempoActivo = "00:00",
}) {
  return (
    <article className="quadrate-live__saludo">
      <div className="quadrate-live__saludo-avatar" aria-hidden="true">
        <span className="quadrate-live__saludo-inicial">
          {nombreUsuario.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="quadrate-live__saludo-meta">
        <div className="quadrate-live__saludo-header">
          <h3 className="quadrate-live__saludo-nombre">
            ¡Hola, {nombreUsuario}!
          </h3>
          <span className="quadrate-live__badge quadrate-live__badge--rol">
            {rolUsuario}
          </span>
        </div>
        <p className="quadrate-live__saludo-texto">
          Red activa: <strong>{totalCocheras} cocheras</strong> en Lima con aforo en vivo.
          <span className="quadrate-live__saludo-tiempo">
            {" "}· Sesión activa: <strong>{tiempoActivo}</strong>
          </span>
        </p>
      </div>
    </article>
  );
}
