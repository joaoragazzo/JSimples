const parser = require('./calculator');

const input = "3 + 4 * (2 - 1)";
const result = parser.parse(input);
// console.log(result);