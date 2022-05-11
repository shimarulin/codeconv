#!/usr/bin/env bash

find "$(npm prefix -g)"/lib/node_modules -type l -delete
rm "$(npm prefix -g)"/bin/codeconv
rm "$(npm prefix -g)"/bin/codeconv-create
