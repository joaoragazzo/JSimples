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
    
    const error = new Error(`ERROR [${errorInfo.line}:${errorInfo.column}]: ${errorInfo.message}`);
    clearEverything();
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

let mvs = [];

let tmptmp = 0;

let variableType = null,
    variableCount = 0,
    procAndFuncStarted = false,
    insideFunctionDeclaration = true;

const typeStack = [],
    labelStack = [];

let label = 0,
    tmpLabel,
    tmpType,
    tmpPos,
    tmpVariableId,
    tmpVariable,
    globalSymbolTable = [], // This is to save the global symbol table temporarly
    parameterStack = [],
    argumentStack = [],
    symbolTable = [],
    success,
    lastProcedure,
    procedureAndFunctionCount = 0,
    localVariableCount = 0,
    tmpArgument;

const clearEverything = () => { // Clean all variable in an error case
    symbolTable = [];
    typeStack.length = 0;
    labelStack.length = 0;
    mvs = [];
    variableCount = 0;
    label = 0;
    procAndFuncStarted = false;
    parameterStack = [];
    insideFunctionDeclaration = true;
    globalSymbolTable = [];
    lastProcedure = null;
    procedureAndFunctionCount = 0,
    localVariableCount = 0,
    argumentStack = []; 
}

/**
    Add a symbol to the current symbol table.
    @param {
                type: "LOGIC" | "INTEGER", 
                name: string, 
                address: number,
                scope: "LOCAL" | "GLOBAL",
                label: string,
                category: "VARIABLE" | "PROCEDURE",
                mechanism: null | "REF",
                parameter: string,
            } v 
    @returns {boolean} The status of the insert
*/
const addSymbol = (v) => {
    
    /* If the variable is on the same scope and with the same ID */
    const symbolNameAlreadyExists = symbolTable.some(
        variable => (variable.name === v.name && variable.scope === v.scope)
    );
    
    if (symbolNameAlreadyExists) 
        return false;    
    
    symbolTable.push(v);
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
    return symbolTable
        .slice() // used to make a copy and dont alter the original symbol table
        .reverse()
        .find(variable => variable.name === variableName) || false;
};

const findVariablePosition = (variableName) => {
    const index = symbolTable.findIndex(variable => variable.name === variableName);
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

"proc"          return "T_PROC";
"fimproc"       return "T_ENDPROC";
"ref"           return "T_REF";

<<EOF>>         return 'EOF';

[a-zA-Z][a-zA-Z0-9]*    return 'T_IDENTIFIER';
[0-9]+                  return 'T_NUMBER';

/lex 

%left T_AND T_OR 
%left T_EQUAL
%left T_GREATER T_LESS
%left T_PLUS T_MINUS
%left T_TIMES T_DIV 

%left T_OPEN
%nonassoc T_IDENTIFIER

%start algorithm
%%


algorithm
    : header variables routines start_block command_list footer
        {
            const headerNode = $1;
            const variablesNode = $2;
            const startBlockNode = $4;
            const commandsNode = $5;
            const footerNode = $6;

            const children = [headerNode];
            if (variablesNode) children.push(variablesNode);
            if (startBlockNode) children.push(startBlockNode);
            if (commandsNode) children.push(commandsNode);
            if (footerNode) children.push(footerNode);

            let syntaxTree = new SyntaxNode("Algoritmo", children);
            let result = { 
                syntaxTree: syntaxTree, 
                mvs: mvs, 
                symbolTable: [...symbolTable] 
            }

            console.log("=============DEBUG CONTENT=============");
            console.log(symbolTable);
            console.log("===========================");
            console.log(mvs);
            console.log("=============FINISHED CONTENT=============");

            clearEverything();
            
            return result;            
        }
    ;

routines
    : /* blank */
    | routines_list
        {   
            mvs.push({label: "L0", instruction: "NADA", parameter: null, first_line: 0, last_line: 0, first_column: 0, last_column: 0})    
        }
    ;

routines_list
    : routines_list routine
    | routine
    ;

routine
    : procedure
    // | function
    ;

procedure
    : procedure_header T_OPEN parameter_list routine_header_closed variables t_start_proc command_list T_ENDPROC
        {
            mvs.push({label: null, instruction: "RTSP", parameter: parameterStack.length, first_line: @8, last_line: @8, first_column: @8, last_column: @8})    
            lastProcedure = globalSymbolTable.at(-1);

            lastProcedure.subSymbolTree = symbolTable.slice(variableCount + ++procedureAndFunctionCount);
            symbolTable = [...globalSymbolTable]
            parameterStack = []
            
        }
    ;

t_start_proc 
    : T_START 
        {
            if (localVariableCount > 0)
                mvs.push({label: null, instruction: "AMEM", parameter: localVariableCount, first_line: @1.first_line, last_line: @1.last_line, first_column: @1.first_column, last_column: @1.last_column}); 
        }
    ;

routine_header_closed 
    : T_CLOSE 
        {
            parameterStack.reverse();
            for (let i = 0; i < parameterStack.length; i++) {
                parameterStack.at(i).address = -3 -i;
            }
            for (let i = 0; i < parameterStack.length; i++) {
                tmpVariable = parameterStack.at(i);
                success = addSymbol({
                    type: tmpVariable.type, 
                    name: tmpVariable.name, 
                    address: tmpVariable.address,
                    scope: tmpVariable.scope,
                    label: tmpVariable.label,
                    category: tmpVariable.category,
                    mechanism: tmpVariable.mechanism,
                    parameter: tmpVariable.parameter,
                    subSymbolTree: tmpVariable.subSymbolTree
                })
                if(!success)
                    error(tmpVariable.reference, "Nome do parâmetro já declarado nesse escopo")
            }
        }
    ;


procedure_header
    : T_PROC T_IDENTIFIER
        {
            if (!procAndFuncStarted) {
                procAndFuncStarted = true;
                mvs.push({label: null, instruction: "DSVS", parameter: "L0", first_line: 0, last_line: 0, first_column: 0, last_column: 0})    
            }

            addSymbol({
                type: null, 
                name: $2, 
                address: null,
                scope: "GLOBAL",
                label: ++label,
                category: "PROCEDURE",
                mechanism: null,
                parameter: [],
                subSymbolTree: null
            })

            mvs.push({label: `L${label}`, instruction: "ENSP", parameter: null, first_line: 0, last_line: 0, first_column: 0, last_column: 0})    
            globalSymbolTable = [...symbolTable];
        }
    ;


parameter_list
    : /* blank */
    | parameter_list parameter
    ;

parameter
    : mechanism type T_IDENTIFIER
        {
            parameterStack.push({
                type: variableType, 
                name: $3, 
                address: null,
                scope: "LOCAL",
                label: null,
                category: "VARIABLE",
                mechanism: $1,
                parameter: null,
                subSymbolTree: null,
                reference: @3
            })

            lastProcedure = globalSymbolTable.at(-1);
            lastProcedure.parameter.push({type: variableType, mechanism: $1});
        }
    ;

mechanism
    : /* blank */
        {
            $$ = "VALUE"
        }
    |  T_REF 
        {
            $$ = "REFERENCE"
        }
    ;

start_block 
    : T_START
        {
            mvs.push({label: null, instruction: "AMEM", parameter: variableCount, first_line: @1.first_line, last_line: @1.last_line, first_column: @1.first_column, last_column: @1.last_column}); 
            insideFunctionDeclaration = false;
            $$ = new SyntaxNode($1, []);

            if (globalSymbolTable.length) {
                symbolTable = [...globalSymbolTable]
            }

            
        }
    ;

header
    : T_PROGRAM T_IDENTIFIER
        {
            mvs.push({label: null, instruction: "INPP", parameter: null, first_line: @1.first_line, last_line: @2.last_line, first_column: @1.first_column, last_column: @2.last_column});
            $$ = new SyntaxNode("Cabeçalho", [
                new SyntaxNode($1, []), 
                new SyntaxNode($2, [])
            ]);
        }
    ;

variables
    : /* blank */
        {
            $$ = new SyntaxNode("IGNORE", []);
        }
    | variable_declaration 
        {
            $$ = new SyntaxNode("Variáveis", [$1]);
        }
    ;

variable_declaration
    : type variable_list variable_declaration 
        {
            $$ = new SyntaxNode("Declaração de variáveis", [$1, $2, $3]);
        }
    | type variable_list
        {
            $$ = new SyntaxNode("Declaração de variáveis", [$1, $2]);
        }
    ;

type 
    : T_LOGIC
        {
            variableType = types.LOGIC;
            $$ = new SyntaxNode("Tipo", [new SyntaxNode($1,[])]);
        }
    | T_INTEGER
        {
            variableType = types.INTEGER;
            $$ = new SyntaxNode("Tipo", [new SyntaxNode($1, [])]);
        }
    ;

variable_list
    : variable_list T_IDENTIFIER
        {
            if (!procAndFuncStarted) {
                success = addSymbol({
                    type: variableType, 
                    name: $2, 
                    address: variableCount++,
                    scope: "GLOBAL",
                    label: null,
                    category: "VARIABLE",
                    mechanism: null,
                    parameter: null,
                    subSymbolTree: null
                });

                if (!success) error(@1, "Nome de variável já declarada.");
            }

            if (procAndFuncStarted) {
                success = addSymbol({
                    type: variableType, 
                    name: $2, 
                    address: localVariableCount++,
                    scope: "LOCAL",
                    label: null,
                    category: "VARIABLE",
                    mechanism: null,
                    parameter: null,
                    subSymbolTree: null
                });

                if (!success) error(@1, "Nome de variável já declarada.");
            }
            
            $$ = new SyntaxNode("Lista de variáveis", [$1, new SyntaxNode($2,[])]);
        }
    | T_IDENTIFIER
        {

            if (!procAndFuncStarted) {
                success = addSymbol({
                    type: variableType, 
                    name: $1, 
                    address: variableCount++,
                    scope: "GLOBAL",
                    label: null,
                    category: "VARIABLE",
                    mechanism: null,
                    parameter: null,
                    subSymbolTree: null
                });

                if (!success) error(@1, "Nome de variável já declarada.");
            }

            if (procAndFuncStarted) {
                success = addSymbol({
                    type: variableType, 
                    name: $1, 
                    address: localVariableCount++,
                    scope: "LOCAL",
                    label: null,
                    category: "VARIABLE",
                    mechanism: null,
                    parameter: null,
                    subSymbolTree: null
                });

                if (!success) error(@1, "Nome de variável já declarada.");
            }
            
            $$ = new SyntaxNode("Lista de variáveis", [new SyntaxNode($1, [])]);
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
    | procedure_call
        {
            // add a syntax node for procedure call
        }
    ;

conditional
    : T_IF expression then_token command_list else_token command_list T_ENDIF
        {
            tmpLabel = labelStack.pop();
            mvs.push({label: `L${tmpLabel}`, instruction: "NADA", parameter: null, first_line: @7.first_line, last_line: @7.last_line, first_column: @7.first_column, last_column: @7.last_column});
            $$ = new SyntaxNode("Condicional", [new SyntaxNode($1, []),$2,$3,$4,$5,$6, new SyntaxNode($7,[])]);
        }
    ;

then_token 
    : T_THEN
        {
            tmpType = typeStack.pop();

            if (tmpType !== types.LOGIC) 
                error(@1, "Incompatibilidade de tipo.");
            
            mvs.push({label: null, instruction: "DSVF", parameter: `L${++label}`, first_line: @1.first_line, last_line: @1.last_line, first_column: @1.first_column, last_column: @1.last_column});
            labelStack.push(label);
            $$ = new SyntaxNode("Token então", [new SyntaxNode($1,[])]);
        }
    ;

else_token
    : T_ELSE
        {
            mvs.push({label: null, instruction: "DSVS", parameter: `L${++label}`, first_line: @1.first_line, last_line: @1.last_line, first_column: @1.first_column, last_column: @1.last_column});
            tmpLabel = labelStack.pop();
            mvs.push({label: `L${tmpLabel}`, instruction: "NADA", parameter: null, first_line: @1.first_line, last_line: @1.last_line, first_column: @1.first_column, last_column: @1.last_column});
            labelStack.push(label);
            $$ = new SyntaxNode("Token Senão", [new SyntaxNode($1,[])]);
        }
    ;



assignment
    : assignment_identifier T_ATRIB expression 
        {
            tmpType = typeStack.pop();
            tmpPos = labelStack.pop(); 

            if (symbolTable[tmpPos].type != tmpType) 
                error(@3, "Incompatibilidade de tipo.");
            
            if (!insideFunctionDeclaration)
                mvs.push({label: null, instruction: "ARZG", parameter: symbolTable[tmpPos].address, first_line: @2.first_line, last_line: @2.last_line, first_column: @2.first_column, last_column: @2.last_column});
            
            if (insideFunctionDeclaration)
                mvs.push({label: null, instruction: "ARZL", parameter: symbolTable[tmpPos].address, first_line: @2.first_line, last_line: @2.last_line, first_column: @2.first_column, last_column: @2.last_column});
        
            
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
            mvs.push({label: null, instruction: "LEIA", parameter: null, first_line: @1.first_line, last_line: @1.last_line, first_column: @1.first_column, last_column: @1.last_column});
            mvs.push({label: null, instruction: "ARZG", parameter: variable.address, first_line: @2.first_line, last_line: @2.last_line, first_column: @2.first_column, last_column: @2.last_column});
            $$ = new SyntaxNode("Entrada", [new SyntaxNode($1,[]), new SyntaxNode($2,[])]);
        }
    ;

output
    : T_PRINT expression
        {
            tmpType = typeStack.pop();
            mvs.push({label: null, instruction: "ESCR", parameter: null, first_line: @1.first_line, last_line: @1.last_line, first_column: @1.first_column, last_column: @1.last_column});
            $$ = new SyntaxNode("Saída", [new SyntaxNode($1,[]), $2]);
        }
    ;

repeat_loop
    : while_token expression do_token command_list T_ENDWHILE
        {
            let firstLabel = labelStack.pop();
            let secondLabel = labelStack.pop();
            mvs.push({label: null, instruction: "DSVS", parameter: `L${secondLabel}`, first_line: @5.first_line, last_line: @5.last_line, first_column: @5.first_column, last_column: @5.last_column});
            mvs.push({label: `L${firstLabel}`, instruction: "NADA", parameter: null, first_line: @5.first_line, last_line: @5.last_line, first_column: @5.first_column, last_column: @5.last_column});
            $$ = new SyntaxNode("Loop de repetição", [$1, $2, $3, $4, new SyntaxNode($5, [])]);
        }
    ;

while_token
    : T_WHILE
        {
            mvs.push({label: `L${++label}`, instruction: "NADA", parameter: null, first_line: @1.first_line, last_line: @1.last_line, first_column: @1.first_column, last_column: @1.last_column});
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
            mvs.push({label: null, instruction: "DSVF", parameter: `L${++label}`, first_line: @1.first_line, last_line: @1.last_line, first_column: @1.first_column, last_column: @1.last_column});
            labelStack.push(label);
            $$ = new SyntaxNode("Faça Token", [new SyntaxNode($1,[])]);
        }
    ;

expression 
    : expression T_TIMES   expression
        {
            typeCheck(types.INTEGER, types.INTEGER, types.INTEGER);
            mvs.push({label: null, instruction: "MULT", parameter: null, first_line: @2.first_line, last_line: @2.last_line, first_column: @2.first_column, last_column: @2.last_column});
            $$ = new SyntaxNode("Expressão", [$1, new SyntaxNode($2,[]), $3]);
        }
    | expression T_DIV     expression
        {
            typeCheck(types.INTEGER, types.INTEGER, types.INTEGER);
            mvs.push({label: null, instruction: "DIVI", parameter: null, first_line: @2.first_line, last_line: @2.last_line, first_column: @2.first_column, last_column: @2.last_column});
            $$ = new SyntaxNode("Expressão", [$1, new SyntaxNode($2,[]), $3]);
        }
    | expression T_PLUS    expression
        {
            typeCheck(types.INTEGER, types.INTEGER, types.INTEGER);
            mvs.push({label: null, instruction: "SOMA", parameter: null, first_line: @2.first_line, last_line: @2.last_line, first_column: @2.first_column, last_column: @2.last_column});
            $$ = new SyntaxNode("Expressão", [$1, new SyntaxNode($2,[]), $3]);
        }
    | expression T_MINUS   expression
        {
            typeCheck(types.INTEGER, types.INTEGER, types.INTEGER);
            mvs.push({label: null, instruction: "SUBT", parameter: null, first_line: @2.first_line, last_line: @2.last_line, first_column: @2.first_column, last_column: @2.last_column});
            $$ = new SyntaxNode("Expressão", [$1, new SyntaxNode($2,[]), $3]);
        } 
    | expression T_GREATER expression
        {
            typeCheck(types.INTEGER, types.INTEGER, types.LOGIC);
            mvs.push({label: null, instruction: "CMMA", parameter: null, first_line: @2.first_line, last_line: @2.last_line, first_column: @2.first_column, last_column: @2.last_column});
            $$ = new SyntaxNode("Expressão", [$1, new SyntaxNode($2,[]), $3]);
        } 
    | expression T_LESS    expression
        {
            typeCheck(types.INTEGER, types.INTEGER, types.LOGIC);
            mvs.push({label: null, instruction: "CMME", parameter: null, first_line: @2.first_line, last_line: @2.last_line, first_column: @2.first_column, last_column: @2.last_column});
            $$ = new SyntaxNode("Expressão", [$1, new SyntaxNode($2,[]), $3]);
        } 
    | expression T_EQUAL   expression
        {
            typeCheck(types.INTEGER, types.INTEGER, types.LOGIC);
            mvs.push({label: null, instruction: "CMIG", parameter: null, first_line: @2.first_line, last_line: @2.last_line, first_column: @2.first_column, last_column: @2.last_column});
            $$ = new SyntaxNode("Expressão", [$1, new SyntaxNode($2,[]), $3]);
        } 
    | expression T_AND     expression
        {
            typeCheck(types.LOGIC, types.LOGIC, types.LOGIC);
            mvs.push({label: null, instruction: "CONJ", parameter: null, first_line: @2.first_line, last_line: @2.last_line, first_column: @2.first_column, last_column: @2.last_column});
            $$ = new SyntaxNode("Expressão", [$1, new SyntaxNode($2,[]), $3]);
        } 
    | expression T_OR      expression
        {
            typeCheck(types.LOGIC, types.LOGIC, types.LOGIC);
            mvs.push({label: null, instruction: "DISJ", parameter: null, first_line: @2.first_line, last_line: @2.last_line, first_column: @2.first_column, last_column: @2.last_column});
            $$ = new SyntaxNode("Expressão", [$1, new SyntaxNode($2,[]), $3]);
        }
    | term
        {
            $$ = new SyntaxNode("Expressão", [$1]);
        }
    ;

arguments 
    : /* blank */
    | argument_list
    ;

argument_list 
    : argument_list expression {
            tmpArgument = argumentStack.pop();
            if (tmpArgument.type != typeStack.pop()) {
               error(@2, `Tipo errado de parâmetro.`)
            }
        }
    | expression 
        {
            tmpArgument = argumentStack.pop();
            if (tmpArgument.type != typeStack.pop()) {
               error(@1, `Tipo errado de parâmetro.`)
            }
        }
    ;


procedure_call_header
    : T_IDENTIFIER T_OPEN
        {
            tmpVariableId = $1;
            tmpVariable = findVariable(tmpVariableId);
            argumentStack = [...tmpVariable.parameter];
            argumentStack.reverse();
            $$ = @1;
        }
    ;

procedure_call
    : procedure_call_header arguments T_CLOSE
        {
            mvs.push({label: null, instruction: "DSVS", parameter: `L${tmpVariable.label}`, first_line: $1.first_line, last_line: @3.last_line, first_column: $1.first_column, last_column: @3.last_column})    
        }
    ;


term
    : T_IDENTIFIER 
        {
            if (insideFunctionDeclaration) {
                tmpVariableId = $1;
                tmpVariable = findVariable(tmpVariableId);
                mvs.push({label: null, instruction: "CRVL", parameter: tmpVariable.address, first_line: @1.first_line, last_line: @1.last_line, first_column: @1.first_column, last_column: @1.last_column});
                typeStack.push(tmpVariable.type); 
            }
            
            if (!insideFunctionDeclaration) {
                tmpVariableId = $1;
                tmpVariable = findVariable(tmpVariableId);
                mvs.push({label: null, instruction: "CRVG", parameter: tmpVariable.address, first_line: @1.first_line, last_line: @1.last_line, first_column: @1.first_column, last_column: @1.last_column});
                typeStack.push(tmpVariable.type); 
            }
            
            $$ = new SyntaxNode("Termo", [new SyntaxNode($1, [])]);
        }
    // |  T_IDENTIFIER T_OPEN arguments T_CLOSE
    //     {
    //         // Isso aqui é para função (apenas)
    //     }
    | T_NUMBER
        {
            mvs.push({label: null, instruction: "CRCT", parameter: parseInt($1), first_line: @1.first_line, last_line: @1.last_line, first_column: @1.first_column, last_column: @1.last_column});
            typeStack.push(types.INTEGER);
            $$ = new SyntaxNode("Termo", [new SyntaxNode($1, [])]);
        }
    | T_T
        {
            mvs.push({label: null, instruction: "CRCT", parameter: 1, first_line: @1.first_line, last_line: @1.last_line, first_column: @1.first_column, last_column: @1.last_column});
            typeStack.push(types.LOGIC);
            $$ = new SyntaxNode("Termo", [new SyntaxNode($1, [])]);
        }
    | T_F
        {
            mvs.push({label: null, instruction: "CRCT", parameter: 0, first_line: @1.first_line, last_line: @1.last_line, first_column: @1.first_column, last_column: @1.last_column});
            typeStack.push(types.LOGIC);
            $$ = new SyntaxNode("Termo", [new SyntaxNode($1, [])]);
        }
    | T_NOT term
        {
            tmpType = typeStack.pop();
            if (tmpType !== types.LOGIC) 
                error(@2, "Incompatibilidade de tipo.");
            mvs.push({label: null, instruction: "NEGA", parameter: null, first_line: @1.first_line, last_line: @1.last_line, first_column: @1.first_column, last_column: @1.last_column});
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
            mvs.push({label: null, instruction: "DMEM", parameter: variableCount, first_line: @1.first_line, last_line: @1.last_line, first_column: @1.first_column, last_column: @1.last_column});
            mvs.push({label: null, instruction: "FIMP", parameter: null, first_line: @1.first_line, last_line: @1.last_line, first_column: @1.first_column, last_column: @1.last_column});

            $$ = new SyntaxNode("Rodapé", [new SyntaxNode($1,[])]);
        }
    ;