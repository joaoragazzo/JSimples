/**
 * Constantes relacionadas à linguagem JSimples
 */

export const JSIMPLES_KEYWORDS = [
  'programa',
  'inicio',
  'fimprograma',
  '<-',
  'se',
  'entao',
  'senao',
  'fimse',
  'enquanto',
  'faca',
  'fimenquanto',
  'nao',
  'div',
  'escreva',
  'leia',
  'proc',
  'fimproc',
  'func',
  'fimfunc',
  'ref',
];

export const JSIMPLES_TYPES = [
  'inteiro',
  'logico',
];

export const JSIMPLES_DEFAULT_CODE =
  'programa teste\n' +
  '\tinteiro a b\n' +
  '\tlogico c d\n' +
  'inicio\n' +
  '\ta <- 1\n' +
  '\ta <- a * 3\n' +
  '\tescreva a\n' +
  'fimprograma';
