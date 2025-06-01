import { useState } from "react";
import "./App.css";
import simples from "./core/compiler/simples.js";
import { GraphicView } from "./components/GraphicView.jsx";

function App() {
  const [resultado, setResultado] = useState();
  const [syntaxTree, setSyntaxTree] = useState({});
  const [algoritmo, setAlgoritmo] = useState(`programa teste
  inteiro a b c
inicio
  leia a
  escreva b + (a + 1)
fimprograma
    `);

  const handleClick = () => { 
    const result = simples.parse(algoritmo)
    console.log(result)
    setSyntaxTree(result.syntaxTree)
    setResultado(result.mvsCode)
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "500px",
          gap: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "400px",
            gap: "10px",
          }}
        >
          <textarea 
            type="text" 
            rows={10}
            style={{ width: "98%" }}
            onChange={(e) => setAlgoritmo(e.target.value)}
            value={algoritmo}
          ></textarea>
          <button onClick={handleClick}>Rodar</button>
        </div>
        {resultado}
      </div>
      <GraphicView syntaxTree={syntaxTree}/>
    </>
  );
}

export default App;
