#!/bin/bash

# stop container, if it exists

if [[ "$(docker ps -a -q -f name=test-postgres)" ]]; then
  docker stop test-postgres
fi

# remove container
if [[ "$(docker ps -a -q -f name=test-postgres)" ]]; then
  docker rm -f test-postgres
fi

# reset NODE_ENV to default
if [[ "$OSTYPE" == "msys" ]]; then
  if [ -n "$PSModulePath" ]; then
    # PowerShell
    echo '$env:NODE_ENV="development"' | powershell -Command -
  else
    # CMD
    cmd.exe /C "set NODE_ENV=development"
  fi
else
  export NODE_ENV=development
fi