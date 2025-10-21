import React, { useEffect, useRef, useState } from "react";
import { useAppData } from "@/contexts/AppContext";
import styled from "styled-components";
import { AiOutlineRight } from "react-icons/ai";
import { PiBroomBold } from "react-icons/pi";
import { formatTime } from "@/utils/dateUtils";
import { COLORS, SIZES } from "@/constants/theme";

const LogLine = styled.div`
  margin-bottom: 8px;
  display: flex;

  &.error {
    color: ${COLORS.terminal.error};
  }

  &.success {
    color: ${COLORS.terminal.success};
  }

  &.warning {
    color: ${COLORS.terminal.warning};
  }

  &.info {
    color: ${COLORS.terminal.info};
  }
`;

const Timestamp = styled.span`
  color: ${COLORS.terminal.timestamp};
  margin-right: 12px;
  min-width: 80px;
`;

const LogContent = styled.span`
  flex: 1;
`;

const WelcomeMessage = styled.div`
  color: ${COLORS.terminal.welcome};
  margin-bottom: 18px;
  font-weight: 600;
`;

const TerminalWrapper = styled.div`
  position: relative;
  color: ${COLORS.terminal.text};
  height: ${SIZES.terminal.height};
`;

const TerminalCard = styled.div`
  flex: 1;
  height: 100%;
  box-sizing: border-box;
  background: ${COLORS.terminal.background};
  font-family: "Courier New", monospace;
  font-size: 14px;
  line-height: 1.6;
  padding: 20px;
  overflow-y: auto;
  border-radius: 16px;

  @media (max-width: 768px) {
    min-height: 700px;
  }
`;

const StyledInput = styled.input`
  border: none;
  width: 100%;
  background-color: transparent;
  color: white;

  &:focus {
    outline: none;
    border: none;
  }
`;

const ClearButton = styled.div`
  border: 2px white solid;
  border-radius: 7px;
  width: fit-content;
  padding: 10px;
  position: absolute;
  bottom: 20px;
  right: 20px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const InputContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;
`;

/**
 * Retorna a classe CSS apropriada para o tipo de log
 */
const getLogClass = (type) => {
  const LOG_TYPE_CLASSES = {
    error: "error",
    success: "success",
    warning: "warning",
    info: "info",
  };

  return LOG_TYPE_CLASSES[type] || "";
};

/**
 * Componente de terminal para exibir logs e capturar input do usuário
 */
export const Terminal = () => {
  const { logs, setLogs, waitingInput, inputCallbackRef, setWaitingInput } = useAppData();
  const terminalRef = useRef(null);
  const [inputValue, setInputValue] = useState("");

  // Auto-scroll para o final quando novos logs são adicionados
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  /**
   * Manipula a submissão de input do usuário
   */
  const handleInputSubmit = () => {
    if (inputCallbackRef.current) {
      inputCallbackRef.current(inputValue);
      inputCallbackRef.current = null;
      setInputValue("");
      setWaitingInput(false);
    }
  };

  /**
   * Manipula o evento de tecla pressionada no input
   */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleInputSubmit();
    }
  };

  /**
   * Limpa todos os logs do terminal
   */
  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <TerminalWrapper>
      <TerminalCard ref={terminalRef}>
        <WelcomeMessage>[JSimples@UNIFAL-MG terminal]$ Terminal JSimples</WelcomeMessage>

        {logs &&
          logs.length > 0 &&
          logs.map((log, index) => (
            <LogLine key={index} className={getLogClass(log.type)}>
              <Timestamp>{formatTime(log.timestamp)}</Timestamp>
              <LogContent>{log.message}</LogContent>
            </LogLine>
          ))}

        {waitingInput && (
          <InputContainer>
            <AiOutlineRight />
            <StyledInput
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </InputContainer>
        )}
      </TerminalCard>
      <ClearButton onClick={handleClearLogs}>
        <PiBroomBold size={20} />
      </ClearButton>
    </TerminalWrapper>
  );
};
