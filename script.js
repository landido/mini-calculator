const currentDisplay = document.querySelector("#current");
const historyDisplay = document.querySelector("#history");
const keys = document.querySelector(".keys");

const state = {
  current: "0",
  previous: null,
  operator: null,
  shouldResetDisplay: false,
};

const symbols = {
  "+": "+",
  "-": "-",
  "*": "x",
  "/": "/",
};

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return "Error";
  }

  const rounded = Number.parseFloat(value.toFixed(10));
  return rounded.toLocaleString("en-US", {
    maximumFractionDigits: 10,
  });
}

function parseDisplayValue(value) {
  return Number(value.replaceAll(",", ""));
}

function updateDisplay() {
  currentDisplay.value = state.current;
  currentDisplay.textContent = state.current;
  historyDisplay.textContent =
    state.operator && state.previous !== null
      ? `${state.previous} ${symbols[state.operator]}`
      : "";
}

function inputNumber(number) {
  if (state.current === "Error" || state.shouldResetDisplay) {
    state.current = number;
    state.shouldResetDisplay = false;
    updateDisplay();
    return;
  }

  if (state.current === "0") {
    state.current = number;
  } else {
    state.current += number;
  }

  updateDisplay();
}

function inputDecimal() {
  if (state.current === "Error" || state.shouldResetDisplay) {
    state.current = "0.";
    state.shouldResetDisplay = false;
    updateDisplay();
    return;
  }

  if (!state.current.includes(".")) {
    state.current += ".";
  }

  updateDisplay();
}

function chooseOperator(operator) {
  if (state.current === "Error") {
    clearCalculator();
    return;
  }

  if (state.operator && !state.shouldResetDisplay) {
    calculate();
  }

  state.previous = state.current;
  state.operator = operator;
  state.shouldResetDisplay = true;
  updateDisplay();
}

function calculate() {
  if (!state.operator || state.previous === null || state.current === "Error") {
    return;
  }

  const previous = parseDisplayValue(state.previous);
  const current = parseDisplayValue(state.current);
  let result;

  switch (state.operator) {
    case "+":
      result = previous + current;
      break;
    case "-":
      result = previous - current;
      break;
    case "*":
      result = previous * current;
      break;
    case "/":
      result = current === 0 ? Number.NaN : previous / current;
      break;
    default:
      return;
  }

  state.current = formatNumber(result);
  state.previous = null;
  state.operator = null;
  state.shouldResetDisplay = true;
  updateDisplay();
}

function clearCalculator() {
  state.current = "0";
  state.previous = null;
  state.operator = null;
  state.shouldResetDisplay = false;
  updateDisplay();
}

function toggleSign() {
  if (state.current === "0" || state.current === "Error") {
    return;
  }

  state.current = state.current.startsWith("-")
    ? state.current.slice(1)
    : `-${state.current}`;
  updateDisplay();
}

function percent() {
  if (state.current === "Error") {
    return;
  }

  state.current = formatNumber(parseDisplayValue(state.current) / 100);
  updateDisplay();
}

function deleteLastDigit() {
  if (state.current === "Error" || state.shouldResetDisplay) {
    clearCalculator();
    return;
  }

  state.current = state.current.length > 1 ? state.current.slice(0, -1) : "0";
  updateDisplay();
}

keys.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  if (button.dataset.number) {
    inputNumber(button.dataset.number);
  } else if (button.dataset.operator) {
    chooseOperator(button.dataset.operator);
  } else if (button.dataset.action === "decimal") {
    inputDecimal();
  } else if (button.dataset.action === "equals") {
    calculate();
  } else if (button.dataset.action === "clear") {
    clearCalculator();
  } else if (button.dataset.action === "sign") {
    toggleSign();
  } else if (button.dataset.action === "percent") {
    percent();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key >= "0" && event.key <= "9") {
    inputNumber(event.key);
  } else if (["+", "-", "*", "/"].includes(event.key)) {
    chooseOperator(event.key);
  } else if (event.key === "." || event.key === ",") {
    inputDecimal();
  } else if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    calculate();
  } else if (event.key === "Backspace") {
    deleteLastDigit();
  } else if (event.key === "Escape") {
    clearCalculator();
  } else if (event.key === "%") {
    percent();
  }
});

updateDisplay();
