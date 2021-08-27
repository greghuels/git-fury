# Git Fury

A lightweight git utility that enables shorthand git syntax to sharpen your git
fu and increase productivity.

- Manage Branch Descriptions
- Alphabetic characters (a-zz) represent branch names
- Numeric characters (0-999) are prepended with `HEAD~`

## Table of Contents

- [Installation](#installation)
- [Demo](#demo)
- [Usage](#usage)
- [Tips](#tips)

## Installation

#### Homebrew

```sh
brew install greghuels/tap/git-fury
```

#### Building from Source

1. Download and unpack the source code from the
   [latest release](https://github.com/greghuels/git-fury/releases/latest)
1. `cd` to unpacked directory
1. Build source: `deno compile --allow-run ./mod.ts` (using
   [deno](https://deno.land/))
1. Move binary: `mv ./git-fury /usr/local/bin`

#### Setting Aliases (recommended)

```sh
git config --global alias.br 'fury branch'
git config --global alias.co 'fury checkout'
git config --global alias.cp 'fury cherry-pick'
git config --global alias.df 'fury diff'
git config --global alias.ds 'fury desc' # custom "git-fury" command to set and delete branch descriptions
git config --global alias.lg 'fury log --graph --oneline --pretty=format:"%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset"'
git config --global alias.mg 'fury merge'
git config --global alias.rb 'fury rebase'
git config --global alias.rs 'fury reset'
```

Any git command works with git fury, not just those listed above. Feel free to
configure aliases as you see fit.

## Demo

<img src="https://github.com/greghuels/git-fury/blob/main/images/demo.gif" width="600" />

## Usage

**TIP:** Add the `--dry-run` option on any `git fury` command to see which git
command would be executed, but without actually executing it. This also works if
aliases are set up.

#### Shorthand Syntax

- Alphabetic characters (a-zz) represent branch names
- Numeric characters (0-999) are prepended with `HEAD~`

<img src="https://github.com/greghuels/git-fury/blob/main/images/basic-example.png" width="400" />

```sh
## Without aliases configured
git fury diff 2 1         # git diff HEAD~2 HEAD~1

## With aliases configured
git co b                  # git checkout some-branch
git df 2 1                # git diff HEAD~2 HEAD~1
git rb --onto origin/a 1  # git rebase --onto origin/main HEAD~1

## Hashes and branch names still work!
git co 17c422g            # git checkout 17c422g
git co some-branch        # git checkout some-branch
```

#### Manage Branch Descriptions

Branch descriptions allow you to add notes to branches.

<img src="https://github.com/greghuels/git-fury/blob/main/images/set-branch-description.png" width="400" />

```sh
## Without 'ds' alias configured
git fury desc 'My description'

## With 'ds' alias configured
git ds 'My description'   # Set description for current branch
git ds -S                 # Show description for current branch
git ds -D                 # Delete description for current branch

git ds a 'My description' # Set description for branch (a)
git ds a -S               # Show description for branch (a)
git ds a -D               # Delete description for branch (a)
```

## Tips

- Add the `--dry-run` option on any `git fury` command to see which git command
  would be executed, but without actually executing it. This also works if
  aliases are set up.
- It's useful to set the branch description to a URL (e.g. a pull request, user
  story, bug ticket, etc).
- Mac users using iTerm2 can open a branch description formatted as a URL using
  cmd+click.
- Tired of typing `git`? Use bash aliases instead.
