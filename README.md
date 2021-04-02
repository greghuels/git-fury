# Git Fury

A lightweight git utility that enables shorthand git syntax to sharpen your git fu and increase productivity.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Tips](#tips)

## Installation

```sh
npm install -g git-fury

### optionally set aliases to enhance productivity
git config --global alias.br 'fury branch'
git config --global alias.co 'fury checkout'
git config --global alias.cp 'fury cherry-pick'
git config --global alias.df 'fury diff'
git config --global alias.ds 'fury desc' # custom "git-fury" command to set and delete branch descriptions
git config --global alias.lg 'fury log --graph --oneline'
git config --global alias.mg 'fury merge'
git config --global alias.rb 'fury rebase'
git config --global alias.rs 'fury reset'
```

Note: Any git command works with git fury, not just those listed in the aliases. Feel free to configure aliases as you see fit.

## Usage

### Shorthand Syntax

#### Numbers are prepended with `HEAD~`

  - `git fury diff 2 1` is shorthand `git diff HEAD~2 HEAD~1`
  - `git df 2 1` is also shorthand if the optional aliases are set up (see [Installation](#installation))

#### Letters represent branch names

![](images/basic-example.png)
 - `git co b` is shorthand for `git checkout some-branch` (assuming aliases are set up)
 - `git rb -i a` is shorthand for `git rebase -i master` (assuming aliases are set up)

#### See it in action

![](images/demo.gif)

### Manage Branch Descriptions

Branch descriptions allow you to add notes to branches.

![](images/set-branch-description.png)

```sh
git fury desc 'My description'   # Set description for current branch
git fury desc -S                 # Show description for current branch
git fury desc -D                 # Delete description for current branch

git fury desc a 'My description' # Set description for branch (a)
git fury desc a -S               # Show description for branch (a)
git fury desc a -D               # Delete description for branch (a)

## or with aliases set up
git ds 'My description'
```

## Tips

- Add the `--dry-run` option on any `git fury` command to see which git command would be executed, but without actually executing it. This also works if aliases are set up.
- It's useful to set the branch description to a URL (e.g. a pull request, user story, bug ticket, etc).
- Mac users using iTerm2 can open a branch description formatted as a URL using cmd+click.
- Tired of typing `git`? Use bash aliases instead.