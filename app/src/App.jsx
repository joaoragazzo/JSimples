import "./App.css";
import { GraphicView } from "./components/graphicView/GraphicView.jsx";
import { Button, Col, Row } from "antd";
import { CodeInput } from "./components/CodeInput.jsx";
import { useAppData } from "./contexts/AppContext.jsx";

function App() {
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
}

export default App;
