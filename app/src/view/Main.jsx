import styled from "styled-components";
import { Header } from "../components/Header";
import { Workspace } from "./Workspace";

const MainWrapper = styled.div`
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Container = styled.div`
  box-sizing: border-box;
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; 
`;

export const Main = () => {
  
  return (
    <MainWrapper>
      <Header />
      <Container>
        <Workspace />
      </Container>
    </MainWrapper>
  );
};