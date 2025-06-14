import styled from "styled-components";

const Container = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.backgroundColor || 'transparent'}
`;

export const ViewContainer = ({ children, backgroundColor}) => {
  return <Container $backgroundColor={backgroundColor}>{children}</Container>;
};
