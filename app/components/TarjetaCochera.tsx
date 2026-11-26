import BotonFavorito from "./BotonFavorito";

export interface DatosCochera {
  readonly id: number;
  readonly nombre: string;
  readonly distrito: string;
  readonly direccion: string;
  readonly tarifaHora: number;
  readonly plazasDisponibles: number;
  readonly aforoTotal: number;
  readonly estadoOperativo: string;
  readonly tiempoPromedioAccesoMin: number;
}

interface TarjetaCocheraProps {
  readonly cochera: DatosCochera;
}

export default function TarjetaCochera({ cochera }: TarjetaCocheraProps) {
  const porcentajeOcupacion = Math.round(
    ((cochera.aforoTotal - cochera.plazasDisponibles) / cochera.aforoTotal) * 100
  );

  return (
    <article className="tarjeta-cochera" aria-labelledby={`cochera-titulo-${cochera.id}`}>
      <header className="tarjeta-cochera__encabezado">
        <div>
          <span className="tarjeta-cochera__distrito">{cochera.distrito}</span>
          <h3 className="tarjeta-cochera__nombre" id={`cochera-titulo-${cochera.id}`}>
            {cochera.nombre}
          </h3>
          <p className="tarjeta-cochera__direccion">{cochera.direccion}</p>
        </div>
      </header>

      <div className="tarjeta-cochera__metricas">
        <div className="tarjeta-cochera__metrica-item">
          <span className="tarjeta-cochera__metrica-etiqueta">Tarifa / Hora</span>
          <span className="tarjeta-cochera__metrica-valor">S/ {cochera.tarifaHora.toFixed(2)}</span>
        </div>
        <div className="tarjeta-cochera__metrica-item">
          <span className="tarjeta-cochera__metrica-etiqueta">Plazas Libres</span>
          <span className="tarjeta-cochera__metrica-valor tarjeta-cochera__metrica-valor--exito">
            {cochera.plazasDisponibles} de {cochera.aforoTotal}
          </span>
        </div>
        <div className="tarjeta-cochera__metrica-item">
          <span className="tarjeta-cochera__metrica-etiqueta">Ocupación</span>
          <span className="tarjeta-cochera__metrica-valor">{porcentajeOcupacion}%</span>
        </div>
        <div className="tarjeta-cochera__metrica-item">
          <span className="tarjeta-cochera__metrica-etiqueta">Tiempo Acceso</span>
          <span className="tarjeta-cochera__metrica-valor">~{cochera.tiempoPromedioAccesoMin} min</span>
        </div>
      </div>

      <footer className="tarjeta-cochera__acciones">
        {/* Client Component inyectado dentro del Server Component */}
        <BotonFavorito cocheraId={cochera.id} nombreCochera={cochera.nombre} />
      </footer>
    </article>
  );
}
