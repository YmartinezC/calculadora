(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.CalcLogic = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  function fmt(n) {
    if (!isFinite(n)) return "Error";
    var s = String(Math.round(n * 1e10) / 1e10);
    if (s.length > 16) s = Number(n).toExponential(6);
    return s;
  }

  function applyOp(a, b, op) {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return b === 0 ? NaN : a / b;
      default: return b;
    }
  }

  var fxRates = {
    USD: { label: "Dólar estadounidense", rate: 1 },
    EUR: { label: "Euro", rate: 0.92 },
    GBP: { label: "Libra esterlina", rate: 0.78 },
    JPY: { label: "Yen japonés", rate: 157.0 },
    PEN: { label: "Sol peruano", rate: 3.75 },
    MXN: { label: "Peso mexicano", rate: 18.3 },
    ARS: { label: "Peso argentino", rate: 915.0 },
    COP: { label: "Peso colombiano", rate: 4100.0 },
    CLP: { label: "Peso chileno", rate: 945.0 },
    BRL: { label: "Real brasileño", rate: 5.55 },
    CNY: { label: "Yuan chino", rate: 7.25 },
    CAD: { label: "Dólar canadiense", rate: 1.37 },
    CHF: { label: "Franco suizo", rate: 0.88 }
  };

  function convertFx(amount, fromCode, toCode, rates) {
    rates = rates || fxRates;
    var from = rates[fromCode];
    var to = rates[toCode];
    if (!from || !to || isNaN(amount)) return NaN;
    var usd = amount / from.rate;
    return usd * to.rate;
  }

  var unitCategories = {
    length: { label: "Longitud", base: "m", units: {
      m: { label: "Metros", f: 1 }, km: { label: "Kilómetros", f: 1000 },
      cm: { label: "Centímetros", f: 0.01 }, mm: { label: "Milímetros", f: 0.001 },
      mi: { label: "Millas", f: 1609.344 }, yd: { label: "Yardas", f: 0.9144 },
      ft: { label: "Pies", f: 0.3048 }, in: { label: "Pulgadas", f: 0.0254 }
    }},
    weight: { label: "Peso / Masa", base: "kg", units: {
      kg: { label: "Kilogramos", f: 1 }, g: { label: "Gramos", f: 0.001 },
      mg: { label: "Miligramos", f: 0.000001 }, lb: { label: "Libras", f: 0.45359237 },
      oz: { label: "Onzas", f: 0.0283495231 }, ton: { label: "Toneladas", f: 1000 }
    }},
    volume: { label: "Volumen", base: "l", units: {
      l: { label: "Litros", f: 1 }, ml: { label: "Mililitros", f: 0.001 },
      gal: { label: "Galones (US)", f: 3.785411784 }, qt: { label: "Cuartos (US)", f: 0.946352946 },
      pt: { label: "Pintas (US)", f: 0.473176473 }, cup: { label: "Tazas (US)", f: 0.2365882365 }
    }},
    temp: { label: "Temperatura", base: "c", units: {
      c: { label: "Celsius" }, f: { label: "Fahrenheit" }, k: { label: "Kelvin" }
    }},
    speed: { label: "Velocidad", base: "kmh", units: {
      kmh: { label: "Km/h", f: 1 }, mph: { label: "Millas/h", f: 1.609344 },
      ms: { label: "m/s", f: 3.6 }, knot: { label: "Nudos", f: 1.852 }
    }},
    area: { label: "Área", base: "m2", units: {
      m2: { label: "Metros²", f: 1 }, km2: { label: "Kilómetros²", f: 1000000 },
      ha: { label: "Hectáreas", f: 10000 }, ft2: { label: "Pies²", f: 0.09290304 },
      acre: { label: "Acres", f: 4046.8564224 }
    }}
  };

  function convertTemp(value, from, to) {
    var c;
    if (from === "c") c = value;
    else if (from === "f") c = (value - 32) * 5 / 9;
    else c = value - 273.15;
    if (to === "c") return c;
    if (to === "f") return c * 9 / 5 + 32;
    return c + 273.15;
  }

  function convertUnits(amount, categoryKey, fromUnit, toUnit, categories) {
    categories = categories || unitCategories;
    var cat = categories[categoryKey];
    if (!cat || isNaN(amount)) return NaN;
    if (categoryKey === "temp") return convertTemp(amount, fromUnit, toUnit);
    var from = cat.units[fromUnit];
    var to = cat.units[toUnit];
    if (!from || !to) return NaN;
    var base = amount * from.f;
    return base / to.f;
  }

  return {
    fmt: fmt, applyOp: applyOp, fxRates: fxRates, convertFx: convertFx,
    unitCategories: unitCategories, convertTemp: convertTemp, convertUnits: convertUnits
  };
});
