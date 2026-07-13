/**
 * calculadora.test.js
 * ---------------------------------------------------------
 * Pruebas unitarias del módulo calculadora-logic.js
 * Framework: Jest
 * Cobertura: Calculadora, Conversor de Monedas, Conversor de Medidas
 * ---------------------------------------------------------
 */
const {
  fmt,
  applyOp,
  fxRates,
  convertFx,
  unitCategories,
  convertTemp,
  convertUnits
} = require("./calculadora-logic");

describe("Módulo Calculadora", () => {
  test("applyOp suma correctamente dos números", () => {
    expect(applyOp(5, 3, "+")).toBe(8);
  });

  test("applyOp resta correctamente dos números", () => {
    expect(applyOp(10, 4, "-")).toBe(6);
  });

  test("applyOp multiplica correctamente dos números", () => {
    expect(applyOp(6, 7, "*")).toBe(42);
  });

  test("applyOp divide correctamente dos números", () => {
    expect(applyOp(20, 4, "/")).toBe(5);
  });

  test("applyOp devuelve NaN al dividir entre cero", () => {
    expect(applyOp(10, 0, "/")).toBeNaN();
  });

  test("fmt formatea un número entero como string", () => {
    expect(fmt(8)).toBe("8");
  });

  test("fmt redondea decimales largos", () => {
    expect(fmt(1 / 3)).toBe("0.3333333333");
  });

  test("fmt devuelve 'Error' para valores no finitos (Infinity/NaN)", () => {
    expect(fmt(Infinity)).toBe("Error");
    expect(fmt(NaN)).toBe("Error");
  });
});

describe("Módulo Conversor de Monedas", () => {
  test("convertFx devuelve el mismo monto si la moneda de origen y destino son iguales", () => {
    expect(convertFx(100, "USD", "USD")).toBeCloseTo(100);
  });

  test("convertFx convierte de USD a PEN usando la tasa fija", () => {
    expect(convertFx(1, "USD", "PEN")).toBeCloseTo(3.75, 2);
  });

  test("convertFx convierte de PEN a USD (conversión inversa)", () => {
    expect(convertFx(3.75, "PEN", "USD")).toBeCloseTo(1, 2);
  });

  test("convertFx devuelve NaN si el código de moneda no existe", () => {
    expect(convertFx(100, "XXX", "USD")).toBeNaN();
  });
});

describe("Módulo Conversor de Medidas", () => {
  test("convertUnits convierte kilómetros a metros", () => {
    expect(convertUnits(1, "length", "km", "m")).toBe(1000);
  });

  test("convertUnits convierte libras a kilogramos", () => {
    expect(convertUnits(1, "weight", "lb", "kg")).toBeCloseTo(0.4536, 3);
  });

  test("convertUnits convierte litros a mililitros", () => {
    expect(convertUnits(2, "volume", "l", "ml")).toBe(2000);
  });

  test("convertTemp convierte 0°C a 32°F", () => {
    expect(convertTemp(0, "c", "f")).toBeCloseTo(32);
  });

  test("convertTemp convierte 100°C a 373.15 Kelvin", () => {
    expect(convertTemp(100, "c", "k")).toBeCloseTo(373.15);
  });

  test("convertUnits delega correctamente a convertTemp cuando la categoría es 'temp'", () => {
    expect(convertUnits(25, "temp", "c", "f")).toBeCloseTo(77);
  });
});