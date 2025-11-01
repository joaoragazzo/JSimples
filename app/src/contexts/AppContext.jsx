import { createContext, useContext, useEffect, useRef, useState } from "react";
import simples from "@/core/compiler/simples.js";
import { MVS } from "@/core/mvs/mvs.js";
import { notification } from "antd";
import { removeIgnoreNodes, compressSingleChildNodes } from "@/utils/syntaxTreeUtils.jsx";
import { JSIMPLES_DEFAULT_CODE } from "@/constants/jsimples";

const AppContext = createContext();

const DEFAULT_MVS_STATE = {
  stack: [],
  instructionPointer: 0,
  dPointer: -1,
};

const DEFAULT_PARSER_RESPONSE = {
  syntaxTree: {},
  mvs: [],
  finished: false,
  symbolTable: [],
};

export const AppContextProvider = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();

  // Refs
  const vmRef = useRef(null);
  const mvsRef = useRef(null);
  const inputCallbackRef = useRef(null);

  // Estados
  const [code, setCode] = useState(JSIMPLES_DEFAULT_CODE);
  const [logs, setLogs] = useState([]);
  const [mvsState, setMvsState] = useState(DEFAULT_MVS_STATE);
  const [waitingInput, setWaitingInput] = useState(false);
  const [tab, setTab] = useState("terminal");
  const [isRunning, setIsRunning] = useState(false);
  const [completeSyntaxTree, setCompleteSyntaxTree] = useState({});
  const [simplifiedSyntaxTree, setSimplifiedSyntaxTree] = useState({});
  const [terminalNotification, setTerminalNotification] = useState(false);
  const [parserResponse, setParserResponse] = useState(DEFAULT_PARSER_RESPONSE);
  const [highContrast, setHighContrast] = useState(false);

  /**
   * Adiciona uma mensagem de log ao terminal
   */
  const output = (type, content) => {
    setLogs((prevLogs) => [
      ...prevLogs,
      {
        timestamp: Date.now(),
        type: type,
        message: `${content}`,
      },
    ]);
  };

  /**
   * Compila o código JSimples
   */
  const compile = () => {
    try {
      const response = simples.parse(code);
      response.finished = true;
      setParserResponse(response);

      // Processa árvore sintática
      const syntaxTree = removeIgnoreNodes(response.syntaxTree);
      setCompleteSyntaxTree(syntaxTree);

      // Cria versão simplificada da árvore
      const treeToCompress = JSON.parse(JSON.stringify(syntaxTree));
      setSimplifiedSyntaxTree(compressSingleChildNodes(treeToCompress));

      // Inicializa MVS em modo step-by-step
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
      console.error(e);
    }
  };

  /**
   * Executa o algoritmo compilado
   */
  const runAlgorithm = () => {
    setIsRunning(true);
    mvsRef.current = MVS(parserResponse.mvs, output, requestInput, () => {
      setIsRunning(false);
    });
  };

  /**
   * Para a execução do algoritmo
   */
  const stopAlgorithm = () => {
    if (mvsRef.current?.stop) {
      mvsRef.current.stop();
      setIsRunning(false);
    }
  };

  /**
   * Solicita input do usuário no terminal
   */
  const requestInput = () => {
    api.warning({
      message: "Preencha o input necessário no seu terminal",
      description: (
        <>
          <strong>Clique aqui</strong> para verificar o seu terminal
        </>
      ),
      placement: "bottomRight",
      onClick: () => {
        setTab("terminal");
      },
      style: { cursor: "pointer" },
    });

    return new Promise((resolve) => {
      setWaitingInput(true);
      inputCallbackRef.current = (value) => {
        resolve(parseInt(value));
        setWaitingInput(false);
      };
    });
  };

  /**
   * Reinicia a máquina virtual
   */
  const resetVm = () => {
    const vm = MVS(
      parserResponse.mvs,
      output,
      requestInput,
      () => {
        setIsRunning(false);
      },
      true
    );
    const data = vm.start();
    setMvsState(data);
    vmRef.current = vm;
  };

  // Notifica quando há nova saída no terminal
  useEffect(() => {
    if (tab !== "terminal") {
      setTerminalNotification(true);
      api.info({
        message: "Existe uma nova saída no terminal!",
        description: (
          <>
            <strong>Clique aqui</strong> para verificar o seu terminal
          </>
        ),
        placement: "bottomRight",
        onClick: () => {
          setTab("terminal");
        },
        style: { cursor: "pointer" },
      });
    }
  }, [logs]);

  // Limpa notificação quando terminal está ativo
  useEffect(() => {
    if (tab === "terminal") {
      setTerminalNotification(false);
    }
  }, [tab]);

  return (
    <AppContext.Provider
      value={{
        code,
        setCode,
        /* Função para compilar e resultado */
        parserResponse,
        compile,
        /* Árvore de derivação e árvore sintática*/
        completeSyntaxTree,
        simplifiedSyntaxTree,
        /* Valores da saída do terminal */
        logs,
        setLogs,
        /* Algoritmo rodando */
        runAlgorithm,
        stopAlgorithm,
        isRunning,
        /* Valores da funcionalidade selcionada */
        tab,
        setTab,
        /* Valores de requisição de Input */
        requestInput,
        waitingInput,
        setWaitingInput,
        inputCallbackRef,
        /* Referência a máquina virtual e resetar operação na máquina */
        vmRef,
        resetVm,
        /* Estádo da maquina virtual */
        mvsState,
        setMvsState,
        /* Notificação de I/O na interface */
        terminalNotification,
        /* Tema de alto contraste do terminal */
        highContrast,
        setHighContrast
      }}
    >
      {contextHolder}
      {children}
    </AppContext.Provider>
  );
};

export const useAppData = () => useContext(AppContext);
