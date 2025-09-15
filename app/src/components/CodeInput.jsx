import React, { useMemo } from "react";
import { useAppData } from "@/contexts/AppContext";
import styled from "styled-components";
import CodeMirror, { Decoration, EditorState, EditorView } from "@uiw/react-codemirror";
import { HighlightStyle, StreamLanguage } from "@codemirror/language";
import { syntaxHighlighting } from '@codemirror/language';
import { tags} from '@lezer/highlight';

const JSimplesHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: '#0000FF' },
  { tag: tags.variableName, color: '#001080' },
  { tag: tags.number, color: '#098658' },
  { tag: tags.typeName, color: '#267F99' }
]);

const StyledCodeMirror = styled.div`
  flex: 1;
  border-radius: 12px;
  border: 2px solid #e1e8ed;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
  }

  &:focus-within {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const JSimples = StreamLanguage.define({
  name: "JSimples",

  startState() {
    return {
      inString: false,
      inComment: false,
      stringDelimiter: null,
      commentType: null,
    };
  },

  token(stream, state) {
    if (stream.eatSpace()) return null;

    // Números
    if (stream.match(/\d+(\.\d+)?([eE][+-]?\d+)?/)) {
      return "number";
    }

    // Operadores
    if (stream.match(/[+\-*\/=<>!&|%]/)) {
      return "operator";
    }

    // Palavras-chave e identificadores
    if (stream.match(/[a-zA-Z_$][a-zA-Z0-9_$]*/)) {
      const word = stream.current();

      // Keywords
      const keywords = [
        "programa",
        "inicio",
        "fimprograma",
        "<-",
        "se",
        "entao",
        "senao",
        "fimse",
        "enquanto",
        "faca",
        "fimenquanto",
        "nao",
        "div",
        "escreva",
        "leia",
        "proc",
        "fimproc"
      ];

      const types = [
        "inteiro",
        "logico"
      ];

      if (keywords.includes(word)) {
        return "keyword";
      }

      if (types.includes(word)) {
        return "type";
      }

      return "variable";
    }

    stream.next();
    return null;
  },
});

const createHightlightExtension = (first_line, first_column, last_line, last_column, doc) => {
  if (!first_line || !first_column || !last_line || !last_column) {
    const deco = Decoration.mark({ class: "none" }).range(0, 1);
    return EditorView.decorations.of(Decoration.set([deco]));
  };
  
  const getPos = (line, col) => {
    const lineInfo = doc.line(line);
    return lineInfo.from + col;
  }

  const start = getPos(first_line, first_column);
  const end = getPos(last_line, last_column);

  const deco = Decoration.mark({ class: "custom-highlight" }).range(start, end);
  return EditorView.decorations.of(Decoration.set([deco]));
}


export const CodeInput = ({ stepByStep=false }) => {
  const { setCode, code, mvsState, parserResponse } = useAppData(); 

  const highlightExtension = stepByStep ? useMemo(() => {
    const doc = EditorState.create({ doc: code || "" }).doc;

    return createHightlightExtension(
      parserResponse.mvs[mvsState.instructionPointer]?.first_line, 
      parserResponse.mvs[mvsState.instructionPointer]?.first_column, 
      parserResponse.mvs[mvsState.instructionPointer]?.last_line, 
      parserResponse.mvs[mvsState.instructionPointer]?.last_column, doc);
  }, [code, mvsState, parserResponse]) : null;

  const extensions = stepByStep ? 
    [JSimples, syntaxHighlighting(JSimplesHighlightStyle), highlightExtension] : 
    [JSimples, syntaxHighlighting(JSimplesHighlightStyle)];

  return (
      <StyledCodeMirror>
        <style>
          {`
            .custom-highlight {
              background-color: yellow;
            }
          `}
        </style>
        <CodeMirror
          value={code || ""}
          extensions={extensions}
          height={'750px'}
          onChange={(value) => setCode(value)}
          placeholder="Digite seu código aqui..."
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            dropCursor: false,
            allowMultipleSelections: false,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            highlightSelectionMatches: false,
            searchKeymap: true,
          }}
        />
      </StyledCodeMirror>
  );
};
