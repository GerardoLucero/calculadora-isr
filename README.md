# calculadora-isr

Cálculo de ISR (Impuesto Sobre la Renta) para personas físicas según las tablas oficiales del SAT. Soporta pagos provisionales, retenciones y declaración anual.

[![npm version](https://badge.fury.io/js/calculadora-isr.svg)](https://www.npmjs.com/package/calculadora-isr)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![CI](https://github.com/GerardoLucero/calculadora-isr/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/GerardoLucero/calculadora-isr/actions/workflows/ci-cd.yml)

## Features

- **Tarifas ISR 2026** — mensual y anual, tomadas del Anexo 8 de la RMF 2026 (DOF 28-12-2025)
- **Subsidio para el empleo 2026** — conforme al decreto del DOF del 31-12-2025
- **ISR mensual** — con deducción personal y subsidio opcional
- **ISR anual** — con la tarifa anual del ejercicio (arts. 97 y 152 LISR) y exención de aguinaldo
- **Honorarios** — ISR a cargo con la retención del 10 %
- **Cálculo inverso** — qué ingreso produce un ISR dado

> Los datos corresponden al ejercicio **2026**. Para otros ejercicios usa la versión de la librería de esa época. Esta librería es una ayuda de cálculo, no sustituye a un contador.

## Instalación

```bash
npm install calculadora-isr
```

## Uso

```javascript
import { calcularISRMensual, calcularISRAnual, calcularISRHonorarios, obtenerTarifasISR } from 'calculadora-isr';

calcularISRMensual(20000);
// {
//   ingresoMensual: 20000, ingresoGravable: 20000,
//   isrAntesSubsidio: 2383.65, subsidio: 0, isrFinal: 2383.65,
//   ingresoNeto: 17616.35, tasaEfectiva: 11.92,
//   tarifa: { limite_inferior: 17533.65, limite_superior: 35362.83, cuota_fija: 1856.84, porcentaje: 21.36 }
// }

// Enero de 2026 usa el subsidio transitorio (536.21 en lugar de 535.65)
calcularISRMensual(8000, { mes: 1 });

calcularISRAnual(300000, { exentoAguinaldo: 15000 });
// aguinaldoExento: 3519.3 (tope de 30 UMA), isrAnual: 40668.19, tasaEfectiva: 13.56

calcularISRHonorarios(50000, 10000);
// isrCalculado: 6755.82, retencion: 5000, isrAPagar: 1755.82
```

## API

| Función | Descripción |
|---|---|
| `calcularISRMensual(ingreso, { incluirSubsidio = true, deduccionPersonal = 0, mes })` | ISR mensual con tarifa y subsidio 2026 |
| `calcularISRAnual(ingresoAnual, { deducciones = 0, exentoAguinaldo = 0 })` | ISR del ejercicio con la tarifa anual |
| `calcularISRHonorarios(ingresos, deducciones = 0)` | ISR de honorarios con retención del 10 % |
| `calcularIngresoDesdeISR(isr, opciones)` | Ingreso mensual que produce ese ISR |
| `obtenerTarifasISR()` | Tarifas, subsidio, UMA y límites de exención del año |

## Tarifa mensual 2026 (art. 96 LISR)

| Límite inferior | Límite superior | Cuota fija | Tasa sobre excedente |
|---|---|---|---|
| $0.01 | $844.59 | $0.00 | 1.92% |
| $844.60 | $7,168.51 | $16.22 | 6.40% |
| $7,168.52 | $12,598.02 | $420.95 | 10.88% |
| $12,598.03 | $14,644.64 | $1,011.68 | 16.00% |
| $14,644.65 | $17,533.64 | $1,339.14 | 17.92% |
| $17,533.65 | $35,362.83 | $1,856.84 | 21.36% |
| $35,362.84 | $55,736.68 | $5,665.16 | 23.52% |
| $55,736.69 | $106,410.50 | $10,457.09 | 30.00% |
| $106,410.51 | $141,880.66 | $25,659.23 | 32.00% |
| $141,880.67 | $425,641.99 | $37,009.69 | 34.00% |
| $425,642.00 | En adelante | $133,488.54 | 35.00% |

La tarifa anual 2026 y el subsidio (hasta $11,492.66 de ingreso mensual, $535.65 de febrero a diciembre) están en `obtenerTarifasISR()`. La UMA 2026 ($117.31 diaria) rige desde el 1 de febrero de 2026.

## Referencias

- [Anexo 8 de la RMF 2026 (SAT, DOF 28-12-2025)](https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/documentos2026/rmf/anexos/Anexo-8-RMF-2026_DOF-28122025.pdf)
- Decreto por el que se modifica el diverso que otorga el subsidio para el empleo (DOF 31-12-2025)
- [Ley del Impuesto Sobre la Renta](https://www.diputados.gob.mx/LeyesBiblio/pdf/LISR.pdf)

## Testing

```bash
npm test
npm run test:coverage
```

## Apoyo

Proyecto de código abierto mantenido en mi tiempo libre. Si te fue útil y quieres agradecerlo:

[![Ko-fi](https://img.shields.io/badge/Ko--fi-FF5E5B?style=flat&logo=ko-fi&logoColor=white)](https://ko-fi.com/gerardolucero)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-FFDD00?style=flat&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/lucerorios0)

## Licencia

MIT © [Gerardo Lucero](https://github.com/GerardoLucero), ver [LICENSE](LICENSE).

---

- [calculadora-imss](https://www.npmjs.com/package/calculadora-imss) — Cuotas IMSS
- [calculadora-nomina-mx](https://www.npmjs.com/package/calculadora-nomina-mx) — Nómina completa
- [calcula-rfc](https://www.npmjs.com/package/calcula-rfc) — Cálculo de RFC
