import styled from "styled-components";

const StackFrame = styled.div`
  display: flex;
  flex-direction: column-reverse;
  border: 2px solid #333;
  box-sizing: border-box;
  width: 100%;
  max-width: 150px;
  min-width: 100px;
  min-height: 465px;
  max-height: 465px;
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
  background-color: rgb(24, 143, 255);
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

const StackVariable = styled.div`
  width: 90%;
  margin: 2px 0;
  padding: 8px 4px;
  text-align: center;
  background-color: rgb(255, 147, 24);
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

export const Stack = ({ data }) => {  
  return (
    <StackFrame>
      {data.map((value, index) => (
        <StackItem key={index}>
          {typeof value === "number" ? value : value ? "V" : "F"}
        </StackItem>
      ))}
    </StackFrame>
  );
};