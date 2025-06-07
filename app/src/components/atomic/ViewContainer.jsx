import styled from "styled-components";

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.backgroundColor || 'transparent'}
`;

export const ViewContainer = ({ children, backgroundColor}) => {
  return <Container $backgroundColor={backgroundColor}>{children}</Container>;
};
