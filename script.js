(function(){
  "use strict";

  var tabs = document.querySelectorAll(".tab");
  var panes = { calc:document.getElementById("pane-calc"), fx:document.getElementById("pane-fx"), units:document.getElementById("pane-units") };
  tabs.forEach(function(t){
    t.addEventListener("click", function(){
      tabs.forEach(function(x){ x.classList.remove("active"); });
      t.classList.add("active");
      Object.keys(panes).forEach(function(k){ panes[k].classList.remove("active"); });
      panes[t.dataset.tab].classList.add("active");
    });
  });

  var calcMain = document.getElementById("calc-main");
  var calcSub = document.getElementById("calc-sub");
  var state = { display:"0", prev:null, op:null, resetNext:false, expr:"" };

  function fmt(n){
    if (!isFinite(n)) return "Error";
    var s = String(Math.round(n * 1e10) / 1e10);
    if (s.length > 16) s = Number(n).toExponential(6);
    return s;
  }

  function render(){
    calcMain.textContent = state.display;
    calcSub.textContent = state.expr || "\u00A0";
  }

  function inputDigit(d){
    if (state.resetNext){
      state.display = (d === ".") ? "0." : d;
      state.resetNext = false;
      return;
    }
    if (d === "."){
      if (state.display.indexOf(".") !== -1) return;
      state.display += ".";
      return;
    }
    if (state.display === "0") state.display = d;
    else state.display += d;
  }

  function applyOp(a,b,op){
    switch(op){
      case "+": return a+b;
      case "-": return a-b;
      case "*": return a*b;
      case "/": return b === 0 ? NaN : a/b;
      default: return b;
    }
  }

  function pressOp(op){
    var cur = parseFloat(state.display);
    if (state.op && !state.resetNext){
      var result = applyOp(state.prev, cur, state.op);
      state.prev = result;
      state.display = fmt(result);
    } else {
      state.prev = cur;
    }
    state.op = op;
    state.resetNext = true;
    var opSym = {"+":"+","-":"−","*":"×","/":"÷"}[op];
    state.expr = fmt(state.prev) + " " + opSym;
  }

  function pressEquals(){
    if (state.op === null) return;
    var cur = parseFloat(state.display);
    var result = applyOp(state.prev, cur, state.op);
    state.expr = fmt(state.prev) + " " + {"+":"+","-":"−","*":"×","/":"÷"}[state.op] + " " + fmt(cur) + " =";
    state.display = fmt(result);
    state.prev = null;
    state.op = null;
    state.resetNext = true;
  }

  function pressClear(){
    state = { display:"0", prev:null, op:null, resetNext:false, expr:"" };
  }

  function pressBack(){
    if (state.resetNext) return;
    if (state.display.length <= 1){ state.display = "0"; return; }
    state.display = state.display.slice(0,-1);
    if (state.display === "" || state.display === "-") state.display = "0";
  }

  function pressPercent(){
    var cur = parseFloat(state.display);
    state.display = fmt(cur/100);
  }

  document.getElementById("calc-keys").addEventListener("click", function(e){
    var btn = e.target.closest(".key");
    if (!btn) return;
    var k = btn.dataset.k;
    if (/^[0-9]$/.test(k)) inputDigit(k);
    else if (k === ".") inputDigit(".");
    else if (["+","-","*","/"].indexOf(k) !== -1) pressOp(k);
    else if (k === "=") pressEquals();
    else if (k === "clear") pressClear();
    else if (k === "back") pressBack();
    else if (k === "percent") pressPercent();
    render();
  });

  document.addEventListener("keydown", function(e){
    if (!panes.calc.classList.contains("active")) return;
    var k = e.key;
    if (/^[0-9]$/.test(k)) { inputDigit(k); render(); }
    else if (k === ".") { inputDigit("."); render(); }
    else if (["+","-","*","/"].indexOf(k) !== -1) { pressOp(k); render(); }
    else if (k === "Enter" || k === "=") { pressEquals(); render(); }
    else if (k === "Backspace") { pressBack(); render(); }
    else if (k === "Escape") { pressClear(); render(); }
  });

  render();

  var fxRates = {
    "USD": { label:"Dólar estadounidense", rate:1 },
    "EUR": { label:"Euro", rate:0.92 },
    "GBP": { label:"Libra esterlina", rate:0.78 },
    "JPY": { label:"Yen japonés", rate:157.0 },
    "PEN": { label:"Sol peruano", rate:3.75 },
    "MXN": { label:"Peso mexicano", rate:18.3 },
    "ARS": { label:"Peso argentino", rate:915.0 },
    "COP": { label:"Peso colombiano", rate:4100.0 },
    "CLP": { label:"Peso chileno", rate:945.0 },
    "BRL": { label:"Real brasileño", rate:5.55 },
    "CNY": { label:"Yuan chino", rate:7.25 },
    "CAD": { label:"Dólar canadiense", rate:1.37 },
    "CHF": { label:"Franco suizo", rate:0.88 }
  };

  var fxFrom = document.getElementById("fx-from");
  var fxTo = document.getElementById("fx-to");
  var fxAmount = document.getElementById("fx-amount");
  var fxResult = document.getElementById("fx-result");
  var fxSub = document.getElementById("fx-sub");

  Object.keys(fxRates).forEach(function(code){
    var o1 = document.createElement("option");
    o1.value = code; o1.textContent = code + " · " + fxRates[code].label;
    fxFrom.appendChild(o1);
    var o2 = o1.cloneNode(true);
    fxTo.appendChild(o2);
  });
  fxFrom.value = "USD";
  fxTo.value = "PEN";

  function calcFx(){
    var amt = parseFloat(fxAmount.value);
    if (isNaN(amt)) { fxResult.textContent = "0.00"; fxSub.textContent = "Ingresa una cantidad"; return; }
    var from = fxRates[fxFrom.value];
    var to = fxRates[fxTo.value];
    var usd = amt / from.rate;
    var out = usd * to.rate;
    fxResult.textContent = out.toLocaleString("es", {maximumFractionDigits:4});
    fxSub.textContent = amt.toLocaleString("es") + " " + fxFrom.value + " =";
  }

  [fxAmount, fxFrom, fxTo].forEach(function(el){ el.addEventListener("input", calcFx); });
  document.getElementById("fx-swap").addEventListener("click", function(){
    var tmp = fxFrom.value; fxFrom.value = fxTo.value; fxTo.value = tmp;
    calcFx();
  });
  calcFx();

  var unitCategories = {
    length: {
      label:"Longitud",
      base:"m",
      units:{
        m:{label:"Metros", f:1},
        km:{label:"Kilómetros", f:1000},
        cm:{label:"Centímetros", f:0.01},
        mm:{label:"Milímetros", f:0.001},
        mi:{label:"Millas", f:1609.344},
        yd:{label:"Yardas", f:0.9144},
        ft:{label:"Pies", f:0.3048},
        in:{label:"Pulgadas", f:0.0254}
      }
    },
    weight: {
      label:"Peso / Masa",
      base:"kg",
      units:{
        kg:{label:"Kilogramos", f:1},
        g:{label:"Gramos", f:0.001},
        mg:{label:"Miligramos", f:0.000001},
        lb:{label:"Libras", f:0.45359237},
        oz:{label:"Onzas", f:0.0283495231},
        ton:{label:"Toneladas", f:1000}
      }
    },
    volume: {
      label:"Volumen",
      base:"l",
      units:{
        l:{label:"Litros", f:1},
        ml:{label:"Mililitros", f:0.001},
        gal:{label:"Galones (US)", f:3.785411784},
        qt:{label:"Cuartos (US)", f:0.946352946},
        pt:{label:"Pintas (US)", f:0.473176473},
        cup:{label:"Tazas (US)", f:0.2365882365}
      }
    },
    temp: {
      label:"Temperatura",
      base:"c",
      units:{
        c:{label:"Celsius"},
        f:{label:"Fahrenheit"},
        k:{label:"Kelvin"}
      }
    },
    speed: {
      label:"Velocidad",
      base:"kmh",
      units:{
        kmh:{label:"Km/h", f:1},
        mph:{label:"Millas/h", f:1.609344},
        ms:{label:"m/s", f:3.6},
        knot:{label:"Nudos", f:1.852}
      }
    },
    area: {
      label:"Área",
      base:"m2",
      units:{
        m2:{label:"Metros²", f:1},
        km2:{label:"Kilómetros²", f:1000000},
        ha:{label:"Hectáreas", f:10000},
        ft2:{label:"Pies²", f:0.09290304},
        acre:{label:"Acres", f:4046.8564224}
      }
    }
  };

  var uCategory = document.getElementById("u-category");
  var uFrom = document.getElementById("u-from");
  var uTo = document.getElementById("u-to");
  var uAmount = document.getElementById("u-amount");
  var uResult = document.getElementById("u-result");
  var uSub = document.getElementById("u-sub");

  Object.keys(unitCategories).forEach(function(key){
    var o = document.createElement("option");
    o.value = key; o.textContent = unitCategories[key].label;
    uCategory.appendChild(o);
  });

  function populateUnitSelects(){
    var cat = unitCategories[uCategory.value];
    uFrom.innerHTML = "";
    uTo.innerHTML = "";
    Object.keys(cat.units).forEach(function(code){
      var o1 = document.createElement("option");
      o1.value = code; o1.textContent = cat.units[code].label;
      uFrom.appendChild(o1);
      var o2 = o1.cloneNode(true);
      uTo.appendChild(o2);
    });
    var keys = Object.keys(cat.units);
    uFrom.value = keys[0];
    uTo.value = keys[1] || keys[0];
  }

  function convertTemp(value, from, to){
    var c;
    if (from === "c") c = value;
    else if (from === "f") c = (value - 32) * 5/9;
    else c = value - 273.15;

    if (to === "c") return c;
    if (to === "f") return c * 9/5 + 32;
    return c + 273.15;
  }

  function calcUnits(){
    var cat = unitCategories[uCategory.value];
    var amt = parseFloat(uAmount.value);
    if (isNaN(amt)) { uResult.textContent = "0"; uSub.textContent = "Ingresa una cantidad"; return; }

    var out;
    if (uCategory.value === "temp"){
      out = convertTemp(amt, uFrom.value, uTo.value);
    } else {
      var fromUnit = cat.units[uFrom.value];
      var toUnit = cat.units[uTo.value];
      var base = amt * fromUnit.f;
      out = base / toUnit.f;
    }
    uResult.textContent = out.toLocaleString("es", {maximumFractionDigits:6});
    uSub.textContent = amt.toLocaleString("es") + " " + cat.units[uFrom.value].label + " =";
  }

  uCategory.addEventListener("change", function(){ populateUnitSelects(); calcUnits(); });
  [uAmount, uFrom, uTo].forEach(function(el){ el.addEventListener("input", calcUnits); });
  document.getElementById("u-swap").addEventListener("click", function(){
    var tmp = uFrom.value; uFrom.value = uTo.value; uTo.value = tmp;
    calcUnits();
  });

  populateUnitSelects();
  calcUnits();

})();
