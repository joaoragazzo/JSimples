%{

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

let outputMvs = "",
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
    tmpVariable;

const clearEverything = () => {
    variableTable.length = 0;
    typeStack.length = 0;
    labelStack.length = 0;
    outputMvs = "";
    variableCount = 0;
    label = 0;
}

const addVariable = (v) => {
    const nameAlreadyExists = variableTable.some(variable => variable.name === v.name);
    
    if (nameAlreadyExists) {
        throw new Error("Essa variavel já existe.");
        clearEverything();
    }
    
    variableTable.push(v);
}

const typeCheck = (type1, type2, resultType) => {
    const semanticType1 = typeStack.pop();
    const semanticType2 = typeStack.pop();

    if (type1 === semanticType1 && semanticType2 === type2) {
        typeStack.push(resultType);
        return;
    }
    clearEverything();
    throw new Error("Incompatibilidade de tipo!");
}

const findVariable = (variableName) => {
    const variable = variableTable.find(variable => variable.name === variableName);
    if (variable) {
        return variable;
    }
    clearEverything();
    throw new Error("Essa variável não foi declarada!");
}

const findVariablePosition = (variableName) => {
    const index = variableTable.findIndex(variable => variable.name === variableName);
    if (index != -1) {
        return index;
    }
    clearEverything();
    throw new Error("Essa variável não foi declarada!");
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
                mvsCode: outputMvs, 
                variableTable: [...variableTable] 
            }

            clearEverything();

            return result;            
        }
    ;

start_block 
    : T_START
        {
            outputMvs += `\tAMEM\t${variableCount}\n`; 
            $$ = new SyntaxNode($1, []);
        }
    ;

header
    : T_PROGRAM T_IDENTIFIER
        {
            outputMvs += "\tINPP\t\n";
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
            addVariable({type: variableType, name: $2, address: variableCount});
            variableCount++; 
            $$ = new SyntaxNode("Lista de variáveis", [$1, new SyntaxNode($2,[])])
        }
    | T_IDENTIFIER
        {
            addVariable({type: variableType, name: $1, address: variableCount});
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
            outputMvs += `L${tmpLabel}\tNADA\t\n`;
            $$ = new SyntaxNode("Condicional", [new SyntaxNode($1, []),$2,$3,$4,$5,$6,new SyntaxNode($7,[])]);
        }
    ;

then_token 
    : T_THEN
        {
            tmpType = typeStack.pop();

            if (tmpType !== types.LOGIC) {
                throw new Error("Incompatibilidade de tipo!");
            }

            outputMvs += `\tDSVF\tL${++label}\n`;
            labelStack.push(label);
            $$ = new SyntaxNode("Token então", [new SyntaxNode($1,[])]);
        }
    ;

else_token
    : T_ELSE
        {
            outputMvs += `\tDSVS\tL${++label}\n`;
            tmpLabel = labelStack.pop();
            outputMvs += `L${tmpLabel}\tNADA\t\n`;
            labelStack.push(label);
            $$ = new SyntaxNode("Token Senão", [new SyntaxNode($1,[])]);
        }
    ;



assignment
    : assignment_identifier T_ATRIB expression 
        {
            tmpType = typeStack.pop();
            tmpPos = labelStack.pop(); 

            if (variableTable[tmpPos].type != tmpType) {
                throw new Error("Incompatibilidade de tipo!");
            }

            outputMvs += `\tARZG\t${variableTable[tmpPos].address}\n`
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
            outputMvs += `\tLEIA\t\n`;
            outputMvs += `\tARZG\t${variable.address}\n`;
            $$ = new SyntaxNode("Entrada", [new SyntaxNode($1,[]), new SyntaxNode($2,[])]);
        }
    ;

output
    : T_PRINT expression
        {
            tmpType = typeStack.pop();
            outputMvs += `\tESCR\t\n`;
            $$ = new SyntaxNode("Saída", [new SyntaxNode($1,[]), $2]);
        }
    ;

repeat_loop
    : while_token expression do_token command_list T_ENDWHILE
        {
            let firstLabel = labelStack.pop();
            let secondLabel = labelStack.pop();
            outputMvs += `\tDSVS\tL${secondLabel}\n`;
            outputMvs += `L${firstLabel}\tNADA\t\n`;
            $$ = new SyntaxNode("Loop de repetição", [$1, $2, $3, $4, new SyntaxNode($5, [])]);
        }
    ;

while_token
    : T_WHILE
        {
            outputMvs += `L${++label}\tNADA\t\n`;
            labelStack.push(label);
            $$ = new SyntaxNode("Token enquanto", [new SyntaxNode($1,[])]);
        }
    ;

do_token
    : T_DO 
        {
            tmpType = typeStack.pop();
            if (tmpType !== types.LOGIC) 
                throw new Error("Incompatibilidade de tipo!");
            outputMvs += `\tDSVF\tL${++label}\n`;
            labelStack.push(label);
            $$ = new SyntaxNode("Facá Token", [new SyntaxNode($1,[])]);
        }
    ;

expression 
    : expression T_TIMES   expression
        {
            typeCheck(types.INTEGER, types.INTEGER, types.INTEGER);
            outputMvs += `\tMULT\t\n`;
            $$ = new SyntaxNode("Expressão", [$1, new SyntaxNode($2,[]), $3]);
        }
    | expression T_DIV     expression
        {
            typeCheck(types.INTEGER, types.INTEGER, types.INTEGER);
            outputMvs += `\tDIVI\t\n`;
            $$ = new SyntaxNode("Expressão", [$1, new SyntaxNode($2,[]), $3]);
        }
    | expression T_PLUS    expression
        {
            typeCheck(types.INTEGER, types.INTEGER, types.INTEGER);
            outputMvs += `\tSOMA\t\n`;
            $$ = new SyntaxNode("Expressão", [$1, new SyntaxNode($2,[]), $3]);
        }
    | expression T_MINUS   expression
        {
            typeCheck(types.INTEGER, types.INTEGER, types.INTEGER);
            outputMvs += `\tSUBT\t\n`;
            $$ = new SyntaxNode("Expressão", [$1, new SyntaxNode($2,[]), $3]);
        } 
    | expression T_GREATER expression
        {
            typeCheck(types.INTEGER, types.INTEGER, types.LOGIC);
            outputMvs += `\tCMMA\t\n`;
            $$ = new SyntaxNode("Expressão", [$1, new SyntaxNode($2,[]), $3]);
        } 
    | expression T_LESS    expression
        {
            typeCheck(types.INTEGER, types.INTEGER, types.LOGIC);
            outputMvs += `\tCMME\t\n`;
            $$ = new SyntaxNode("Expressão", [$1, new SyntaxNode($2,[]), $3]);
        } 
    | expression T_EQUAL   expression
        {
            typeCheck(types.INTEGER, types.INTEGER, types.LOGIC);
            outputMvs += `\tCMIG\t\n`;
            $$ = new SyntaxNode("Expressão", [$1, new SyntaxNode($2,[]), $3]);
        } 
    | expression T_AND     expression
        {
            typeCheck(types.LOGIC, types.LOGIC, types.LOGIC);
            outputMvs += `\tCONJ\t\n`;
            $$ = new SyntaxNode("Expressão", [$1, new SyntaxNode($2,[]), $3]);
        } 
    | expression T_OR      expression
        {
            typeCheck(types.LOGIC, types.LOGIC, types.LOGIC);
            outputMvs += `\tDISJ\t\n`;
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
            outputMvs += `\tCRVG\t${tmpVariable.address}\n`;
            typeStack.push(tmpVariable.type); 
            $$ = new SyntaxNode("Termo", [new SyntaxNode($1, [])]);
        }
    | T_NUMBER
        {
            outputMvs += `\tCRCT\t${$1}\n`;
            typeStack.push(types.INTEGER);
            $$ = new SyntaxNode("Termo", [new SyntaxNode($1, [])]);
        }
    | T_T
        {
            outputMvs += `\tCRCT\t1\n`;
            typeStack.push(types.LOGIC);
            $$ = new SyntaxNode("Termo", [new SyntaxNode($1, [])]);
        }
    | T_F
        {
            outputMvs += `\tCRCT\t0\n`;
            typeStack.push(types.LOGIC);
            $$ = new SyntaxNode("Termo", [new SyntaxNode($1, [])]);
        }
    | T_NOT term
        {
            tmpType = typeStack.pop();
            if (tmpType !== types.LOGIC) {
                throw new Error("Incompatibilidade de tipo!");
            }
            outputMvs += `\tNEGA\t\n`;
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
            outputMvs += `\tDMEM\t${variableCount}\n`;
            outputMvs += `\tFIMP\t\n`;

            $$ = new SyntaxNode("Rodapé", [new SyntaxNode($1,[])]);
        }
    ;