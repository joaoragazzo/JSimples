const parser = require('./simples');

const toParse = `
    programa nomeDoPrograma 
        inteiro a b c
        logico d ee
    inicio
        enquanto 10 > 3 faca
            escreva 3
            escreva 10 > 3
        fimenquanto
    fimprograma
`;
const result = parser.parse(toParse);