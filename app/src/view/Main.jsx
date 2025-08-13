import styled from "styled-components";
import { Header } from "../components/Header";
import { Workspace } from "./Workspace";
import { Intro } from "./Intro";

const MainWrapper = styled.div`
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
  }
`;

const Container = styled.div`
  box-sizing: border-box;
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;

  @media (max-width: 768px) {
    padding: 12px;
    flex: none;
    min-height: calc(100vh - 64px);
    overflow-y: auto;
    display: block;
  }

  @media (max-width: 480px) {
    padding: 8px;
    min-height: calc(100vh - 56px);
    display: block;
  }
`;

export const Main = () => {
  return (
    <Intro>
      <MainWrapper>
        <Header />
        <Container>
          <Workspace />
        </Container>
      </MainWrapper>
    </Intro>
  );
};
