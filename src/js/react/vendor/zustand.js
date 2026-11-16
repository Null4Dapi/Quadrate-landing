/**
 * Zustand — Micro-implementación nativa para navegador ES6.
 * Cumple fielmente la API oficial de Zustand utilizando useSyncExternalStore de React 18.
 * Cero dependencias externas, cero bundlers pesados.
 */

export function create(createState) {
  let state;
  const listeners = new Set();

  const setState = (partial, replace) => {
    const nextState = typeof partial === 'function' ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      state = (replace ?? (typeof nextState !== 'object' || nextState === null))
        ? nextState
        : Object.assign({}, state, nextState);
      listeners.forEach((listener) => {
        try { listener(state); } catch {}
      });
    }
  };

  const getState = () => state;

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const api = { setState, getState, subscribe };
  state = createState(setState, getState, api);

  const useStore = (selector = (s) => s) => {
    const React = window.React;
    if (!React || !React.useSyncExternalStore) {
      throw new Error("Zustand requiere React 18 con useSyncExternalStore en window.React");
    }
    return React.useSyncExternalStore(
      subscribe,
      () => selector(state),
      () => selector(state)
    );
  };

  Object.assign(useStore, api);
  return useStore;
}
