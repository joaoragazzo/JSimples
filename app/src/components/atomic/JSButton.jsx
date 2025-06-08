import { Button } from "antd";
import styled from "styled-components";

const StyledButton = styled(Button)`
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const JSButton = ({ icon, onClick, children, type, danger }) => {
  return (
    <StyledButton type={type} onClick={onClick} icon={icon} size="large" danger={danger}>
      {children}
    </StyledButton>
  );
};
