/**
 * Constantes de tema e cores da aplicação
 */

export const COLORS = {
  // Cores principais
  primary: '#667eea',

  // Cores de sintaxe do JSimples
  syntax: {
    keyword: '#0000FF',
    variable: '#001080',
    number: '#098658',
    type: '#267F99',
  },

  // Cores do terminal
  terminal: {
    background: '#1a202c',
    text: '#e2e8f0',
    error: '#f56565',
    success: '#48bb78',
    warning: '#ed8936',
    info: '#4299e1',
    timestamp: '#718096',
    welcome: '#ffffff',
  },

  // Cores de bordas e superfícies
  border: {
    default: '#e1e8ed',
    hover: '#667eea',
    focus: 'rgba(102, 126, 234, 0.1)',
  },

  // Cores da pilha
  stack: {
    item: 'rgb(24, 143, 255)',
    variable: 'rgb(255, 147, 24)',
  },

  // Cores de ponteiros
  pointer: {
    background: 'rgb(53, 56, 231)',
    border: 'rgb(53, 56, 231)',
  },

  // Cores de setas
  arrow: {
    justExecuted: 'rgb(30, 95, 214)',
    nextToExecute: 'rgb(233, 39, 39)',
  },
};

export const SIZES = {
  terminal: {
    height: '745px',
  },
  stack: {
    minHeight: '465px',
    maxHeight: '465px',
  },
  codeEditor: {
    height: '750px',
  },
};

export const TRANSITIONS = {
  default: 'all 0.3s ease',
  hover: 'all 0.2s ease',
};
