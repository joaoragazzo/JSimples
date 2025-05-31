const parser = require('./simples');

const toParse = `
    programa nomeDoPrograma 
        inteiro a b c
    inicio  
        a <- a + 1
    fimprograma
`;
const result = parser.parse(toParse);