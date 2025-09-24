# calculadora-isr

[![npm version](https://badge.fury.io/js/calculadora-isr.svg)](https://www.npmjs.com/package/calculadora-isr)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Cálculo de ISR para personas físicas y morales según SAT

## 🚀 Instalación

```bash
npm install calculadora-isr
```

## 📖 Uso

```javascript
import lib from 'calculadora-isr';

// Uso básico
const resultado = lib.main('ejemplo');
console.log(resultado);

// Validación
const esValido = lib.validar('datos');
console.log(esValido); // true

// Búsqueda
const resultados = lib.buscar('término');
console.log(resultados);

// Estadísticas
const stats = lib.getEstadisticas();
console.log(stats);
```

## 🔧 API

### `main(input): any`
Función principal de procesamiento.

### `validar(data): boolean`
Valida datos de entrada.

### `buscar(query): Array`
Busca elementos por término.

### `getEstadisticas(): Object`
Obtiene estadísticas del módulo.

## 🧪 Tests

```bash
npm test
npm run test:coverage
```

## 📄 Licencia

MIT © Gerardo Lucero
