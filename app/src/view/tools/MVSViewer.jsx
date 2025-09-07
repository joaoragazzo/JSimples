import styled from "styled-components";
import { CodeEditor } from "./CodeEditor";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

export const MVSViewer = () => {
  
  return (
    <Container>
      <CodeEditor/>
    </Container>
  );
};
