import lib from './index.js';

describe('calculadora-isr', () => {
  describe('calcularISRMensual', () => {
    test('debe calcular ISR para ingreso de $15,000', () => {
      const resultado = lib.calcularISRMensual(15000);
      expect(resultado).toHaveProperty('ingresoMensual', 15000);
      expect(resultado).toHaveProperty('isrFinal');
      expect(resultado).toHaveProperty('ingresoNeto');
      expect(resultado).toHaveProperty('tasaEfectiva');
      expect(resultado.isrFinal).toBeGreaterThan(0);
      expect(resultado.ingresoNeto).toBeLessThan(15000);
    });

    test('debe aplicar subsidio para empleos', () => {
      const resultado = lib.calcularISRMensual(5000, { incluirSubsidio: true });
      const sinSubsidio = lib.calcularISRMensual(5000, { incluirSubsidio: false });
      expect(resultado.subsidio).toBeGreaterThan(0);
      expect(resultado.isrFinal).toBeLessThan(sinSubsidio.isrFinal);
    });

    test('debe rechazar ingresos negativos', () => {
      expect(() => lib.calcularISRMensual(-1000)).toThrow('El ingreso mensual debe ser un número positivo');
    });
  });

  describe('calcularISRAnual', () => {
    test('debe calcular ISR anual para $180,000', () => {
      const resultado = lib.calcularISRAnual(180000);
      expect(resultado).toHaveProperty('ingresoAnual', 180000);
      expect(resultado).toHaveProperty('isrAnual');
      expect(resultado.isrAnual).toBeGreaterThan(0);
    });
  });

  describe('obtenerTarifasISR', () => {
    test('debe retornar tarifas ISR 2024', () => {
      const tarifas = lib.obtenerTarifasISR();
      expect(tarifas).toHaveProperty('año', 2024);
      expect(tarifas).toHaveProperty('tarifas');
      expect(Array.isArray(tarifas.tarifas)).toBe(true);
    });
  });
});
