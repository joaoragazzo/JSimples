import { Button } from "antd";
import styled from "styled-components";

const StyledButton = styled(Button)`
  height: 50px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const JSButton = ({ icon, onClick, children }) => {
  return (
    <StyledButton type="primary" onClick={onClick} icon={icon} size="large">
      {children}
    </StyledButton>
  );
};
