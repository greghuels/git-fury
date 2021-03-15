# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.1- 1.2.2]
### Added
- Upgrade jest to remove security vulnerability
- Fix readme

## [1.2.0] - 2020-06-22
### Added
- Shorthand support for arguments involving special characters, including "\~", "^", ":", and "/" (i.e. `git fury log a^1`, `git fury rebase origin/a`)

## [1.1.0 - 1.1.1] - 2020-06-20
### Added
- New `--dry-run` option allows users to see what git command would be executed without actually executing the command

### Fixed
- Fix bug where branches were being listed twice in some scenarios

## [1.0.0 - 1.0.5]
### Added
- Initial "git fury" functionality
- Support for shortened git syntax
- Support for setting/deleting/showing branch descriptions
