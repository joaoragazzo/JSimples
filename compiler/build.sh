#!/bin/bash

echo "+-----------------------------+"
echo "|   Compiling the compiler    |"
echo "+-----------------------------+"

jison simples.jison

echo "Compiler compiled successfully!"
echo ""

/home/0x6a70/faculdade/tcc/application/compiler/run_tests.sh
TEST_EXIT_CODE=$?

if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo ""
    echo "+-----------------------------+"
    echo "|   Exporting the compiler    |"
    echo "+-----------------------------+"

    cp simples.js ../app/src/core/compiler
    echo "export default simples;" >> ../app/src/core/compiler/simples.js
    
    echo "Successfully exported the compiler to the app."
    echo ""

else
    echo "Aborting deploy."
    exit 1
fi
