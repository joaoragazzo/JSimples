import logo from "@/assets/Logo-JSimples.svg";
import { Row } from "antd";
import styled from "styled-components";

const HeaderBar = styled(Row)`
  padding: 15px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  justify-content: space-between;
  display: flex;
  align-items: center;
`;

export const Header = () => {
  return (
    <HeaderBar>
      <img src={logo} height={40} />
    </HeaderBar>
  );
};
