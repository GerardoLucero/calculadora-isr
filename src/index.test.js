import lib from './index.js';

// Valores calculados a mano con la tarifa oficial 2026 (Anexo 8 RMF 2026, DOF 28-12-2025).
describe('calculadora-isr 2026', () => {
  describe('calcularISRMensual', () => {
    test('aplica cuota fija + excedente en el tramo de 10,000', () => {
      // 420.95 + (10000 - 7168.52) * 10.88% = 729.015
      const r = lib.calcularISRMensual(10000, { incluirSubsidio: false });
      expect(r.isrAntesSubsidio).toBeCloseTo(729.02, 1);
      expect(r.tarifa.cuota_fija).toBe(420.95);
    });

    test('resta el subsidio al empleo de 535.65 hasta el limite de 11,492.66', () => {
      const r = lib.calcularISRMensual(10000);
      expect(r.subsidio).toBe(535.65);
      expect(r.isrFinal).toBeCloseTo(193.37, 1);
      expect(lib.calcularISRMensual(11492.66).subsidio).toBe(535.65);
      expect(lib.calcularISRMensual(11492.67).subsidio).toBe(0);
    });

    test('enero usa el subsidio transitorio de 536.21', () => {
      expect(lib.calcularISRMensual(5000, { mes: 1 }).subsidio).toBe(536.21);
    });

    test('el subsidio nunca deja el ISR en negativo', () => {
      const r = lib.calcularISRMensual(2000);
      expect(r.isrFinal).toBe(0);
    });

    test('aplica el tramo del 35% desde 425,642.00', () => {
      const r = lib.calcularISRMensual(425642, { incluirSubsidio: false });
      expect(r.tarifa.porcentaje).toBe(35);
      expect(r.isrAntesSubsidio).toBeCloseTo(133488.54, 2);
    });

    test('no falla con montos entre dos renglones (huecos de centavos)', () => {
      expect(() => lib.calcularISRMensual(844.595)).not.toThrow();
    });

    test('con deduccion personal calcula sobre el ingreso gravable', () => {
      const r = lib.calcularISRMensual(10000, { deduccionPersonal: 2000, incluirSubsidio: false });
      expect(r.ingresoGravable).toBe(8000);
    });

    test('rechaza ingresos negativos', () => {
      expect(() => lib.calcularISRMensual(-1000)).toThrow('El ingreso mensual debe ser un número positivo');
    });
  });

  describe('calcularISRAnual', () => {
    test('usa la tarifa anual 2026: 180,000', () => {
      // 16069.64 + (180000 - 175735.67) * 17.92% = 16833.78
      const r = lib.calcularISRAnual(180000);
      expect(r.isrAnual).toBeCloseTo(16833.78, 1);
    });

    test('exenta el aguinaldo hasta 30 UMA (117.31 x 30)', () => {
      const r = lib.calcularISRAnual(200000, { exentoAguinaldo: 10000 });
      expect(r.aguinaldoExento).toBeCloseTo(3519.3, 2);
    });

    test('ingreso cero no produce NaN', () => {
      expect(lib.calcularISRAnual(0).tasaEfectiva).toBe(0);
    });
  });

  describe('obtenerTarifasISR', () => {
    test('retorna las tarifas 2026 con 11 renglones y UMA 2026', () => {
      const t = lib.obtenerTarifasISR();
      expect(t.año).toBe(2026);
      expect(t.tarifas).toHaveLength(11);
      expect(t.tarifasAnuales).toHaveLength(11);
      expect(t.uma.diaria).toBe(117.31);
      expect(t.limitesExencion.indemnizacionPorAnioServicio).toBeCloseTo(10557.9, 2);
    });
  });

  describe('calcularISRHonorarios', () => {
    test('retiene 10% de los ingresos', () => {
      const r = lib.calcularISRHonorarios(50000, 10000);
      expect(r.retencion).toBe(5000);
    });
  });
});
