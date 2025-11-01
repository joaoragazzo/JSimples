import { useEffect, useRef, useState } from "react";
import { useAppData } from "@/contexts/AppContext";
import styled, { css } from "styled-components";
import { AiOutlineRight } from "react-icons/ai";
import { PiBroomBold } from "react-icons/pi";
import { MdContrast } from "react-icons/md"; // Ícone de contraste
import { formatTime } from "@/utils/dateUtils";
import { COLORS, SIZES } from "@/constants/theme";

const TerminalWrapper = styled.div`
  position: relative;
  color: ${({ highContrast }) =>
    highContrast ? "#111" : COLORS.terminal.text};
  height: ${SIZES.terminal.height};
`;

const TerminalCard = styled.div`
  flex: 1;
  height: 100%;
  box-sizing: border-box;
  background: ${({ highContrast }) =>
    highContrast ? "#fff" : COLORS.terminal.background};
  border: ${({ highContrast }) =>
    highContrast ? "1px solid #11111136" : "1px solid rgba(255, 255, 255, 0.1)"};
  box-shadow: 0 4px 12px
    ${({ highContrast }) =>
      highContrast ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.1)"};
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

const LogLine = styled.div`
  margin-bottom: 8px;
  display: flex;

  &.error {
    color: ${({ highContrast }) => (highContrast ? "#b00020" : COLORS.terminal.error)};
  }

  &.success {
    color: ${({ highContrast }) => (highContrast ? "#006400" : COLORS.terminal.success)};
  }

  &.warning {
    color: ${({ highContrast }) => (highContrast ? "#b36b00" : COLORS.terminal.warning)};
  }

  &.info {
    color: ${({ highContrast }) => (highContrast ? "#1a237e" : COLORS.terminal.info)};
  }
`;

const Timestamp = styled.span`
  color: ${({ highContrast }) => (highContrast ? "#888" : COLORS.terminal.timestamp)};
  margin-right: 12px;
  min-width: 80px;
`;

const LogContent = styled.span`
  flex: 1;
`;

const WelcomeMessage = styled.div`
  color: ${({ highContrast }) => (highContrast ? "#333" : COLORS.terminal.welcome)};
  margin-bottom: 18px;
  font-weight: 600;
`;

const StyledInput = styled.input`
  border: none;
  width: 100%;
  background-color: transparent;
  color: ${({ highContrast }) => (highContrast ? "#111" : "white")};

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
  background: ${({ highContrast }) => (highContrast ? "#eee" : "transparent")};
  border-color: ${({ highContrast }) => (highContrast ? "#111" : "white")};

  &:hover {
    background-color: ${({ highContrast }) =>
      highContrast ? "#ddd" : "rgba(255, 255, 255, 0.1)"};
  }
`;

const ContrastButton = styled.div`
  border: 2px solid ${({ highContrast }) => (highContrast ? "#111" : "white")};
  border-radius: 7px;
  width: fit-content;
  padding: 10px;
  position: absolute;
  bottom: 20px;
  right: 70px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ highContrast }) => (highContrast ? "#eee" : "transparent")};

  &:hover {
    background-color: ${({ highContrast }) =>
      highContrast ? "#ddd" : "rgba(255, 255, 255, 0.1)"};
  }
`;

const InputContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;
`;

const getLogClass = (type) => {
  const LOG_TYPE_CLASSES = {
    error: "error",
    success: "success",
    warning: "warning",
    info: "info",
  };

  return LOG_TYPE_CLASSES[type] || "";
};

export const Terminal = () => {
  const { highContrast, setHighContrast, logs, setLogs, waitingInput, inputCallbackRef, setWaitingInput } = useAppData();
  const terminalRef = useRef(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const handleInputSubmit = () => {
    if (inputCallbackRef.current) {
      inputCallbackRef.current(inputValue);
      inputCallbackRef.current = null;
      setInputValue("");
      setWaitingInput(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleInputSubmit();
    }
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const handleToggleContrast = () => {
    setHighContrast((prev) => !prev);
  };

  return (
    <TerminalWrapper highContrast={highContrast}>
      <TerminalCard ref={terminalRef} highContrast={highContrast}>
        <WelcomeMessage highContrast={highContrast}>
          [JSimples@UNIFAL-MG terminal]$ Terminal JSimples
        </WelcomeMessage>

        {logs &&
          logs.length > 0 &&
          logs.map((log, index) => (
            <LogLine key={index} className={getLogClass(log.type)} highContrast={highContrast}>
              <Timestamp highContrast={highContrast}>{formatTime(log.timestamp)}</Timestamp>
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
              highContrast={highContrast}
            />
          </InputContainer>
        )}
      </TerminalCard>
      <ContrastButton onClick={handleToggleContrast} highContrast={highContrast} title="Alternar alto contraste">
        <MdContrast size={20} />
      </ContrastButton>
      <ClearButton onClick={handleClearLogs} highContrast={highContrast}>
        <PiBroomBold size={20} />
      </ClearButton>
    </TerminalWrapper>
  );
};
