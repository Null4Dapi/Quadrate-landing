/**
 * react-shim.js — Puente ESM para la versión autoalojada de React (window.React).
 * Permite que los módulos ES6 (como TanStack Query y Zustand) importen de "react"
 * mediante importmap nativo del navegador, sin necesidad de Webpack ni Vite.
 */
const React = window.React;

export default React;
export const {
  Children,
  Component,
  Fragment,
  Profiler,
  PureComponent,
  StrictMode,
  Suspense,
  cloneElement,
  createContext,
  createElement,
  createFactory,
  createRef,
  forwardRef,
  isValidElement,
  lazy,
  memo,
  startTransition,
  useCallback,
  useContext,
  useDebugValue,
  useDeferredValue,
  useEffect,
  useId,
  useImperativeHandle,
  useInsertionEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
  version,
} = React;
