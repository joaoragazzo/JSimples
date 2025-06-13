import { createContext, useContext, useEffect, useRef, useState } from "react";
import simples from "@/core/compiler/simples.js";
import { MVS } from "@/core/mvs/mvs.js";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [code, setCode] = useState(
    "programa teste\n\tinteiro a b\n\tlogico c d\ninicio\n\ta <- 1\n\ta <- a * 3\n\tescreva a\nfimprograma"
  );
  const [logs, setLogs] = useState([]);
  const [mvsState, setMvsState] = useState({stack:[], instructionPointer: 0});
  const [waitingInput, setWaitingInput] = useState(false);
  const inputCallbackRef = useRef(null);
  const vmRef = useRef(null);
  const [tab, setTab] = useState("terminal");
  const [isRunning, setIsRunning] = useState(false);
  const mvsRef = useRef(null);

  const [completeSyntaxTree, setCompleteSyntaxTree] = useState({});
  const [simplifiedSyntaxTree, setSimplifiedSyntaxTree] = useState({});

  const [parserResponse, setParserResponse] = useState({
    syntaxTree: {},
  });

  const removeIgnoreNodes = (node) => {
    if (!node) {
      return null;
    }

    if (node.name === "IGNORE") {
      return null;
    }

    if (!node.children || node.children.length === 0) {
      return node;
    }

    node.children = node.children
      .map((child) => removeIgnoreNodes(child))
      .filter((child) => child !== null);

    if (node.children.length === 0) {
      delete node.children;
    }

    return node;
  };

  const compressSingleChildNodes = (node) => {
    if (!node) {
      return null;
    }

    if (!node.children || node.children.length === 0) {
      return node;
    }

    node.children = node.children
      .map((child) => compressSingleChildNodes(child))
      .filter((child) => child !== null);

    if (node.children.length === 0) {
      delete node.children;
      return node;
    }

    if (node.children.length === 1) {
      const onlyChild = node.children[0];
      return onlyChild;
    }

    return node;
  };

  const parse = () => {
    try {
      const response = simples.parse(code);
      setParserResponse(response);

      console.log(response);

      const syntaxTree = removeIgnoreNodes(response.syntaxTree);
      setCompleteSyntaxTree(syntaxTree);

      const treeToCompress = JSON.parse(JSON.stringify(syntaxTree));
      setSimplifiedSyntaxTree(compressSingleChildNodes(treeToCompress));
    } catch (e) {
      setLogs((prevLogs) => [
        ...prevLogs,
        {
          timestamp: Date.now(),
          type: "error",
          message: `${e.message}`,
        },
      ]);
    }
  };

  const runAlgorithm = () => {
    try {
      const response = simples.parse(code);
      setParserResponse(response);
      setIsRunning(true);
      mvsRef.current = MVS(response.mvs, setLogs, requestInput, () => {
        setIsRunning(false);
      });
    } catch (e) {
      console.log(e);
      setLogs((prevLogs) => [
        ...prevLogs,
        {
          timestamp: Date.now(),
          type: "error",
          message: `${e.message}`,
        },
      ]);
    }
  };

  const stopAlgorithm = () => {
    if (mvsRef.current?.stop) {
      mvsRef.current.stop();
      setIsRunning(false);
    }
  };

  const requestInput = () => {
    return new Promise((resolve) => {
      setWaitingInput(true);
      inputCallbackRef.current = (value) => {
        resolve(parseInt(value));
        setWaitingInput(false);
      };
    });
  };

  const runMvsStepByStep = () => {
    const vm = MVS(parserResponse.mvs, setLogs, requestInput, () => {
      setIsRunning(false);
    }, true);
    const data = vm.start();
    setMvsState(data);
    vmRef.current = vm;
  }
  
  useEffect(() => {
    console.log(mvsState);
  }, [mvsState])

  return (
    <AppContext.Provider
      value={{
        code,
        setCode,

        parserResponse,
        parse,

        completeSyntaxTree,
        simplifiedSyntaxTree,

        logs,
        setLogs,

        runAlgorithm,

        tab,
        setTab,

        isRunning,
        stopAlgorithm,

        waitingInput,
        setWaitingInput,

        inputCallbackRef,
        requestInput,

        vmRef,
        runMvsStepByStep,

        setMvsState,
        mvsState
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppData = () => useContext(AppContext);
