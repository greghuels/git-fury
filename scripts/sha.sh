#!/usr/bin/env bash
set -e

pushd $(git rev-parse --show-toplevel)
if [ $(basename $(pwd)) != "git-fury" ]; then
  echo "must be run from git-fury project"
  exit 1
fi

version=$(cat ./version.ts | sed -e 's/export default "//' | sed -e 's/";//')

export targets=( "aarch64-apple-darwin" "x86_64-apple-darwin" "x86_64-unknown-linux-gnu" )

if [ ! -d "./target/${version}" ]; then
  echo "./target/${version} folder does not exist"
  exit 1
fi

for target in "${targets[@]}"
do
   :
   filename="./target/${version}/git-fury-${target}"
   shasum -a 256 ${filename}.tar.gz
done