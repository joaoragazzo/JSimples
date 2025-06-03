import { Button, Col, Row } from "antd";
import { CodeInput } from "../components/CodeInput";
import { GraphicView } from "../components/graphicView/GraphicView";
import { useAppData } from "../contexts/AppContext";

export const Main = () => {
    const { parse } = useAppData();  
  
    return (
    <Row
      style={{
        gap: "10px",
      }}
    >
      <Col
        style={{
          display: "flex",
          flexDirection: "column",
          width: "400px",
          gap: "10px",
        }}
        flex={"500px"}
      >
        <CodeInput />
        <Button type="primary" onClick={parse}>
          <b>Gerar árvore sintática</b>
        </Button>
      </Col>
      <Col flex="auto">
        <GraphicView />
      </Col>
    </Row>
  );
};
