import logo from "@/assets/Logo-JSimples.svg";
import { Col, Row, Tabs } from "antd";
import styled from "styled-components";

const HeaderBar = styled(Row)`
  padding: 15px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  justify-content: space-between;
  display: flex;
  align-items: center;
`;

const Link = styled.span`
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: border 0.5s;
  padding-bottom: 5px;

  &:hover {
    border-color: black;
  }
`

export const Header = () => {
  const items = [
    {
      key: 'home',
      label: 'Início',
    },
    {
        key: 'workspace',
        label: 'Workspace',
    },
    {
        key: 'help',
        label: 'Ajuda',
    },
    {
        key: 'about',
        label: 'Sobre'
    }
]
  
  return (
    <HeaderBar>
      <img src={logo} height={40} />
        <Tabs items={items}/>
    </HeaderBar>
  );
};
