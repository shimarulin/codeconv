#!/usr/bin/env bash

ln -s -f "$(pwd)"/node_modules/* "$(npm root --global)"
ln -s -f "$(pwd)"/packages/@codeconv/codeconv/bin/run.js "$(npm bin --global)"/codeconv
ln -s -f "$(pwd)"/packages/@codeconv/create/bin/run "$(npm bin --global)"/codeconv-create
