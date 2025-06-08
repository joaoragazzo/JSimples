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

export const MVS = (code, output, onComplete = null) => {
  const algorithm = parseMvsToJson(code);
  console.log(algorithm);

  const MAX_ITERATION = 10000;
  const INSTRUCTIONS_PER_FRAME = 1;

  let iterationCounter = 0;
  let instructionPointer = 0;
  let register = algorithm[instructionPointer++];
  let memory = [];
  let stack = [];
  let isIteration = false;
  
  let animationFrameId = null;
  let isRunning = true;

  const findIndexByLabel = (label) =>
    algorithm.findIndex((obj) => obj.label === label);

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

  const pushInStack = (value) => {
    return stack.push(value);
  };

  const loadOnMemory = (address) => {
    memory[address] = popFromStack();
  };

  const executeSoma = () => {
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
  };

  const executeDsvs = () => {
    isIteration = true;
    instructionPointer = findIndexByLabel(register.to);
  };

  const executeDsvf = () => {
    let value = popFromStack();
    if (!value) {
      isIteration = true;
      instructionPointer = findIndexByLabel(register.to);
    }
  };

  const executeCmme = () => {
    let secondValue = popFromStack();
    let firstValue = popFromStack();
    let result = firstValue < secondValue;
    pushInStack(result);
  };

  const executeCmma = () => {
    let secondValue = popFromStack();
    let firstValue = popFromStack();
    let result = firstValue > secondValue;
    pushInStack(result);
  };

  const executeNega = () => {
    let value = popFromStack();
    pushInStack(!value);
  };

  const executeConj = () => {
    let firstValue = popFromStack();
    let secondValue = popFromStack();
    pushInStack(firstValue && secondValue);
  };

  const executeDisj = () => {
    let firstValue = popFromStack();
    let secondValue = popFromStack();
    pushInStack(firstValue || secondValue);
  };

  const executeDivi = () => {
    let secondValue = popFromStack();
    let firstValue = popFromStack();
    pushInStack(firstValue / secondValue);
  };

  const executeEscr = () => {
    let tmp = popFromStack();
    output((prevLogs) => [
      ...prevLogs,
      {
        timestamp: Date.now(),
        type: "info",
        message: tmp,
      },
    ]);
  };

  const executeFrame = () => {
    let instructionsThisFrame = 0;

    while (register && register.instruction !== "FIMP" && isRunning && instructionsThisFrame < INSTRUCTIONS_PER_FRAME) {
      isIteration = false;
      switch (register.instruction) {
        case "INPP": break;
        case "FIMP": break;
        case "NADA": break;
        case "AMEM": malloc(register.parameter); break;
        case "CRVG": loadOnStack(getMemoryValue(register.parameter)); break;
        case "CRCT": loadOnStack(register.parameter); break;
        case "ARZG": loadOnMemory(register.parameter); break;
        case "ESCR": executeEscr(); break;
        case "LEIA": break;
        case "SOMA": executeSoma(); break;
        case "SUBT": executeSubt(); break;
        case "MULT": executeMult(); break;
        case "DIVI": executeDivi(); break;
        case "DSVS": executeDsvs(); break;
        case "DSVF": executeDsvf(); break;
        case "CMME": executeCmme(); break;
        case "CMMA": executeCmma(); break;
        case "NEGA": executeNega(); break;
        case "CONJ": executeConj(); break;
        case "DISJ": executeDisj(); break;
      }
  
      if (!isIteration) instructionPointer++;
      if (isIteration) iterationCounter++;
  
      if (iterationCounter === MAX_ITERATION) return;
  
      register = algorithm[instructionPointer];
      instructionsThisFrame++;
    }

    if (register && register.instruction !== "FIMP" && isRunning) {
      animationFrameId = requestAnimationFrame(executeFrame);
    } else if (onComplete) {
      onComplete();
    }
  }

  const stop = () => {
    isRunning = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  }
  
  animationFrameId = requestAnimationFrame(executeFrame);
  return { stop };
};
