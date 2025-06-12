%{

parser.parseError = function(str, hash) {
    const location = hash.loc || {};
    const errorInfo = {
        message: str,
        line: location.first_line || 'desconhecida',
        column: location.first_column || 'desconhecida',
        token: hash.token || 'desconhecido',
        expected: hash.expected || [],
        recoverable: hash.recoverable || false
    };
    
    const error = new Error(`Erro de síntaxe na linha ${errorInfo.line}, coluna ${errorInfo.column}: ${errorInfo.message}`);
    clearEverything();
    error.location = errorInfo;
    throw error;
};

class SyntaxNode {
    constructor(nodeName, children) {
        this.name = nodeName;
        this.children = children;
    }

    toString() {
        const childrenToString = this.children
            .map(child => {
                    return child.toString()
                }
            ).join(", ");

        if (this.children.length > 0)
            return `${this.name}: [${childrenToString}]`;
        
        return `${this.name}`;
    }
}


const types = Object.freeze({
    LOGIC: "LOGIC",
    INTEGER: "INTEGER"
});

let mvs = [],
    variableType = null,
    variableCount = 0;

const variableTable = [],
    typeStack = [],
    labelStack = [];

let label = 0,
    tmpLabel,
    tmpType,
    tmpPos,
    tmpVariableName,
    tmpVariable,
    success;

const clearEverything = () => {
    variableTable.length = 0;
    typeStack.length = 0;
    labelStack.length = 0;
    mvs = [];
    variableCount = 0;
    label = 0;
}

const addVariable = (v) => {
    const nameAlreadyExists = variableTable.some(variable => variable.name === v.name);
    
    if (nameAlreadyExists) 
        return false;    
    
    variableTable.push(v);
    return true;
}

const typeCheck = (type1, type2, resultType) => {
    const semanticType1 = typeStack.pop();
    const semanticType2 = typeStack.pop();

    if (type1 === semanticType1 && semanticType2 === type2) {
        typeStack.push(resultType);
        return true;
    }

    return false;
}

const findVariable = (variableName) => {
    const variable = variableTable.find(variable => variable.name === variableName);
    if (variable) {
        return variable;
    }
    return false;
}

const findVariablePosition = (variableName) => {
    const index = variableTable.findIndex(variable => variable.name === variableName);
    if (index != -1) {
        return index;
    }
    return false;
}

const error = (token, message) => {
    clearEverything();
    throw new Error(`ERROR [${token.first_line}:${token.first_column}] ${message}`);
}

%}

%lex
%%

\s+             /* skip whitespaces */

"programa"      return 'T_PROGRAM';
"inicio"        return 'T_START';
"fimprograma"   return 'T_END';

"leia"          return "T_READ";
"escreva"       return "T_PRINT";

"se"            return "T_IF";  
"entao"         return "T_THEN";
"senao"         return "T_ELSE";
"fimse"         return "T_ENDIF";

"enquanto"      return "T_WHILE";
"faca"          return "T_DO";
"fimenquanto"   return "T_ENDWHILE";

"+"             return "T_PLUS";
"-"             return "T_MINUS";
"*"             return "T_TIMES";
"div"           return "T_DIV";

"<-"            return "T_ATRIB";

">"             return "T_GREATER";
"<"             return "T_LESS";
"="             return "T_EQUAL";

"e"             return "T_AND";
"ou"            return "T_OR";
"nao"           return "T_NOT";

"("             return "T_OPEN";
")"             return "T_CLOSE";

"inteiro"       return "T_INTEGER";
"logico"        return "T_LOGIC";
"V"             return "T_T";
"F"             return "T_F";

<<EOF>>         return 'EOF';

[a-zA-Z][a-zA-Z0-9]*    return 'T_IDENTIFIER';
[0-9]*                  return 'T_NUMBER';

/lex 

%left T_AND T_OR 
%left T_EQUAL
%left T_GREATER T_LESS
%left T_PLUS T_MINUS
%left T_TIMES T_DIV 

%start algorithm
%%


algorithm
    : header variables start_block command_list footer
        {
            const headerNode = $1;
            const variablesNode = $2;
            const startBlockNode = $3;
            const commandsNode = $4;
            const footerNode = $5;

            const children = [headerNode];
            if (variablesNode) children.push(variablesNode);
            if (startBlockNode) children.push(startBlockNode);
            if (commandsNode) children.push(commandsNode);
            if (footerNode) children.push(footerNode);

            let syntaxTree = new SyntaxNode("Algoritmo", children);
            let result = { 
                syntaxTree: syntaxTree, 
                mvs: mvs, 
                variableTable: [...variableTable] 
            }

            clearEverything();

            return result;            
        }
    ;

start_block 
    : T_START
        {
            mvs.push({label: null, instruction: "AMEM", parameter: variableCount, to: null}); 
            $$ = new SyntaxNode($1, []);
        }
    ;

header
    : T_PROGRAM T_IDENTIFIER
        {
            mvs.push({label: null, instruction: "INPP", parameter: variableCount, to: null});
            $$ = new SyntaxNode("Cabeçalho", [
                new SyntaxNode($1, []), 
                new SyntaxNode($2, [])
            ]);
        }
    ;

variables
    : /* blank */
        {
            $$ = new SyntaxNode("IGNORE", [])
        }
    | variable_declaration 
        {
            $$ = new SyntaxNode("Variáveis", [$1]);
        }
    ;

variable_declaration
    : type variable_list variable_declaration 
        {
            $$ = new SyntaxNode("Declaração de variáveis", [$1, $2, $3])
        }
    | type variable_list
        {
            $$ = new SyntaxNode("Declaração de variáveis", [$1, $2])
        }
    ;

type 
    : T_LOGIC
        {
            variableType = types.LOGIC;
            $$ = new SyntaxNode("Tipo", [new SyntaxNode($1,[])])
        }
    | T_INTEGER
        {
            variableType = types.INTEGER;
            $$ = new SyntaxNode("Tipo", [new SyntaxNode($1, [])])
        }
    ;

variable_list
    : variable_list T_IDENTIFIER
        {
            success = addVariable({type: variableType, name: $2, address: variableCount});
            if (!success) {error(@1, "Nome de variável já declarada.")}
            variableCount++; 
            $$ = new SyntaxNode("Lista de variáveis", [$1, new SyntaxNode($2,[])])
        }
    | T_IDENTIFIER
        {
            success = addVariable({type: variableType, name: $1, address: variableCount});
            if (!success) {error(@1, "Nome de variável já declarada.")}
            variableCount++;
            $$ = new SyntaxNode("Lista de variáveis", [new SyntaxNode($1, [])])
        }
    ;

command_list
    : /* blank */
        {  
            $$ = new SyntaxNode("IGNORE", []);
        }
    | command command_list
        {
            $$ = new SyntaxNode("Lista de comandos", [$1, $2]);
        }
    ;

command 
    : input_output 
        {
            $$ = new SyntaxNode("Comando", [$1]);
        }
    | repeat_loop
        {
            $$ = new SyntaxNode("Comando", [$1]);
        }
    | conditional
        {
            $$ = new SyntaxNode("Comando", [$1]);
        }
    | assignment
        {
            $$ = new SyntaxNode("Comando", [$1]);
        }
    ;

conditional
    : T_IF expression then_token command_list else_token command_list T_ENDIF
        {
            tmpLabel = labelStack.pop();
            mvs.push({label: `L${tmpLabel}`, instruction: "NADA", parameter: null, to: null});
            $$ = new SyntaxNode("Condicional", [new SyntaxNode($1, []),$2,$3,$4,$5,$6,new SyntaxNode($7,[])]);
        }
    ;

then_token 
    : T_THEN
        {
            tmpType = typeStack.pop();

            if (tmpType !== types.LOGIC) 
                error(@1, "Incompatibilidade de tipo.");
            

            mvs.push({label: null, instruction: "DSVF", parameter: null, to: `L${++label}`});
            labelStack.push(label);
            $$ = new SyntaxNode("Token então", [new SyntaxNode($1,[])]);
        }
    ;

else_token
    : T_ELSE
        {
            mvs.push({label: null, instruction: "DSVS", parameter: null, to: `L${++label}`});
            tmpLabel = labelStack.pop();
            mvs.push({label: `L${tmpLabel}`, instruction: "NADA", parameter: null, to: null});
            labelStack.push(label);
            $$ = new SyntaxNode("Token Senão", [new SyntaxNode($1,[])]);
        }
    ;



assignment
    : assignment_identifier T_ATRIB expression 
        {
            tmpType = typeStack.pop();
            tmpPos = labelStack.pop(); 

            if (variableTable[tmpPos].type != tmpType) 
                error(@3, "Incompatibilidade de tipo.");
            
            mvs.push({label: null, instruction: "ARZG", parameter: variableTable[tmpPos].address, to: null});
            $$ = new SyntaxNode("Atribuição", [$1, new SyntaxNode($2,[]), $3]);
        }
    ;

assignment_identifier
    : T_IDENTIFIER
        {
            tmpPos = findVariablePosition($1);
            labelStack.push(tmpPos); 
            $$ = new SyntaxNode("Identificador de atribuição", [new SyntaxNode($1,[])]);
        }
    ;

input_output
    : input
        {
            $$ = new SyntaxNode("Entrada/Saída", [$1]);
        } 
    | output
        {
            $$ = new SyntaxNode("Entrada/Saída", [$1]);
        }
    ;

input 
    : T_READ T_IDENTIFIER 
        {
            let variable = findVariable($2);
            mvs.push({label: null, instruction: "LEIA", parameter: null, to: null});
            mvs.push({label: null, instruction: "ARZG", parameter: variable.address, to: null});
            $$ = new SyntaxNode("Entrada", [new SyntaxNode($1,[]), new SyntaxNode($2,[])]);
        }
    ;

output
    : T_PRINT expression
        {
            tmpType = typeStack.pop();
            mvs.push({label: null, instruction: "ESCR", parameter: null, to: null});
            $$ = new SyntaxNode("Saída", [new SyntaxNode($1,[]), $2]);
        }
    ;

repeat_loop
    : while_token expression do_token command_list T_ENDWHILE
        {
            let firstLabel = labelStack.pop();
            let secondLabel = labelStack.pop();
            mvs.push({label: null, instruction: "DSVS", to: `L${secondLabel}`, parameter: null});
            mvs.push({label: `L${firstLabel}`, instruction: "NADA", parameter: null, to: null});
            $$ = new SyntaxNode("Loop de repetição", [$1, $2, $3, $4, new SyntaxNode($5, [])]);
        }
    ;

while_token
    : T_WHILE
        {
            mvs.push({label: `L${++label}`, instruction: "NADA", parameter: null, to: null});
            labelStack.push(label);
            $$ = new SyntaxNode("Token enquanto", [new SyntaxNode($1,[])]);
        }
    ;

do_token
    : T_DO 
        {
            tmpType = typeStack.pop();
            if (tmpType !== types.LOGIC) 
                error(@1, "Incompatibilidade de tipo.")
            mvs.push({label: null, instruction: "DSVF", parameter: null, to: `L${++label}`});
            labelStack.push(label);
            $$ = new SyntaxNode("Faça Token", [new SyntaxNode($1,[])]);
        }
    ;

expression 
    : expression T_TIMES   expression
        {
            typeCheck(types.INTEGER, types.INTEGER, types.INTEGER);
            mvs.push({label: null, instruction: "MULT", parameter: null, to: null});
            $$ = new SyntaxNode("Expressão", [$1, new SyntaxNode($2,[]), $3]);
        }
    | expression T_DIV     expression
        {
            typeCheck(types.INTEGER, types.INTEGER, types.INTEGER);
            mvs.push({label: null, instruction: "DIVI", parameter: null, to: null});
            $$ = new SyntaxNode("Expressão", [$1, new SyntaxNode($2,[]), $3]);
        }
    | expression T_PLUS    expression
        {
            typeCheck(types.INTEGER, types.INTEGER, types.INTEGER);
            mvs.push({label: null, instruction: "SOMA", parameter: null, to: null});
            $$ = new SyntaxNode("Expressão", [$1, new SyntaxNode($2,[]), $3]);
        }
    | expression T_MINUS   expression
        {
            typeCheck(types.INTEGER, types.INTEGER, types.INTEGER);
            mvs += `\tSUBT\t\n`;
            $$ = new SyntaxNode("Expressão", [$1, new SyntaxNode($2,[]), $3]);
        } 
    | expression T_GREATER expression
        {
            typeCheck(types.INTEGER, types.INTEGER, types.LOGIC);
            mvs.push({label: null, instruction: "CMMA", parameter: null, to: null});
            $$ = new SyntaxNode("Expressão", [$1, new SyntaxNode($2,[]), $3]);
        } 
    | expression T_LESS    expression
        {
            typeCheck(types.INTEGER, types.INTEGER, types.LOGIC);
            mvs.push({label: null, instruction: "CMME", parameter: null, to: null});
            $$ = new SyntaxNode("Expressão", [$1, new SyntaxNode($2,[]), $3]);
        } 
    | expression T_EQUAL   expression
        {
            typeCheck(types.INTEGER, types.INTEGER, types.LOGIC);
            mvs.push({label: null, instruction: "CMIG", parameter: null, to: null});
            $$ = new SyntaxNode("Expressão", [$1, new SyntaxNode($2,[]), $3]);
        } 
    | expression T_AND     expression
        {
            typeCheck(types.LOGIC, types.LOGIC, types.LOGIC);
            mvs.push({label: null, instruction: "CONJ", parameter: null, to: null});
            $$ = new SyntaxNode("Expressão", [$1, new SyntaxNode($2,[]), $3]);
        } 
    | expression T_OR      expression
        {
            typeCheck(types.LOGIC, types.LOGIC, types.LOGIC);
            mvs.push({label: null, instruction: "DISJ", parameter: null, to: null});
            $$ = new SyntaxNode("Expressão", [$1, new SyntaxNode($2,[]), $3]);
        }
    | term
        {
            $$ = new SyntaxNode("Expressão", [$1]);
        }
    
    ;

term
    : T_IDENTIFIER
        {
            tmpVariableName = $1;
            tmpVariable = findVariable(tmpVariableName);
            mvs.push({label: null, instruction: "CRVG", parameter: tmpVariable.address, to: null});
            typeStack.push(tmpVariable.type); 
            $$ = new SyntaxNode("Termo", [new SyntaxNode($1, [])]);
        }
    | T_NUMBER
        {
            mvs.push({label: null, instruction: "CRCT", parameter: parseInt($1)   , to: null});
            typeStack.push(types.INTEGER);
            $$ = new SyntaxNode("Termo", [new SyntaxNode($1, [])]);
        }
    | T_T
        {
            mvs.push({label: null, instruction: "CRCT", parameter: 1, to: null});
            typeStack.push(types.LOGIC);
            $$ = new SyntaxNode("Termo", [new SyntaxNode($1, [])]);
        }
    | T_F
        {
            mvs.push({label: null, instruction: "CRCT", parameter: 0, to: null});
            typeStack.push(types.LOGIC);
            $$ = new SyntaxNode("Termo", [new SyntaxNode($1, [])]);
        }
    | T_NOT term
        {
            tmpType = typeStack.pop();
            if (tmpType !== types.LOGIC) 
                error(@2, "Incompatibilidade de tipo.");
            mvs.push({label: null, instruction: "NEGA", parameter: null, to: null});
            typeStack.push(types.LOGIC);
            $$ = new SyntaxNode("Termo", [new SyntaxNode($1, []), $2]);
        }
    | T_OPEN expression T_CLOSE
        {
            $$ = new SyntaxNode("Termo", [new SyntaxNode($1, []),$2,new SyntaxNode($3, [])]);
        }
    ;

footer
    : T_END EOF
        {   
            mvs.push({label: null, instruction: "DMEM", parameter: variableCount, to: null});
            mvs.push({label: null, instruction: "FIMP", parameter: null, to: null});

            $$ = new SyntaxNode("Rodapé", [new SyntaxNode($1,[])]);
        }
    ;