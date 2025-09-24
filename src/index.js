/**
 * Calculadora de ISR (Impuesto Sobre la Renta) México 2024
 * Basada en las tarifas oficiales del SAT
 */

// Tarifas ISR 2024 - Personas Físicas
const TARIFAS_ISR_2024 = [
  { limite_inferior: 0.01, limite_superior: 746.04, cuota_fija: 0, porcentaje: 1.92 },
  { limite_inferior: 746.05, limite_superior: 6332.05, cuota_fija: 14.32, porcentaje: 6.40 },
  { limite_inferior: 6332.06, limite_superior: 11128.01, cuota_fija: 371.83, porcentaje: 10.88 },
  { limite_inferior: 11128.02, limite_superior: 12935.82, cuota_fija: 893.63, porcentaje: 16.00 },
  { limite_inferior: 12935.83, limite_superior: 15487.71, cuota_fija: 1182.88, porcentaje: 21.36 },
  { limite_inferior: 15487.72, limite_superior: 31236.49, cuota_fija: 1727.83, porcentaje: 23.52 },
  { limite_inferior: 31236.50, limite_superior: 49233.00, cuota_fija: 5429.49, porcentaje: 30.00 },
  { limite_inferior: 49233.01, limite_superior: 93993.90, cuota_fija: 10828.32, porcentaje: 32.00 },
  { limite_inferior: 93993.91, limite_superior: 125325.20, cuota_fija: 25123.80, porcentaje: 34.00 },
  { limite_inferior: 125325.21, limite_superior: Infinity, cuota_fija: 35775.24, porcentaje: 35.00 }
];

// Subsidio para el empleo 2024
const SUBSIDIO_EMPLEO_2024 = [
  { limite_inferior: 0.01, limite_superior: 1768.96, subsidio: 407.02 },
  { limite_inferior: 1768.97, limite_superior: 2653.38, subsidio: 406.83 },
  { limite_inferior: 2653.39, limite_superior: 3472.84, subsidio: 406.62 },
  { limite_inferior: 3472.85, limite_superior: 3537.87, subsidio: 392.77 },
  { limite_inferior: 3537.88, limite_superior: 4446.15, subsidio: 382.46 },
  { limite_inferior: 4446.16, limite_superior: 4717.18, subsidio: 354.23 },
  { limite_inferior: 4717.19, limite_superior: 5335.42, subsidio: 324.87 },
  { limite_inferior: 5335.43, limite_superior: 6224.67, subsidio: 294.63 },
  { limite_inferior: 6224.68, limite_superior: 7113.90, subsidio: 253.54 },
  { limite_inferior: 7113.91, limite_superior: 7382.33, subsidio: 217.61 },
  { limite_inferior: 7382.34, limite_superior: Infinity, subsidio: 0 }
];

// UMA 2024
const UMA_2024 = {
  diaria: 108.57,
  mensual: 3297.57,
  anual: 39570.84
};

/**
 * Calcula el ISR mensual para personas físicas
 * @param {number} ingresoMensual - Ingreso mensual bruto
 * @param {Object} opciones - Opciones de cálculo
 * @returns {Object} Resultado del cálculo
 */
export function calcularISRMensual(ingresoMensual, opciones = {}) {
  if (!ingresoMensual || ingresoMensual < 0) {
    throw new Error('El ingreso mensual debe ser un número positivo');
  }

  const { incluirSubsidio = true, deduccionPersonal = 0 } = opciones;
  
  // Calcular ingreso gravable
  const ingresoGravable = Math.max(0, ingresoMensual - deduccionPersonal);
  
  // Encontrar tarifa aplicable
  const tarifa = TARIFAS_ISR_2024.find(t => 
    ingresoGravable >= t.limite_inferior && ingresoGravable <= t.limite_superior
  );
  
  if (!tarifa) {
    throw new Error('No se encontró tarifa aplicable');
  }
  
  // Calcular ISR
  const excedente = ingresoGravable - tarifa.limite_inferior + 0.01;
  const impuestoMarginal = excedente * (tarifa.porcentaje / 100);
  const isrAntesSubsidio = tarifa.cuota_fija + impuestoMarginal;
  
  // Calcular subsidio
  let subsidio = 0;
  if (incluirSubsidio) {
    const tarifaSubsidio = SUBSIDIO_EMPLEO_2024.find(s => 
      ingresoGravable >= s.limite_inferior && ingresoGravable <= s.limite_superior
    );
    subsidio = tarifaSubsidio ? tarifaSubsidio.subsidio : 0;
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
  if (!ingresoAnual || ingresoAnual < 0) {
    throw new Error('El ingreso anual debe ser un número positivo');
  }

  const { deducciones = 0, exentoAguinaldo = 0 } = opciones;
  
  // Límite de exención de aguinaldo (30 UMAs)
  const limiteExencionAguinaldo = UMA_2024.anual * 30 / 365 * 30;
  const aguinaldoExento = Math.min(exentoAguinaldo, limiteExencionAguinaldo);
  
  const ingresoGravable = Math.max(0, ingresoAnual - deducciones - aguinaldoExento);
  const ingresoMensualPromedio = ingresoGravable / 12;
  
  // Calcular ISR mensual y multiplicar por 12
  const calculoMensual = calcularISRMensual(ingresoMensualPromedio, { incluirSubsidio: false });
  const isrAnual = calculoMensual.isrAntesSubsidio * 12;
  
  return {
    ingresoAnual: parseFloat(ingresoAnual.toFixed(2)),
    deducciones: parseFloat(deducciones.toFixed(2)),
    aguinaldoExento: parseFloat(aguinaldoExento.toFixed(2)),
    ingresoGravable: parseFloat(ingresoGravable.toFixed(2)),
    isrAnual: parseFloat(isrAnual.toFixed(2)),
    ingresoNetoAnual: parseFloat((ingresoAnual - isrAnual).toFixed(2)),
    tasaEfectiva: parseFloat(((isrAnual / ingresoAnual) * 100).toFixed(2)),
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
  if (!ingresosMensuales || ingresosMensuales < 0) {
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
    año: 2024,
    tarifas: TARIFAS_ISR_2024,
    subsidioEmpleo: SUBSIDIO_EMPLEO_2024,
    uma: UMA_2024,
    limitesExencion: {
      aguinaldo: UMA_2024.anual * 30 / 365 * 30,
      primaVacacional: UMA_2024.anual * 15 / 365 * 15,
      indemnizacion: UMA_2024.anual * 90
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
