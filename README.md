# calculadora-isr

Cálculo de ISR (Impuesto Sobre la Renta) para personas físicas según las tablas oficiales del SAT. Soporta pagos provisionales, retenciones y declaración anual.

[![Ko-fi](https://img.shields.io/badge/Ko--fi-FF5E5B?style=flat&logo=ko-fi&logoColor=white)](https://ko-fi.com/gerardolucero)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-FFDD00?style=flat&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/lucerorios0)
[![GitHub Stars](https://img.shields.io/github/stars/GerardoLucero/calculadora-isr?style=social)](https://github.com/GerardoLucero/calculadora-isr)
[![npm version](https://badge.fury.io/js/calculadora-isr.svg)](https://www.npmjs.com/package/calculadora-isr)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **Tablas ISR 2024** — tasas marginales actualizadas del SAT
- **Pagos provisionales** — cálculo mensual, bimestral y trimestral
- **ISR anual** — declaración anual para personas físicas
- **Retenciones de salarios** — cálculo de retención por período de pago
- **Subsidio al empleo** — aplicación automática cuando corresponde
- **Múltiples regímenes** — Régimen General, RESICO, Asalariados
- **TypeScript ready** — definiciones de tipos incluidas

## Instalación

```bash
npm install calculadora-isr
```

## Uso

### Retención de salarios

```javascript
import { calcularRetencionSalarios } from 'calculadora-isr';

// Retención mensual para salario de $20,000
const retencion = calcularRetencionSalarios({
  salarioMensual: 20000,
  periodo: 'mensual'
});

console.log(retencion);
// {
//   salarioGravable: 20000,
//   isrCausado: 2650.00,
//   subsidioEmpleo: 0,
//   isrRetenido: 2650.00,
//   tasaEfectiva: 13.25
// }
```

### Pago provisional

```javascript
import { calcularPagoProvisional } from 'calculadora-isr';

const pago = calcularPagoProvisional({
  ingresosAcumulados: 150000,
  mesAcumulado: 6,
  regimen: 'general'
});

console.log(pago);
// {
//   ingresosAcumulados: 150000,
//   isrAcumulado: 22500,
//   pagosAnteriores: 18000,
//   pagoProvisional: 4500
// }
```

### ISR anual

```javascript
import { calcularISRAnual } from 'calculadora-isr';

const isrAnual = calcularISRAnual({
  ingresoAnual: 480000,
  deducciones: 45000
});

console.log(isrAnual);
// {
//   ingresoAnual: 480000,
//   deducciones: 45000,
//   baseGravable: 435000,
//   isrDeterminado: 87600,
//   tasaEfectiva: 18.25
// }
```

## API

| Función | Descripción |
|---------|-------------|
| `calcularRetencionSalarios(opciones)` | Retención ISR para trabajadores asalariados |
| `calcularPagoProvisional(opciones)` | Pago provisional mensual/trimestral |
| `calcularISRAnual(opciones)` | ISR para declaración anual |
| `obtenerTablaISR(año?)` | Retorna la tabla de tarifas ISR del año |
| `obtenerSubsidioEmpleo(salario)` | Subsidio al empleo aplicable |

## Tablas ISR 2024 — Tasas marginales

| Límite inferior | Límite superior | Cuota fija | Tasa excedente |
|----------------|----------------|------------|----------------|
| $0.01 | $8,952.49 | $0.00 | 1.92% |
| $8,952.50 | $75,984.55 | $171.88 | 6.40% |
| $75,984.56 | $133,536.07 | $4,461.94 | 10.88% |
| $133,536.08 | $155,229.80 | $10,723.55 | 16.00% |
| $155,229.81 | $185,852.57 | $14,194.54 | 17.92% |
| $185,852.58 | $374,837.88 | $19,682.13 | 21.36% |
| $374,837.89 | $590,795.99 | $60,049.40 | 23.52% |
| $590,796.00 | $1,127,926.84 | $110,842.74 | 30.00% |
| $1,127,926.85 | $1,503,902.46 | $271,981.99 | 32.00% |
| $1,503,902.47 | $4,511,707.37 | $392,294.17 | 34.00% |
| $4,511,707.38 | En adelante | $1,414,947.85 | 35.00% |

## Referencias

- [SAT — Tablas y tarifas ISR](https://www.sat.gob.mx/personas/declaraciones)
- [Ley del Impuesto Sobre la Renta](https://www.sat.gob.mx/normatividad/00_5_0_Ley_del_ISR.pdf)

## Testing

```bash
npm test
npm run test:coverage
```

## Licencia

MIT © [Gerardo Lucero](https://github.com/GerardoLucero)

---

- [calculadora-imss](https://www.npmjs.com/package/calculadora-imss) — Cuotas IMSS
- [calculadora-nomina-mx](https://www.npmjs.com/package/calculadora-nomina-mx) — Nómina completa
- [calcula-rfc](https://www.npmjs.com/package/calcula-rfc) — Cálculo de RFC
