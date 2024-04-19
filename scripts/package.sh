#!/usr/bin/env bash
set -e

pushd "$(git rev-parse --show-toplevel)"
if [ $(basename $(pwd)) != "git-fury" ]; then
  echo "must be run from git-fury project"
  exit 1
fi

export version="$(cat ./version.ts | sed -e 's/export default "//' | sed -e 's/";//')"
if [ ! -d "./target" ]; then
  mkdir target
fi
rm -rf "target/$version"
mkdir "target/$version"

export targets=("x86_64-unknown-linux-gnu" "aarch64-unknown-linux-gnu" "x86_64-pc-windows-msvc" "x86_64-apple-darwin" "aarch64-apple-darwin" )

for target in "${targets[@]}"
do
   :
   filename="./target/${version}/git-fury-${target}"
   deno compile --allow-run --target=${target} --output=${filename} ./mod.ts
done