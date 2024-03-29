# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.3]

- Only list branches after diff, checkout, or switch commands
- Internal refactors

## [1.4.2]

- Fixes fury commands applied to branches that have tags of the same name
- Fixes applying transformations to branch descriptions

## [1.4.1]

- Fixes dry run when truthy values are passed to --dry-run argument
- Supports lowercase "-s" arg for showing branch descriptions

## [1.4.0]

- support multiple transformation within the same clause
- support arguments with ".." and "..."
- Fix backslash/quotes showing in --dry-run output

## [1.3.0]

- git-fury is now a standalone binary
- complete rewrite in Deno
- significant performance improvements

## [1.2.5] - 2020-07-27

### Added

- Patch upgrades for dependencies

## [1.2.3 - 1.2.4] - 2020-04-01

### Fixed

- Fix help message when no args passed to `git fury` command
- Fix escaping characters when printing commands via --dry-run option
- Fix y18n vulnerability by upgrading package
- Fix escaping characters when listing branch names

## [1.2.1 - 1.2.2] - 2020-03-15

### Fixed

- Upgrade jest to remove security vulnerability
- Fix readme

## [1.2.0] - 2020-06-22

### Added

- Shorthand support for arguments involving special characters, including "\~",
  "^", ":", and "/" (i.e. `git fury log a^1`, `git fury rebase origin/a`)

## [1.1.0 - 1.1.1] - 2020-06-20

### Added

- New `--dry-run` option allows users to see what git command would be executed
  without actually executing the command

### Fixed

- Fix bug where branches were being listed twice in some scenarios

## [1.0.0 - 1.0.5]

### Added

- Initial "git fury" functionality
- Support for shortened git syntax
- Support for setting/deleting/showing branch descriptions
