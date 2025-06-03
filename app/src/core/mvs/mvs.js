const parseMvsToJson = (code) => {
  const instructions = code
    .replace(/\t/g, " ")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");

  const parsed = [];

  for (const line of instructions) {
    const parts = line.split(/\s+/);

    let label = null;
    let instruction = null;
    let parameter = null;
    let to = null;

    if (parts.length === 1) {
      instruction = parts[0];
    } else if (parts.length === 2) {
      if (/^L\d+$/i.test(parts[0])) {
        label = parts[0];
        instruction = parts[1];
      } else if (/^L\d+$/i.test(parts[1])) {
        instruction = parts[0];
        to = parts[1];
      } else if (/^\d+$/.test(parts[0])) {
        parameter = parseInt(parts[0]);
        instruction = parts[1];
      } else if (/^\d+$/.test(parts[1])) {
        instruction = parts[0];
        parameter = parseInt(parts[1]);
      } else {
        instruction = parts[0];
      }
    } else if (parts.length === 3) {
      if (/^L\d+$/i.test(parts[0])) {
        label = parts[0];
      }
      instruction = parts[1];

      if (/^\d+$/.test(parts[2])) {
        parameter = parseInt(parts[2]);
      } else if (/^L\d+$/i.test(parts[2])) {
        to = parts[2];
      }
    }

    parsed.push({
      label,
      instruction,
      to,
      parameter,
    });
  }
  return parsed;
};

export const MVS = (code) => {
  const algorithm = parseMvsToJson(code);
  console.log(algorithm);
  let instructionPointer = 0;
  let register = algorithm[instructionPointer++];
  let memory = [];
  let stack = [];

  const malloc = (size) => {
    memory = new Array(size).fill(0);
  };

  const loadOnStack = (value) => {
    stack.push(value);
  };

  const getMemoryValue = (address) => {
    return memory[address];
  };

  const popFromStack = () => {
    return stack.pop();
  };

  const loadOnMemory = (address) => {
    memory[address] = popFromStack();
  };

  const executeSum = () => {
    /* Invertido devido a ordem que os valores são empilhados */
    let secondValue = popFromStack();
    let firstValue = popFromStack();
    loadOnStack(firstValue + secondValue);
  };

  const executeSubt = () => {
    /* Invertido devido a ordem que os valores são empilhados */
    let secondValue = popFromStack();
    let firstValue = popFromStack();
    loadOnStack(firstValue - secondValue);
  };

  const executeMult = () => {
    let secondValue = popFromStack();
    let firstValue = popFromStack();
    loadOnStack(firstValue * secondValue);
  }

  while (register.instruction !== "FIMP") {
    switch (register.instruction) {
      case "INPP":
        break;
      case "AMEM":
        malloc(register.parameter);
        break;
      case "CRVG":
        loadOnStack(getMemoryValue(register.parameter));
        break;
      case "ESCR":
        let tmp = popFromStack();
        console.log(tmp);
        break;
      case "CRCT":
        loadOnStack(register.parameter);
        break;
      case "ARZG":
        loadOnMemory(register.parameter);
        break;
      case "SOMA":
        executeSum();
        break;
      case "SUBT":
        executeSubt();
        break;
      case "MULT":
        executeMult();
        break;  
    }

    register = algorithm[instructionPointer++];
  }

  return code;
};
