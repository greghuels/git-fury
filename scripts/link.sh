#!/usr/bin/env bash
set -e

pushd $(git rev-parse --show-toplevel)
if [ $(basename $(pwd)) != "git-fury" ]; then
  echo 'must be run from git-fury project'
  exit 1
fi

mv ./git-fury /usr/local/bin
