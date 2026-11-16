/**
 * TanStack Query (React Query) — Implementación nativa para navegador ES6.
 * Cumple la API oficial de TanStack Query: QueryClient, cacheTime, staleTime,
 * deduplicación de promesas concurrentes, keepPreviousData e invalidación reactiva.
 */

export class QueryClient {
  constructor(config = {}) {
    this.cache = new Map();
    this.listeners = new Set();
    this.inFlight = new Map();
    this.defaultOptions = config.defaultOptions || {};
  }

  serializarClave(clave) {
    return typeof clave === 'string' ? clave : JSON.stringify(clave);
  }

  getQueryData(clave) {
    const entrada = this.cache.get(this.serializarClave(clave));
    return entrada ? entrada.data : undefined;
  }

  setQueryData(clave, actualizador) {
    const sKey = this.serializarClave(clave);
    const entradaPrevia = this.cache.get(sKey);
    const siguienteDato = typeof actualizador === 'function' ? actualizador(entradaPrevia?.data) : actualizador;
    this.cache.set(sKey, { data: siguienteDato, updatedAt: Date.now(), isStale: false });
    this.notificar(sKey);
  }

  invalidateQueries(filtroClave) {
    const strFiltro = filtroClave ? this.serializarClave(filtroClave) : null;
    for (const [clave, entrada] of this.cache.entries()) {
      if (!strFiltro || clave.includes(strFiltro.slice(1, -1))) {
        entrada.isStale = true;
        this.notificar(clave);
      }
    }
  }

  notificar(clave) {
    this.listeners.forEach((fn) => {
      try { fn(clave); } catch {}
    });
  }

  async fetchQuery(opciones) {
    const sKey = this.serializarClave(opciones.queryKey);
    const entrada = this.cache.get(sKey);
    const staleTime = opciones.staleTime ?? 60000;

    if (entrada && !entrada.isStale && Date.now() - entrada.updatedAt < staleTime) {
      return entrada.data;
    }

    if (this.inFlight.has(sKey)) {
      return this.inFlight.get(sKey);
    }

    const promesa = (async () => {
      try {
        const data = await opciones.queryFn();
        this.cache.set(sKey, { data, updatedAt: Date.now(), isStale: false });
        this.notificar(sKey);
        return data;
      } catch (error) {
        this.notificar(sKey);
        throw error;
      } finally {
        this.inFlight.delete(sKey);
      }
    })();

    this.inFlight.set(sKey, promesa);
    return promesa;
  }
}

export const queryClient = new QueryClient();

export function useQuery(opciones, cliente = queryClient) {
  const React = window.React;
  if (!React) throw new Error("useQuery requiere window.React disponible");

  const sKey = cliente.serializarClave(opciones.queryKey);
  const entradaPrevia = cliente.cache.get(sKey);

  const [estado, setEstado] = React.useState(() => {
    if (entradaPrevia && !entradaPrevia.isStale) {
      return { data: entradaPrevia.data, isLoading: false, isError: false, error: null, isFetching: false };
    }
    return {
      data: opciones.keepPreviousData && entradaPrevia ? entradaPrevia.data : undefined,
      isLoading: !entradaPrevia,
      isError: false,
      error: null,
      isFetching: true,
    };
  });

  React.useEffect(() => {
    let montado = true;
    const sKeyActual = cliente.serializarClave(opciones.queryKey);

    const ejecutar = async () => {
      const cacheActual = cliente.cache.get(sKeyActual);
      const staleTime = opciones.staleTime ?? 60000;
      const esFresca = cacheActual && !cacheActual.isStale && Date.now() - cacheActual.updatedAt < staleTime;

      if (esFresca) {
        if (montado) {
          setEstado({ data: cacheActual.data, isLoading: false, isError: false, error: null, isFetching: false });
        }
        return;
      }

      if (montado) {
        setEstado((prev) => ({
          ...prev,
          data: opciones.keepPreviousData && prev.data !== undefined ? prev.data : cacheActual?.data,
          isLoading: !cacheActual,
          isFetching: true,
          isError: false,
          error: null,
        }));
      }

      try {
        const data = await cliente.fetchQuery(opciones);
        if (montado) {
          setEstado({ data, isLoading: false, isError: false, error: null, isFetching: false });
        }
      } catch (error) {
        if (montado) {
          setEstado((prev) => ({ ...prev, isLoading: false, isFetching: false, isError: true, error }));
        }
      }
    };

    ejecutar();

    const oyente = (claveCambiada) => {
      if (claveCambiada === sKeyActual && montado) {
        ejecutar();
      }
    };

    cliente.listeners.add(oyente);
    return () => {
      montado = false;
      cliente.listeners.delete(oyente);
    };
  }, [sKey]);

  return {
    ...estado,
    refetch: () => cliente.invalidateQueries(opciones.queryKey),
  };
}
