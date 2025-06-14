import { createContext, useContext, useEffect, useRef, useState } from "react";
import simples from "@/core/compiler/simples.js";
import { MVS } from "@/core/mvs/mvs.js";
import { notification } from "antd";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();
  
  const vmRef = useRef(null);
  const mvsRef = useRef(null);
  const inputCallbackRef = useRef(null);
  

  const [code, setCode] = useState(
    "programa teste\n\tinteiro a b\n\tlogico c d\ninicio\n\ta <- 1\n\ta <- a * 3\n\tescreva a\nfimprograma"
  );
  const [logs, setLogs] = useState([]);
  const [mvsState, setMvsState] = useState({stack:[], instructionPointer: 0});
  const [waitingInput, setWaitingInput] = useState(false);

  const [tab, setTab] = useState("terminal");
  const [isRunning, setIsRunning] = useState(false);
  
  const [completeSyntaxTree, setCompleteSyntaxTree] = useState({});
  const [simplifiedSyntaxTree, setSimplifiedSyntaxTree] = useState({});
  const [terminalNotification, setTerminalNotification] = useState(false);

  const [parserResponse, setParserResponse] = useState({
    syntaxTree: {},
    mvs: [],
    finished: false,
  });

  const output = (type, content) => {
    setLogs((prevLogs) => [
      ...prevLogs,
      {
        timestamp: Date.now(),
        type: type,
        message: `${content}`,
      },
    ]);
  }

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

  const compile = () => {
    try {
      const response = simples.parse(code);
      response.finished = true;
      setParserResponse(response);

      const syntaxTree = response.syntaxTree
      setCompleteSyntaxTree(syntaxTree);
      const treeToCompress = JSON.parse(JSON.stringify(syntaxTree));
      setSimplifiedSyntaxTree(compressSingleChildNodes(treeToCompress));

      setTimeout(() => {
        if (response.mvs && response.mvs.length > 0) {
          const vm = MVS(response.mvs, output, requestInput, () => {
            setIsRunning(false);
          }, true);
          const data = vm.start();
          setMvsState(data);
          vmRef.current = vm;
        }
      }, 0);
    } catch (e) {
      output("error", e.message);
    }
  }

  const runAlgorithm = () => {
      setIsRunning(true);
      mvsRef.current = MVS(parserResponse.mvs, output, requestInput, () => {
        setIsRunning(false);
      });
  };

  const stopAlgorithm = () => {
    if (mvsRef.current?.stop) {
      mvsRef.current.stop();
      setIsRunning(false);
    }
  };

  const requestInput = () => {
    api.warning({
      message: "Preencha o input necessário no seu terminal",
      description: "Clique aqui para verificar o seu terminal",
      placement: "bottomRight",
      onClick:() => {setTab('terminal')}
    })
    
    return new Promise((resolve) => {
      setWaitingInput(true);
      inputCallbackRef.current = (value) => {
        resolve(parseInt(value));
        setWaitingInput(false);
      };
    });
  };

  const resetVm = () => {
    const vm = MVS(parserResponse.mvs, output, requestInput, () => {
      setIsRunning(false);
    }, true);
    const data = vm.start();
    setMvsState(data);
    vmRef.current = vm;
  }

  useEffect(() => {
    if (tab !== 'terminal') {
      setTerminalNotification(true);
      api.info({
        message: "Existe uma nova saída no terminal!",
        description: "Clique aqui para verificar o seu terminal",
        placement: "bottomRight",
        onClick:() => {setTab('terminal')}
      })
    }
  }, [logs]);

  useEffect(() => {
    if (tab === 'terminal') {
      setTerminalNotification(false);
      
    }
  }, [tab]);

  return (
    <AppContext.Provider
      value={{
        code,
        setCode,

        parserResponse,
        compile,

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
        resetVm,

        setMvsState,
        mvsState,

        terminalNotification,
      }}
    >
      {contextHolder}
      {children}
    </AppContext.Provider>
  );
};

export const useAppData = () => useContext(AppContext);
