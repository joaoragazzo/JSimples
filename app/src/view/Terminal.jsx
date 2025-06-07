import React, { useEffect, useRef } from "react";
import { useAppData } from "../contexts/AppContext";
import styled from "styled-components";

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

const TerminalCard = styled.div`
  height: 100%;
  box-sizing: border-box;
  background: #1a202c;
  color: #e2e8f0;
  font-family: "Courier New", monospace;
  font-size: 14px;
  line-height: 1.6;
  padding: 20px;
  overflow-y: auto;
  border-radius: 16px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #2d3748;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #4a5568;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #667eea;
  }
`;

export const Terminal = () => {
  const { logs } = useAppData();
  const terminalRef = useRef(null);

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
    </TerminalCard>
  );
};
