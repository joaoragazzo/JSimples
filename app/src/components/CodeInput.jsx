import React, { useMemo } from "react";
import { useAppData } from "@/contexts/AppContext";
import styled from "styled-components";
import CodeMirror, { Decoration, EditorState, EditorView } from "@uiw/react-codemirror";
import {
  getCodeMirrorExtensions,
  CODE_MIRROR_BASIC_SETUP,
} from "@/config/codeMirrorConfig";
import { COLORS, SIZES } from "@/constants/theme";

const StyledCodeMirror = styled.div`
  flex: 1;
  border-radius: 12px;
  border: 2px solid ${COLORS.border.default};
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${COLORS.border.hover};
  }

  &:focus-within {
    border-color: ${COLORS.border.hover};
    box-shadow: 0 0 0 3px ${COLORS.border.focus};
  }
`;

/**
 * Cria extensão de highlight para a linha atual em execução
 */
const createHighlightExtension = (first_line, first_column, last_line, last_column, doc) => {
  if (!first_line || !first_column || !last_line || !last_column) {
    const deco = Decoration.mark({ class: "none" }).range(0, 1);
    return EditorView.decorations.of(Decoration.set([deco]));
  }

  const getPos = (line, col) => {
    const lineInfo = doc.line(line);
    return lineInfo.from + col;
  };

  const start = getPos(first_line, first_column);
  const end = getPos(last_line, last_column);

  const deco = Decoration.mark({ class: "custom-highlight" }).range(start, end);
  return EditorView.decorations.of(Decoration.set([deco]));
};

/**
 * Componente de entrada de código com suporte para destaque de sintaxe JSimples
 */
export const CodeInput = ({ stepByStep = false }) => {
  const { setCode, code, mvsState, parserResponse } = useAppData();

  // Cria extensão de highlight para modo passo a passo
  const highlightExtension = stepByStep
    ? useMemo(() => {
        const doc = EditorState.create({ doc: code || "" }).doc;
        const currentInstruction = parserResponse.mvs[mvsState.instructionPointer];

        return createHighlightExtension(
          currentInstruction?.first_line,
          currentInstruction?.first_column,
          currentInstruction?.last_line,
          currentInstruction?.last_column,
          doc
        );
      }, [code, mvsState, parserResponse])
    : null;

  const extensions = getCodeMirrorExtensions(stepByStep, highlightExtension);

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
        height={SIZES.codeEditor.height}
        onChange={(value) => setCode(value)}
        placeholder="Digite seu código aqui..."
        basicSetup={CODE_MIRROR_BASIC_SETUP}
      />
    </StyledCodeMirror>
  );
};
