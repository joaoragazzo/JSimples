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
  
  const MAX_ITERATION = 10000;
  let iterationCounter = 0;
  let instructionPointer = 0;
  let register = algorithm[instructionPointer++];
  let memory = [];
  let stack = [];
  let isIteration = false;

  const findIndexByLabel = (label) => algorithm.findIndex(obj => obj.label === label);

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
  }

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

  const executeDsvs = () => {
    isIteration = true;
    instructionPointer = findIndexByLabel(register.to); 
  }

  const executeDsvf = () => {
    let value = popFromStack();
    if (!value) {
      isIteration = true;
      instructionPointer = findIndexByLabel(register.to); 
    }
      
  }

  const executeCmme = () => {
    let secondValue = popFromStack();
    let firstValue = popFromStack();
    let result = firstValue < secondValue;
    pushInStack(result);
  }

  const executeCmma = () => {
    let secondValue = popFromStack();
    let firstValue = popFromStack();
    let result = firstValue > secondValue;
    pushInStack(result);
  }

  const executeNega = () => {
    let value = popFromStack();
    pushInStack(!value);
  }

  const executeConj = () => {
    let firstValue = popFromStack();
    let secondValue = popFromStack();
    pushInStack(firstValue && secondValue);
  }

  const executeDisj = () => {
    let firstValue = popFromStack();
    let secondValue = popFromStack();
    pushInStack(firstValue || secondValue)
  }

  const executeDivi = () => {
    let secondValue = popFromStack();
    let firstValue = popFromStack();
    pushInStack(firstValue / secondValue);
  }

  const executeEscr = () => {
    let tmp = popFromStack();
    console.log(tmp);
  }


  while (register.instruction !== "FIMP") {
    isIteration = false;
    switch (register.instruction) {
      case "INPP": // Inicia programa
        break;
      case "FIMP":
        break;
      case "NADA": // Não faz nada
        break;

      /* Operações na memória */
      
      case "AMEM": // Aloca memória
        malloc(register.parameter);
        break;
      case "CRVG": // Carrega valor global
        loadOnStack(getMemoryValue(register.parameter));
        break;
      case "CRCT": // Carrega valor na stack
        loadOnStack(register.parameter);
        break;
      case "ARZG": // Armazena valor global
        loadOnMemory(register.parameter);
        break;

      /* Operações de IO */

      case "ESCR": // Escreva
        executeEscr();
        break;
      case "LEIA":
        break;
      
      /* Operações matemáticas */

      case "SOMA": // Executa soma nos dois valores da stack
        executeSum();
        break;
      case "SUBT": // Executa subtração nos dois valores da stack
        executeSubt();
        break;
      case "MULT": // Executa multiplicação nos dois valores da stack
        executeMult();
        break;
      case "DIVI":
        executeDivi();
        break;

      /* Operações de desvio */

      case "DSVS": // Desvia incondicionalmente
        executeDsvs();
        break;
      case "DSVF": // Desvia se falso
        executeDsvf();
        break;
      case "CMME": // Compara se maior
        executeCmme();
        break;
      case "CMMA": // Compara se menor
        executeCmma();
        break;

      /* Operações boleanas */

      case "NEGA": // Nega o valor na stack
        executeNega();
        break;
      case "CONJ": // Realiza a operação "E"
        executeConj();
        break;
      case "DISJ": // Realiza a operação "OU"
        executeDisj();
        break;
      
      
    }

    if (!isIteration)
      instructionPointer++;
    
    if (isIteration)
      iterationCounter++;
    
    if (iterationCounter === MAX_ITERATION) 
      return;

    register = algorithm[instructionPointer]

  }

  return code;
};
