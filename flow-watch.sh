#!/usr/bin/env bash
./node_modules/.bin/flow status;
fswatch -e "/\." -o . | xargs -n 1 -I{} ./flow status;
