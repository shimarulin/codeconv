#!/usr/bin/env bash

ln -s -f "$(pwd)"/node_modules/* "$(npm root --global)"
ln -s -f "$(pwd)"/packages/@codeconv/cli/bin/run.js "$(npm bin --global)"/codeconv
