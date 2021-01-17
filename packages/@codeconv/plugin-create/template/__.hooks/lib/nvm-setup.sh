#!/bin/sh

# configure NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Set Node version
[ -s "$PWD/.nvmrc" ] && nvm use
