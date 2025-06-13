export const MVS = (
  code,
  output,
  input,
  onComplete = null,
  stepByStep = false
) => {
  const algorithm = code;
  console.log(code);
  const MAX_ITERATION = 10000;
  const INSTRUCTIONS_PER_FRAME = stepByStep ? 1 : 1;

  let iterationCounter = 0;
  let instructionPointer = 0;
  let register = algorithm[instructionPointer];
  let memory = [];
  let stack = [];
  let isIteration = false;
  let isWaitingInput = false;

  let animationFrameId = null;
  let isRunning = true;

  let waitingNextStep = false;
  let continueExecution = null;

  const findIndexByLabel = (label) => {
    let index = algorithm.findIndex((obj) => obj.label === label);
    console.log(algorithm);
    console.log(`To index: ${index}`);
    return index;
  }
    

  const executeAmem = () => {
    memory = new Array(register.parameter).fill(0);
  }

  const executeCrvg = () => {
    stack.push(memory[register.parameter]);
  };

  const executeCrct = () => {
    stack.push(register.parameter);
  };

  const executeArzg = () => {
    memory[register.parameter] = stack.pop();
  };

  const executeSoma = () => {
    let secondValue = stack.pop();
    let firstValue = stack.pop();
    stack.push(firstValue + secondValue);
  };

  const executeSubt = () => {
    let secondValue = stack.pop();
    let firstValue = stack.pop();
    stack.push(firstValue - secondValue);
  };

  const executeMult = () => {
    let secondValue = stack.pop();
    let firstValue = stack.pop();
    stack.push(firstValue * secondValue);
  };

  const executeDsvs = () => {
    isIteration = true;
    instructionPointer = findIndexByLabel(register.parameter);
  };

  const executeDsvf = () => {
    let value = stack.pop();
    if (!value) {
      isIteration = true;
      instructionPointer = findIndexByLabel(register.parameter);
    }
  };

  const executeCmme = () => {
    let secondValue = stack.pop();
    let firstValue = stack.pop();
    let result = firstValue < secondValue;
    stack.push(result);
  };

  const executeCmma = () => {
    let secondValue = stack.pop();
    let firstValue = stack.pop();
    let result = firstValue > secondValue;
    stack.push(result);
  };

  const executeNega = () => {
    let value = stack.pop();
    stack.push(!value);
  };

  const executeConj = () => {
    let firstValue = stack.pop();
    let secondValue = stack.pop();
    stack.push(firstValue && secondValue);
  };

  const executeDisj = () => {
    let firstValue = stack.pop();
    let secondValue = stack.pop();
    stack.push(firstValue || secondValue);
  };

  const executeDivi = () => {
    let secondValue = stack.pop();
    let firstValue = stack.pop();
    stack.push(firstValue / secondValue);
  };

  const executeEscr = () => {
    let tmp = stack.pop();
    output("info", tmp);
  };

  const executeLeia = async () => {
    output("info", "Esperando entrada do usuário...");
    isWaitingInput = true;
    const value = await input();
    stack.push(value);
    isWaitingInput = false;
    register = algorithm[++instructionPointer];
    
    if (stepByStep) {
      return;
    } else {
      animationFrameId = requestAnimationFrame(executeFrame);
    }
  };

  const executeDmem = () => {
    memory = [];
  }

  const executeFrame = async () => {
    if (isWaitingInput || !isRunning) {
      if (!stepByStep) {
        animationFrameId = requestAnimationFrame(executeFrame);
      }
      return;
    }

    let instructionsThisFrame = 0;
    while (
      register &&
      register.instruction !== "FIMP" &&
      isRunning &&
      instructionsThisFrame < INSTRUCTIONS_PER_FRAME
    ) {
      isIteration = false;
      switch (register.instruction) {
        case "INPP":
          break;
        case "FIMP":
          break;
        case "NADA":
          break;
        case "AMEM":
          executeAmem();
          break;
        case "CRVG":
          executeCrvg();
          break;
        case "CRCT":
          executeCrct();
          break;
        case "ARZG":
          executeArzg();
          break;
        case "ESCR":
          executeEscr();
          break;
        case "LEIA":
          await executeLeia();
          if (stepByStep) return; 
          return;
        case "SOMA":
          executeSoma();
          break;
        case "SUBT":
          executeSubt();
          break;
        case "MULT":
          executeMult();
          break;
        case "DIVI":
          executeDivi();
          break;
        case "DSVS":
          executeDsvs();
          break;
        case "DSVF":
          executeDsvf();
          break;
        case "CMME":
          executeCmme();
          break;
        case "CMMA":
          executeCmma();
          break;
        case "NEGA":
          executeNega();
          break;
        case "CONJ":
          executeConj();
          break;
        case "DISJ":
          executeDisj();
          break;
        case "DMEM":
          executeDmem();
          break;
      }
      if (!isIteration) instructionPointer++;
      if (isIteration) iterationCounter++;

      if (iterationCounter === MAX_ITERATION) return;

      register = algorithm[instructionPointer];
      instructionsThisFrame++;

      
      if (stepByStep) {
        waitingNextStep = true;
      }
    }

    if (register && register.instruction !== "FIMP" && isRunning) {
      if (!stepByStep) {
        animationFrameId = requestAnimationFrame(executeFrame);
      }
    } else if (onComplete) {
      onComplete();
    }
  };

  const stop = () => {
    isRunning = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    if (waitingNextStep && continueExecution) {
      continueExecution();
    }
  };

  const next = () => {
    if (stepByStep && waitingNextStep && !isWaitingInput) {
      executeFrame();
    }
    console.log({instructionPointer: instructionPointer, stack: stack, memory: memory})  
    return {instructionPointer: instructionPointer, stack: stack, memory: memory};
  };

  const start = () => {
    if (stepByStep) {
      executeFrame();
    } else {
      animationFrameId = requestAnimationFrame(executeFrame);
    }
    return {instructionPointer: instructionPointer, stack: stack, memory: memory};
  };

  if (!stepByStep) {
    animationFrameId = requestAnimationFrame(executeFrame);
  }

  return {
    stop,
    next,
    start
  };
};