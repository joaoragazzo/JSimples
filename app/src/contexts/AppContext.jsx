import { createContext, useContext, useEffect, useState } from "react";
import simples from "../core/compiler/simples.js";
import { MVS }  from "../core/mvs/mvs.js";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [code, setCode] = useState("programa teste\ninteiro a\ninicio\na <- 1\nse a > 10 entao\nescreva a \nsenao\nescreva 0\nfimse\nfimprograma");

  const [completeSyntaxTree, setCompleteSyntaxTree] = useState({});
  const [simplifiedSyntaxTree, setSimplifiedSyntaxTree] = useState({});

  const [parserResponse, setParserResponse] = useState({
    syntaxTree: {},
  });

  const removeIgnoreNodes = (node) => {
    if (!node) {
      return null;
    }
  
    if (node.name === "IGNORE") {
      return null;
    }
  
    if (!node.children || node.children.length === 0) {
      return node;
    }
  
    node.children = node.children
      .map((child) => removeIgnoreNodes(child))
      .filter((child) => child !== null);
  
    if (node.children.length === 0) {
      delete node.children;
    }
  
    return node;
  };

  const compressSingleChildNodes = (node) => {
    if (!node) {
      return null;
    }

    if (!node.children || node.children.length === 0) {
      return node;
    }

    node.children = node.children
      .map((child) => compressSingleChildNodes(child))
      .filter((child) => child !== null);

    if (node.children.length === 0) {
      delete node.children;
      return node;
    }

    if (node.children.length === 1) {
      const onlyChild = node.children[0];
      return onlyChild;
    }

    return node;
  };

  const parse = () => {
    const response = simples.parse(code);
    setParserResponse(response);
    const syntaxTree = removeIgnoreNodes(response.syntaxTree);
    setCompleteSyntaxTree(syntaxTree);

    const treeToCompress = JSON.parse(JSON.stringify(syntaxTree));
    setSimplifiedSyntaxTree(compressSingleChildNodes(treeToCompress));

    MVS(response.mvsCode)

  };

  return (
    <AppContext.Provider
      value={{
        code,
        setCode,

        parserResponse,
        parse,

        completeSyntaxTree,
        simplifiedSyntaxTree,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppData = () => useContext(AppContext);
