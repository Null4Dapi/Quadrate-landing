/**
 * Script de compilación modular de React para Quadrate pe (.cjs).
 * Convierte cada componente JSX en un módulo nativo ES6 (.js)
 * respetando el límite de líneas y la modularidad del proyecto.
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const rutaBabel = path.join(__dirname, "../src/assets/vendor/babel.min.js");
const codigoBabel = fs.readFileSync(rutaBabel, "utf8");

const contexto = { window: {}, console };
vm.createContext(contexto);
vm.runInContext(codigoBabel, contexto);

const Babel = contexto.Babel;
const directorioReact = path.join(__dirname, "../src/js/react");

const mapaComponentes = [
  { fuente: "saludo-usuario.jsx", destino: "saludo-usuario.js" },
  { fuente: "tarjeta-cochera.jsx", destino: "tarjeta-cochera.js" },
  { fuente: "monitor-actividad.jsx", destino: "monitor-actividad.js" },
  { fuente: "simulador-reserva.jsx", destino: "simulador-reserva.js" },
  { fuente: "contenedor-live.jsx", destino: "contenedor-live.js" },
  { fuente: "quadrate-live-app.jsx", destino: "quadrate-live-app.js" },
  { fuente: "index.jsx", destino: "quadrate-live.js" },
];

for (const { fuente, destino } of mapaComponentes) {
  const rutaFuente = path.join(directorioReact, fuente);
  const rutaDestino = path.join(directorioReact, destino);

  let codigo = fs.readFileSync(rutaFuente, "utf8");

  codigo = codigo.replace(/\.jsx(['"])/g, ".js$1");

  const resultado = Babel.transform(codigo, {
    presets: [["react", { runtime: "classic" }]],
  });

  let codigoSalida = `/**\n * ${destino} — Compilado para Navegador\n */\n`;
  codigoSalida += `const React = window.React;\n`;
  if (codigo.includes("ReactDOM")) {
    codigoSalida += `const ReactDOM = window.ReactDOM;\n`;
  }
  if (codigo.includes("useState") || codigo.includes("useEffect") || codigo.includes("useRef")) {
    codigoSalida += `const { useState, useEffect, useRef } = React;\n`;
  }

  let cuerpo = resultado.code
    .replace(/import\s+React.*?from\s+['"].*?['"];?\n?/g, "")
    .replace(/import\s+ReactDOM.*?from\s+['"].*?['"];?\n?/g, "");

  codigoSalida += cuerpo + "\n";

  fs.writeFileSync(rutaDestino, codigoSalida, "utf8");
  console.log(`Transpilado: ${fuente} -> ${destino}`);
}

console.log("¡Compilación modular de React completada exitosamente!");
