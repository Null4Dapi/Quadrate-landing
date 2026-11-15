/**
 * react-jsx-runtime.js — Puente ESM para react/jsx-runtime usando window.React.
 */
const React = window.React;

export const Fragment = React.Fragment;

export function jsx(type, props, key) {
  if (!props) {
    return React.createElement(type, key !== undefined ? { key } : null);
  }
  const { children, ...rest } = props;
  const config = key !== undefined ? { ...rest, key } : rest;
  if (children === undefined) {
    return React.createElement(type, config);
  }
  if (Array.isArray(children)) {
    return React.createElement(type, config, ...children);
  }
  return React.createElement(type, config, children);
}

export const jsxs = jsx;

export default { jsx, jsxs, Fragment };
