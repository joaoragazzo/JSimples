%{

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

const addVariable = (v) => {
    const nameAlreadyExists = variableTable.some(variable => variable.name === v.name);
    
    if (nameAlreadyExists)
        throw new Error("Essa variavel já existe.");
    
    variableTable.push(v);
}

const typeCheck = (type1, type2, resultType) => {
    const semanticType1 = typeStack.pop();
    const semanticType2 = typeStack.pop();

    if (type1 === semanticType1 && semanticType2 === type2) {
        typeStack.push(resultType);
        return;
    }

    throw new Error("Incompatibilidade de tipo!");
}

const findVariable = (variableName) => {
    const variable = variableTable.find(variable => variable.name === variableName);
    if (variable) {
        return variable;
    }
    throw new Error("Essa variável não foi declarada!");
}

const findVariablePosition = (variableName) => {
    const index = variableTable.findIndex(variable => variable.name === variableName);
    if (index != -1) {
        return index;
    }
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

">"             return "T_GREATER";
"<"             return "T_LESS";
"="             return "T_EQUAL";

"e"             return "T_AND";
"ou"            return "T_OR";
"nao"           return "T_NOT";
"<-"            return "T_ATRIB";
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
    ;

start_block 
    : T_START
        {
           outputMvs += `\tAMEM\t${variableCount}\n`; 
        }
    ;

header
    : T_PROGRAM T_IDENTIFIER
        {
            outputMvs += "\tINPP\t\n"
        }
    ;

variables
    : /* blank */
    | variable_declaration
    ;

variable_declaration
    : type variable_list variable_declaration
    | type variable_list 
    ;

type 
    : T_LOGIC
        {
            variableType = types.LOGIC;
        }
    | T_INTEGER
        {
            variableType = types.INTEGER;
        }
    ;

variable_list
    : variable_list T_IDENTIFIER
        {
            addVariable({type: variableType, name: $2, address: variableCount});
            variableCount++; 
        }
    | T_IDENTIFIER
        {
            addVariable({type: variableType, name: $1, address: variableCount});
            variableCount++;
        }
    ;

command_list
    : /* blank */
    | command command_list
    ;

command 
    : input_output
    | repeat_loop
    | conditional
    | assignment
    ;

conditional
    : T_IF expression then_token command_list else_token command_list T_ENDIF
        {
            tmpLabel = labelStack.pop();
            outputMvs += `L${tmpLabel}\tNADA\t\n`;
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
        }
    ;

else_token
    : T_ELSE
        {
            outputMvs += `\tDSVS\tL${++label}\n`;
            tmpLabel = labelStack.pop();
            outputMvs += `L${tmpLabel}\tNADA\t\n`;
            labelStack.push(label);
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
        }
    ;

assignment_identifier
    : T_IDENTIFIER
        {
            tmpPos = findVariablePosition($1);
            labelStack.push(tmpPos); 
        }
    ;

input_output
    : input 
    | output 
    ;

input 
    : T_READ T_IDENTIFIER 
        {
            let variable = findVariable($2);
            outputMvs += `\tLEIA\t\n`;
            outputMvs += `\tARZG\t${variable.address}\n`;
        }
    ;

output
    : T_PRINT expression
        {
            tmpType = typeStack.pop();
            outputMvs += `\tESCR\t\n`;
        }
    ;

repeat_loop
    : while_token expression do_token command_list T_ENDWHILE
        {
            let firstLabel = labelStack.pop();
            let secondLabel = labelStack.pop();
            outputMvs += `\tDSVS\tL${secondLabel}\n`;
            outputMvs += `L${firstLabel}\tNADA\t\n`;
        }
    ;

while_token
    : T_WHILE
        {
            outputMvs += `L${++label}\tNADA\t\n`;
            labelStack.push(label);
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
        }
    ;

expression 
    : expression T_TIMES   expression
        {
            typeCheck(types.INTEGER, types.INTEGER, types.INTEGER);
            outputMvs += `\tMULT\t\n`;   
        }
    | expression T_DIV     expression
        {
            typeCheck(types.INTEGER, types.INTEGER, types.INTEGER);
            outputMvs += `\tDIVI\t\n`;
        }
    | expression T_PLUS    expression
        {
            typeCheck(types.INTEGER, types.INTEGER, types.INTEGER);
            outputMvs += `\tSOMA\t\n`;
        }
    | expression T_MINUS   expression
        {
            typeCheck(types.INTEGER, types.INTEGER, types.INTEGER);
            outputMvs += `\tSUBT\t\n`;
        } 
    | expression T_GREATER expression
        {
            typeCheck(types.INTEGER, types.INTEGER, types.LOGIC);
            outputMvs += `\tCMMA\t\n`;
        } 
    | expression T_LESS    expression
        {
            typeCheck(types.INTEGER, types.INTEGER, types.LOGIC);
            outputMvs += `\tCMME\t\n`;
        } 
    | expression T_EQUAL   expression
        {
            typeCheck(types.INTEGER, types.INTEGER, types.LOGIC);
            outputMvs += `\tCMIG\t\n`;
        } 
    | expression T_AND     expression
        {
            typeCheck(types.LOGIC, types.LOGIC, types.LOGIC);
            outputMvs += `\tCONJ\t\n`;
        } 
    | expression T_OR      expression
        {
            typeCheck(types.LOGIC, types.LOGIC, types.LOGIC);
            outputMvs += `\tDISJ\t\n`;
        }
    | term
    ;

term
    : T_IDENTIFIER
        {
            tmpVariableName = $1;
            tmpVariable = findVariable(tmpVariableName);
            outputMvs += `\tCRVG\t${tmpVariable.address}\n`;
            typeStack.push(tmpVariable.type); 
        }
    | T_NUMBER
        {
            outputMvs += `\tCRCT\t${$1}\n`;
            typeStack.push(types.INTEGER);
        }
    | T_T
        {
            outputMvs += `\tCRCT\t1\n`;
            typeStack.push(types.LOGIC);
        }
    | T_F
        {
            outputMvs += `\tCRCT\t0\n`;
            typeStack.push(types.LOGIC);
        }
    | T_NOT term
        {
            tmpType = typeStack.pop();
            if (tmpType !== types.LOGIC) {
                throw new Error("Incompatibilidade de tipo!");
            }
            outputMvs += `\tNEGA\t\n`;
            typeStack.push(types.LOGIC);
        }
    | T_OPEN expression T_CLOSE
    ;

footer
    : T_END EOF
        {   
            outputMvs += `\tDMEM\t${variableCount}\n`;
            outputMvs += `\tFIMP\t\n`;
            console.log("===== Tabela de variáveis =====");
            console.log(variableTable);
            console.log("===== MVS Output =====");
            console.log(outputMvs)
        }
    ;