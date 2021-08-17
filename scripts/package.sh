#!/usr/bin/env sh
set -e

export version=$(cat ./version.ts | sed -e 's/export default "//' | sed -e 's/";//')
export filename="git-fury-${version}.tar.gz"
./scripts/build.sh
tar -czf $filename git-fury
rm -f git-fury
shasum -a 256 git-fury-$version.tar.gz