import styled from "styled-components";
import { COLORS, SIZES } from "@/constants/theme";

const StackFrame = styled.div`
  display: flex;
  flex-direction: column-reverse;
  border: 2px solid #333;
  box-sizing: border-box;
  width: 100%;
  max-width: 150px;
  min-width: 100px;
  min-height: ${SIZES.stack.minHeight};
  max-height: ${SIZES.stack.maxHeight};
  overflow-y: auto;
  justify-content: flex-start;
  align-items: center;
  padding: 1px;
  border-top: none;
  background-color: #f9f9f9;

  @media (max-width: 768px) {
    max-width: 120px;
    min-width: 80px;
    min-height: 300px;
    max-height: 300px;
  }

  @media (max-width: 480px) {
    max-width: 100px;
    min-width: 70px;
    min-height: 250px;
    max-height: 250px;
  }
`;

const StackItem = styled.div`
  width: 90%;
  margin: 2px 0;
  padding: 8px 4px;
  text-align: center;
  background-color: ${COLORS.stack.item};
  color: white;
  border-radius: 4px;
  font-weight: bold;
  position: relative;
  font-size: 14px;
  word-break: break-word;

  @media (max-width: 768px) {
    padding: 6px 2px;
    font-size: 12px;
  }

  @media (max-width: 480px) {
    padding: 4px 2px;
    font-size: 10px;
  }
`;

/**
 * Formata o valor para exibição na pilha
 */
const formatStackValue = (value) => {
  if (typeof value === "number") {
    return value;
  }
  return value ? "V" : "F";
};

/**
 * Componente de visualização da pilha
 */
export const Stack = ({ data }) => {
  return (
    <StackFrame>
      {data.map((value, index) => (
        <StackItem key={index}>{formatStackValue(value)}</StackItem>
      ))}
    </StackFrame>
  );
};
