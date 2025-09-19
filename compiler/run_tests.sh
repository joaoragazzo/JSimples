#!/bin/bash
echo "+-----------------------------+"
echo "| Running tests for compiling |"
echo "+-----------------------------+"

PROGRAM="/home/0x6a70/faculdade/tcc/application/compiler/simples.js"

INPUT_DIR="tests/inputs"
EXPECTED_DIR="tests/expected"
OUTPUT_DIR="tests/output"
all_passed=true

mkdir -p "$OUTPUT_DIR"

# Cores ANSI
GREEN="\033[0;32m"
RED="\033[0;31m"
NC="\033[0m" # reset

for input in $(ls "$INPUT_DIR"/*.in | sort -V); do
    test_name=$(basename "$input" .in)
    expected="$EXPECTED_DIR/$test_name.out"
    output="$OUTPUT_DIR/$test_name.out"


    node "$PROGRAM" "$input" > "$output"

    if diff -u -w "$expected" "$output" > /dev/null; then
        echo -e "${GREEN}File $test_name: Successfully compiled!${NC}"
    else
        echo ""
        echo -e "${RED}======== File $test_name: Failed to compile! ========${NC}"
        echo "Diff:"
        diff -u "$expected" "$output"
        echo -e "${RED}=====================================================${NC}"
        all_passed=false
        echo ""
    fi
done

echo ""

if [ "$all_passed" = true ]; then
    echo -e "${GREEN}All tests passed successfully.${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed.${NC}"
    exit 1
fi
