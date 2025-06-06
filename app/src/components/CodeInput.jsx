import React from "react";
import { Input } from "antd";
import { useAppData } from "../contexts/AppContext";
import styled from "styled-components";

const { TextArea } = Input;

const StyledTextArea = styled(TextArea)`
  flex: 1;
  border-radius: 12px;
  border: 2px solid #e1e8ed;
  font-family: 'Fira Code', 'Monaco', 'Cascadia Code', monospace;
  font-size: 14px;
  line-height: 1.6;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &:hover {
    border-color: #667eea;
  }
  
  .ant-input {
    background: #fafbfc;
  }
`;

export const CodeInput = () => {
  const { setCode, code } = useAppData();
  
  return (
    <StyledTextArea
      onChange={(e) => setCode(e.target.value)}
      value={code}
      placeholder="Digite seu código aqui..."
      style={{ minHeight: "500px" }}
      showCount
    />
  );
};