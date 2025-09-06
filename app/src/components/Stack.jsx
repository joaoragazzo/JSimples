import styled from "styled-components";

const StackFrame = styled.div`
  display: flex;
  flex-direction: column-reverse;
  border: 2px solid #333;
  box-sizing: border-box;
  width: 100px;
  min-height: 160px;
  max-height: 160px;
  overflow-y: auto;
  justify-content: flex-start;
  align-items: center;
  padding: 1px;
  border-top: none;
  background-color: #f9f9f9;
  box-shadow: 1px 1px 10px rgb(0,0,0,0.2);
`;

const StackItem = styled.div`
  width: 90%;
  margin: 2px 0;
  padding: 10px 0;
  text-align: center;
  background-color:rgb(24, 143, 255);
  color: white;
  border-radius: 4px;
  font-weight: bold;
  position: relative;
`;

const StackVariable= styled.div`
  width: 90%;
  margin: 2px 0;
  padding: 10px 0;
  text-align: center;
  background-color:rgb(255, 147, 24);
  color: white;
  border-radius: 4px;
  font-weight: bold;
  position: relative;
`;

export const Stack = ({data, variables}) => {

  return (
    <StackFrame>
      {variables.map((value, index) => (
        <StackVariable key={index}>
          {typeof value === "number" ? value : value ? "V" : "F" }
        </StackVariable>
      ))}
      {data.map((value, index) => (
        <StackItem key={index}>
          {typeof value === "number" ? value : value ? "V" : "F" }
        </StackItem>
      ))}
      
    </StackFrame>
  );
};
