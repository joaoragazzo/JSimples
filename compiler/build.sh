#!/bin/bash

jison simples.jison
cp simples.js ../app/src/core/compiler
echo  "export default simples;" >> ../app/src/core/compiler/simples.js
