import React, { useEffect, useRef } from "react";
import { useAppData } from "../contexts/AppContext";
import styled from "styled-components";

const TerminalContainer = styled.div`
  height: 100%;
  background: #1a202c;
  color: #e2e8f0;
  font-family: 'Fira Code', 'Monaco', 'Cascadia Code', monospace;
  font-size: 14px;
  line-height: 1.6;
  padding: 20px;
  overflow-y: auto;
  border-radius: 0 0 16px 16px;
  
  /* Scrollbar personalizada */
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

const Prompt = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #2d3748;
`;

const PromptSymbol = styled.span`
  color: #667eea;
  margin-right: 8px;
  font-weight: bold;
`;

const WelcomeMessage = styled.div`
  color: #667eea;
  margin-bottom: 16px;
  font-weight: 600;
`;

export const Terminal = () => {
  const { logs, isLoading } = useAppData();
  const terminalRef = useRef(null);
  
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);
  
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  const getLogClass = (type) => {
    switch (type) {
      case 'error': return 'error';
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return '';
    }
  };
  
  return (
    <TerminalContainer ref={terminalRef}>
      <WelcomeMessage>
        🚀 Terminal de Análise Sintática - Pronto para uso
      </WelcomeMessage>
      
      {logs && logs.length > 0 && (
        logs.map((log, index) => (
          <LogLine key={index} className={getLogClass(log.type)}>
            <Timestamp>{formatTime(log.timestamp)}</Timestamp>
            <LogContent>{log.message}</LogContent>
          </LogLine>
        ))
      )}
      
      {isLoading && (
        <LogLine className="warning">
          <Timestamp>{formatTime(Date.now())}</Timestamp>
          <LogContent>⏳ Processando código...</LogContent>
        </LogLine>
      )}
      

    </TerminalContainer>
  );
};