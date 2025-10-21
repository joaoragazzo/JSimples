/**
 * Configurações do CodeMirror para o editor de código JSimples
 */

import { HighlightStyle, StreamLanguage } from '@codemirror/language';
import { syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { JSIMPLES_KEYWORDS, JSIMPLES_TYPES } from '@/constants/jsimples';
import { COLORS } from '@/constants/theme';

/**
 * Estilo de destaque de sintaxe para JSimples
 */
export const JSimplesHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: COLORS.syntax.keyword },
  { tag: tags.variableName, color: COLORS.syntax.variable },
  { tag: tags.number, color: COLORS.syntax.number },
  { tag: tags.typeName, color: COLORS.syntax.type },
]);

/**
 * Definição da linguagem JSimples para CodeMirror
 */
export const JSimples = StreamLanguage.define({
  name: 'JSimples',

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
      return 'number';
    }

    // Operadores
    if (stream.match(/[+\-*\/=<>!&|%]/)) {
      return 'operator';
    }

    // Palavras-chave e identificadores
    if (stream.match(/[a-zA-Z_$][a-zA-Z0-9_$]*/)) {
      const word = stream.current();

      if (JSIMPLES_KEYWORDS.includes(word)) {
        return 'keyword';
      }

      if (JSIMPLES_TYPES.includes(word)) {
        return 'type';
      }

      return 'variable';
    }

    stream.next();
    return null;
  },
});

/**
 * Configurações básicas do CodeMirror
 */
export const CODE_MIRROR_BASIC_SETUP = {
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
};

/**
 * Retorna as extensões do CodeMirror baseado no modo
 * @param {boolean} stepByStep - Se está em modo passo a passo
 * @param {Object} highlightExtension - Extensão de highlight opcional
 * @returns {Array} - Array de extensões
 */
export const getCodeMirrorExtensions = (stepByStep, highlightExtension) => {
  const baseExtensions = [JSimples, syntaxHighlighting(JSimplesHighlightStyle)];

  if (stepByStep && highlightExtension) {
    return [...baseExtensions, highlightExtension];
  }

  return baseExtensions;
};
