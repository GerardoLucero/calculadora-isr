# calculadora-isr

<!-- BADGES-DONATIONS-START -->
[![Ko-fi](https://img.shields.io/badge/Ko--fi-Donate-orange?logo=ko-fi)](https://ko-fi.com/gerardolucero)
[![BuyMeACoffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Support-yellow?logo=buy-me-a-coffee)](https://buymeacoffee.com/lucerorios0)
<!-- BADGES-DONATIONS-END -->


[![npm version](https://badge.fury.io/js/calculadora-isr.svg)](https://badge.fury.io/js/calculadora-isr)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Calculadora completa de ISR (Impuesto Sobre la Renta) mexicano con tarifas actualizadas del SAT.

## Instalación

```bash
npm install calculadora-isr
```

## Uso

```javascript
import { calcularISR, calcularSubsidio } from 'calculadora-isr';

// Calcular ISR mensual
const isr = calcularISR(25000, 'mensual');
console.log(isr); // { isr: 3899.42, subsidio: 0, isrNeto: 3899.42 }

// Calcular ISR anual
const isrAnual = calcularISR(300000, 'anual');
console.log(isrAnual);
```

## API

### `calcularISR(ingreso, periodo)`

Calcula el ISR según las tarifas vigentes del SAT.

**Parámetros:**
- `ingreso` (number): Ingreso gravable
- `periodo` (string): 'mensual', 'quincenal', 'semanal', 'diario', 'anual'

### `calcularSubsidio(ingreso, periodo)`

Calcula el subsidio para el empleo.

## Características

- ✅ Tarifas ISR actualizadas 2024
- ✅ Cálculo de subsidio para el empleo
- ✅ Soporte múltiples periodos de pago
- ✅ Cálculo de UMA vigente
- ✅ Precisión decimal correcta

## Licencia

MIT © Gerardo Lucero

<!-- DONATIONS-START -->
## 💖 Apoya el Ecosistema Mexicano OSS

Si estos paquetes te ayudan (RFC, ISR, Nómina, Bancos, Feriados, Nombres, Códigos Postales, Validadores), considera invitarme un café o apoyar el mantenimiento:

- [Ko-fi](https://ko-fi.com/gerardolucero)
- [Buy Me a Coffee](https://buymeacoffee.com/lucerorios0)

> Gracias por tu apoyo 🙌. Priorizaré issues/PRs con **contexto de uso en México** (SAT/IMSS/INFONAVIT, bancos, feriados) y publicaré avances en los READMEs.
<!-- DONATIONS-END -->
