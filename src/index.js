/**
 * Calculadora de ISR (Impuesto Sobre la Renta) México 2026
 * Basada en las tarifas oficiales del SAT (Anexo 8 de la RMF 2026, DOF 28-12-2025)
 */

// Tarifa mensual 2026 - Personas físicas (pagos provisionales y retenciones)
// Fuente: Anexo 8 RMF 2026, apartado B, fracción V (DOF 28-dic-2025), art. 96 LISR
const TARIFAS_ISR_2026 = [
  { limite_inferior: 0.01,      limite_superior: 844.59,    cuota_fija: 0,         porcentaje: 1.92  },
  { limite_inferior: 844.60,    limite_superior: 7168.51,   cuota_fija: 16.22,     porcentaje: 6.40  },
  { limite_inferior: 7168.52,   limite_superior: 12598.02,  cuota_fija: 420.95,    porcentaje: 10.88 },
  { limite_inferior: 12598.03,  limite_superior: 14644.64,  cuota_fija: 1011.68,   porcentaje: 16.00 },
  { limite_inferior: 14644.65,  limite_superior: 17533.64,  cuota_fija: 1339.14,   porcentaje: 17.92 },
  { limite_inferior: 17533.65,  limite_superior: 35362.83,  cuota_fija: 1856.84,   porcentaje: 21.36 },
  { limite_inferior: 35362.84,  limite_superior: 55736.68,  cuota_fija: 5665.16,   porcentaje: 23.52 },
  { limite_inferior: 55736.69,  limite_superior: 106410.50, cuota_fija: 10457.09,  porcentaje: 30.00 },
  { limite_inferior: 106410.51, limite_superior: 141880.66, cuota_fija: 25659.23,  porcentaje: 32.00 },
  { limite_inferior: 141880.67, limite_superior: 425641.99, cuota_fija: 37009.69,  porcentaje: 34.00 },
  { limite_inferior: 425642.00, limite_superior: Infinity,  cuota_fija: 133488.54, porcentaje: 35.00 }
];

// Tarifa anual 2026 (ejercicio 2026, arts. 97 y 152 LISR)
// Fuente: Anexo 8 RMF 2026, apartado C, fracción II (DOF 28-dic-2025)
const TARIFAS_ISR_ANUAL_2026 = [
  { limite_inferior: 0.01,        limite_superior: 10135.11,     cuota_fija: 0,          porcentaje: 1.92  },
  { limite_inferior: 10135.12,    limite_superior: 86022.11,     cuota_fija: 194.59,     porcentaje: 6.40  },
  { limite_inferior: 86022.12,    limite_superior: 151176.19,    cuota_fija: 5051.37,    porcentaje: 10.88 },
  { limite_inferior: 151176.20,   limite_superior: 175735.66,    cuota_fija: 12140.13,   porcentaje: 16.00 },
  { limite_inferior: 175735.67,   limite_superior: 210403.69,    cuota_fija: 16069.64,   porcentaje: 17.92 },
  { limite_inferior: 210403.70,   limite_superior: 424353.97,    cuota_fija: 22282.14,   porcentaje: 21.36 },
  { limite_inferior: 424353.98,   limite_superior: 668840.14,    cuota_fija: 67981.92,   porcentaje: 23.52 },
  { limite_inferior: 668840.15,   limite_superior: 1276925.98,   cuota_fija: 125485.07,  porcentaje: 30.00 },
  { limite_inferior: 1276925.99,  limite_superior: 1702567.97,   cuota_fija: 307910.81,  porcentaje: 32.00 },
  { limite_inferior: 1702567.98,  limite_superior: 5107703.92,   cuota_fija: 444116.23,  porcentaje: 34.00 },
  { limite_inferior: 5107703.93,  limite_superior: Infinity,     cuota_fija: 1601862.46, porcentaje: 35.00 }
];

// UMA 2026 (INEGI, DOF 09-ene-2026; vigente del 1 de febrero de 2026 al 31 de enero de 2027)
// Enero de 2026 todavia se rige por la UMA 2025 (diaria 113.14).
const UMA_2026 = {
  diaria: 117.31,
  mensual: 3566.22,
  anual: 42794.64
};

// Subsidio para el empleo 2026
// Fuente: Decreto por el que se modifica el diverso que otorga el subsidio para el empleo (DOF 31-dic-2025).
// Se otorga a quien tenga ingresos mensuales de hasta 11,492.66; febrero a diciembre equivale a 15.02% de la
// UMA mensual (535.65) y enero de 2026 tiene un monto transitorio de 536.21 (15.59% de la UMA 2025).
const SUBSIDIO_EMPLEO_2026 = {
  limiteIngresoMensual: 11492.66,
  mensual: 535.65,
  enero: 536.21
};

/**
 * Busca el renglon de una tarifa: el ultimo cuyo limite inferior no excede el ingreso.
 * (Evita los huecos de centavos entre renglones.)
 */
function buscarTarifa(tarifas, ingreso) {
  let encontrada = null;
  for (const t of tarifas) {
    if (ingreso >= t.limite_inferior) encontrada = t;
  }
  return encontrada;
}

/**
 * Calcula el ISR mensual para personas físicas
 * @param {number} ingresoMensual - Ingreso mensual bruto
 * @param {Object} opciones - { incluirSubsidio = true, deduccionPersonal = 0, mes } (mes 1 usa el subsidio transitorio de enero)
 * @returns {Object} Resultado del cálculo
 */
export function calcularISRMensual(ingresoMensual, opciones = {}) {
  if (typeof ingresoMensual !== 'number' || ingresoMensual < 0) {
    throw new Error('El ingreso mensual debe ser un número positivo');
  }

  const { incluirSubsidio = true, deduccionPersonal = 0, mes = null } = opciones;

  // Calcular ingreso gravable
  const ingresoGravable = Math.max(0, ingresoMensual - deduccionPersonal);

  // Ingreso gravable cero: ISR = 0
  if (ingresoGravable === 0) {
    return {
      ingresoMensual: 0, ingresoGravable: 0, deduccionPersonal: parseFloat(deduccionPersonal.toFixed(2)),
      isrAntesSubsidio: 0, subsidio: 0, isrFinal: 0, ingresoNeto: parseFloat(ingresoMensual.toFixed(2)),
      tasaEfectiva: 0, tarifa: null
    };
  }

  // Encontrar tarifa aplicable
  const tarifa = buscarTarifa(TARIFAS_ISR_2026, ingresoGravable);

  if (!tarifa) {
    throw new Error('No se encontró tarifa aplicable');
  }

  // Calcular ISR (fórmula SAT: excedente × tasa + cuota_fija)
  const excedente = ingresoGravable - tarifa.limite_inferior;
  const impuestoMarginal = excedente * (tarifa.porcentaje / 100);
  const isrAntesSubsidio = tarifa.cuota_fija + impuestoMarginal;
  
  // Calcular subsidio
  let subsidio = 0;
  if (incluirSubsidio && ingresoGravable <= SUBSIDIO_EMPLEO_2026.limiteIngresoMensual) {
    subsidio = mes === 1 ? SUBSIDIO_EMPLEO_2026.enero : SUBSIDIO_EMPLEO_2026.mensual;
  }
  
  const isrFinal = Math.max(0, isrAntesSubsidio - subsidio);
  const ingresoNeto = ingresoMensual - isrFinal;
  
  return {
    ingresoMensual: parseFloat(ingresoMensual.toFixed(2)),
    ingresoGravable: parseFloat(ingresoGravable.toFixed(2)),
    deduccionPersonal: parseFloat(deduccionPersonal.toFixed(2)),
    isrAntesSubsidio: parseFloat(isrAntesSubsidio.toFixed(2)),
    subsidio: parseFloat(subsidio.toFixed(2)),
    isrFinal: parseFloat(isrFinal.toFixed(2)),
    ingresoNeto: parseFloat(ingresoNeto.toFixed(2)),
    tasaEfectiva: parseFloat(((isrFinal / ingresoMensual) * 100).toFixed(2)),
    tarifa: {
      limite_inferior: tarifa.limite_inferior,
      limite_superior: tarifa.limite_superior,
      cuota_fija: tarifa.cuota_fija,
      porcentaje: tarifa.porcentaje
    }
  };
}

/**
 * Calcula el ISR anual para personas físicas
 * @param {number} ingresoAnual - Ingreso anual bruto
 * @param {Object} opciones - Opciones de cálculo
 * @returns {Object} Resultado del cálculo
 */
export function calcularISRAnual(ingresoAnual, opciones = {}) {
  if (typeof ingresoAnual !== 'number' || ingresoAnual < 0) {
    throw new Error('El ingreso anual debe ser un número positivo');
  }

  const { deducciones = 0, exentoAguinaldo = 0 } = opciones;

  // Límite de exención de aguinaldo: 30 UMAs diarias (Art. 93 LISR)
  const limiteExencionAguinaldo = UMA_2026.diaria * 30;
  const aguinaldoExento = Math.min(exentoAguinaldo, limiteExencionAguinaldo);
  
  const ingresoGravable = Math.max(0, ingresoAnual - deducciones - aguinaldoExento);
  // Tarifa anual del ejercicio (arts. 97 y 152 LISR), no la mensual por 12
  const tarifaAnual = buscarTarifa(TARIFAS_ISR_ANUAL_2026, ingresoGravable);
  const isrAnual = tarifaAnual
    ? tarifaAnual.cuota_fija + (ingresoGravable - tarifaAnual.limite_inferior) * (tarifaAnual.porcentaje / 100)
    : 0;
  
  return {
    ingresoAnual: parseFloat(ingresoAnual.toFixed(2)),
    deducciones: parseFloat(deducciones.toFixed(2)),
    aguinaldoExento: parseFloat(aguinaldoExento.toFixed(2)),
    ingresoGravable: parseFloat(ingresoGravable.toFixed(2)),
    isrAnual: parseFloat(isrAnual.toFixed(2)),
    ingresoNetoAnual: parseFloat((ingresoAnual - isrAnual).toFixed(2)),
    tasaEfectiva: ingresoAnual > 0 ? parseFloat(((isrAnual / ingresoAnual) * 100).toFixed(2)) : 0,
    isrMensualPromedio: parseFloat((isrAnual / 12).toFixed(2))
  };
}

/**
 * Calcula el ISR para honorarios (personas físicas con actividad empresarial)
 * @param {number} ingresosMensuales - Ingresos mensuales por honorarios
 * @param {number} deduccionesMensuales - Deducciones mensuales
 * @returns {Object} Resultado del cálculo
 */
export function calcularISRHonorarios(ingresosMensuales, deduccionesMensuales = 0) {
  if (typeof ingresosMensuales !== 'number' || ingresosMensuales < 0) {
    throw new Error('Los ingresos deben ser un número positivo');
  }

  if (deduccionesMensuales < 0) {
    throw new Error('Las deducciones no pueden ser negativas');
  }

  const utilidad = Math.max(0, ingresosMensuales - deduccionesMensuales);
  const calculoISR = calcularISRMensual(utilidad, { incluirSubsidio: false });
  
  // Retención del 10% sobre honorarios
  const retencion = ingresosMensuales * 0.10;
  const isrAPagar = Math.max(0, calculoISR.isrFinal - retencion);
  
  return {
    ingresosMensuales: parseFloat(ingresosMensuales.toFixed(2)),
    deduccionesMensuales: parseFloat(deduccionesMensuales.toFixed(2)),
    utilidad: parseFloat(utilidad.toFixed(2)),
    isrCalculado: calculoISR.isrFinal,
    retencion: parseFloat(retencion.toFixed(2)),
    isrAPagar: parseFloat(isrAPagar.toFixed(2)),
    ingresoNeto: parseFloat((ingresosMensuales - calculoISR.isrFinal).toFixed(2))
  };
}

/**
 * Obtiene las tarifas ISR vigentes
 * @returns {Object} Tarifas y constantes fiscales
 */
export function obtenerTarifasISR() {
  return {
    año: 2026,
    tarifas: TARIFAS_ISR_2026,
    tarifasAnuales: TARIFAS_ISR_ANUAL_2026,
    subsidioEmpleo: SUBSIDIO_EMPLEO_2026,
    uma: UMA_2026,
    limitesExencion: {
      aguinaldo: UMA_2026.diaria * 30,          // 30 UMAs diarias (Art. 93 LISR)
      primaVacacional: UMA_2026.diaria * 15,    // 15 UMAs diarias
      indemnizacionPorAnioServicio: UMA_2026.diaria * 90 // 90 UMAs diarias por cada año de servicio
    }
  };
}

/**
 * Calcula el ISR de manera inversa (dado el ISR, obtener el ingreso bruto)
 * @param {number} isrDeseado - ISR que se quiere pagar
 * @param {Object} opciones - Opciones de cálculo
 * @returns {Object} Resultado del cálculo inverso
 */
export function calcularIngresoDesdeISR(isrDeseado, opciones = {}) {
  if (!isrDeseado || isrDeseado < 0) {
    throw new Error('El ISR debe ser un número positivo');
  }

  const { precision = 0.01, maxIteraciones = 1000 } = opciones;
  
  let ingresoMin = 0;
  let ingresoMax = 1000000;
  let iteraciones = 0;
  
  while (iteraciones < maxIteraciones) {
    const ingresoMedio = (ingresoMin + ingresoMax) / 2;
    const calculo = calcularISRMensual(ingresoMedio, opciones);
    
    if (Math.abs(calculo.isrFinal - isrDeseado) <= precision) {
      return {
        ingresoRequerido: parseFloat(ingresoMedio.toFixed(2)),
        isrCalculado: calculo.isrFinal,
        diferencia: parseFloat((calculo.isrFinal - isrDeseado).toFixed(2)),
        iteraciones
      };
    }
    
    if (calculo.isrFinal > isrDeseado) {
      ingresoMax = ingresoMedio;
    } else {
      ingresoMin = ingresoMedio;
    }
    
    iteraciones++;
  }
  
  throw new Error('No se pudo encontrar el ingreso exacto en las iteraciones especificadas');
}

export default {
  calcularISRMensual,
  calcularISRAnual,
  calcularISRHonorarios,
  obtenerTarifasISR,
  calcularIngresoDesdeISR
};
