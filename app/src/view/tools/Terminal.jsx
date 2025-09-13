import React, { useEffect, useRef, useState } from "react";
import { useAppData } from "@/contexts/AppContext";
import styled from "styled-components";
import { AiOutlineRight } from "react-icons/ai";
import { PiBroomBold } from "react-icons/pi";

const LogLine = styled.div`
  margin-bottom: 8px;
  display: flex;

  &.error {
    color: #f56565;
  }

  &.success {
    color: #48bb78;
  }

  &.warning {
    color: #ed8936;
  }

  &.info {
    color: #4299e1;
  }
`;

const Timestamp = styled.span`
  color: #718096;
  margin-right: 12px;
  min-width: 80px;
`;

const LogContent = styled.span`
  flex: 1;
`;

const WelcomeMessage = styled.div`
  color: rgb(255, 255, 255);
  margin-bottom: 18px;
  font-weight: 600;
`;

const TerminalWrapper = styled.div`
  position: relative;
  color: #e2e8f0;
  height: 100%;
`

const TerminalCard = styled.div`
  flex: 1;
  height: 100%;
  box-sizing: border-box;
  background: #1a202c;
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

export const Terminal = () => {
  const { logs, setLogs, waitingInput, inputCallbackRef, setWaitingInput } =
    useAppData();
  const terminalRef = useRef(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getLogClass = (type) => {
    switch (type) {
      case "error":
        return "error";
      case "success":
        return "success";
      case "warning":
        return "warning";
      case "info":
        return "info";
      default:
        return "";
    }
  };

  return (
    <TerminalWrapper>
      <TerminalCard ref={terminalRef}>
      <WelcomeMessage>
        [JSimples@UNIFAL-MG terminal]$ Terminal JSimples
      </WelcomeMessage>

      {logs &&
        logs.length > 0 &&
        logs.map((log, index) => (
          <LogLine key={index} className={getLogClass(log.type)}>
            <Timestamp>{formatTime(log.timestamp)}</Timestamp>
            <LogContent>{log.message}</LogContent>
          </LogLine>
        ))}

      {waitingInput && (
        <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
          <AiOutlineRight />
          <StyledInput
            type="text"
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (inputCallbackRef.current) {
                  inputCallbackRef.current(inputValue);
                  inputCallbackRef.current = null;
                  setInputValue("");
                  setWaitingInput(false);
                }
              }
            }}
            autoFocus
          />
        </div>
      )}
      </TerminalCard>
      <ClearButton onClick={() => {setLogs([])}}>
        <PiBroomBold size={20}/>
      </ClearButton>
    </TerminalWrapper>
    
  );
};
