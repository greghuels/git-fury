import { program } from 'commander';

import getExpandedArgs from './helpers/getExpandedArgs';
import listBranches from './helpers/listBranches';
import BranchDescription from './BranchDescription';
import getCurrentBranch from './helpers/getCurrentBranch';
import getVersion from './helpers/getVersion';
import executeGit, { ExecuteGitOptions, printDryRun } from './helpers/executeGit';

function execHelp() {
  console.log('Usage: git fury [options]');
  console.log('');
  console.log('Options:');
  console.log('  -h, --help  display help for command');
  console.log('  --dry-run  display expanded git command without executing it');
  console.log('  desc [branch] <description>, Set a branch description');
  console.log('  desc -D [branch], Delete a branch description');
  console.log('');
  console.log('Examples:');
  console.log('');
  console.log('- Set a branch description');
  console.log('  $ git fury desc https://github.com/greghuels/git-fury/pull/12345');
  console.log('  $ git fury desc a "Some description for branch a"');
  console.log('');
  console.log('- Delete a branch description');
  console.log('  $ git fury desc -D');
  console.log('');
  console.log('- Use git shorthand (set config aliases like `git config --global alias.co "fury checkout"` for enhanced productivity)');
  console.log('  $ git fury diff 2 1  ### --> git diff HEAD~2 HEAD~1');
  console.log('  $ git fury checkout a  ### --> git checkout <branch-name-for-a>');
  console.log('  $ git fury rebase -i 2  ### --> git rebase -i HEAD~2');
}

function getBranchName(descArgs: Array<string>) {
  const filteredArgs = descArgs.filter(arg => arg !== '-D' && arg !== '-S');
  const isDeleteOrShow = filteredArgs.length !== descArgs.length;
  if (isDeleteOrShow) {
    return filteredArgs[0] ?? getCurrentBranch();
  } else {
    return filteredArgs.length < 2 ? getCurrentBranch() : filteredArgs[0];
  }
}

async function execBranchDescription(expandedArgs: Array<string>, options: ExecuteGitOptions) {
  const descArgs = expandedArgs.slice(1);
  program
    .usage('desc [branch] <description|options>')
    .option('-D', 'Delete description for the current branch or optionally specified branch / shorthand branch')
    .option('-S', 'Show description for the current branch or optionally specified branch / shorthand branch')
    .description('Set, show or delete a branch description for the current branch or optionally specified branch / shorthand branch');

  if (descArgs.length === 0 || descArgs.length > 2) {
    program.outputHelp();
    process.exit(1);
  } else {
    const branchName = getBranchName(descArgs);
    const branchDescription = new BranchDescription(branchName, options);
    let code: number | undefined;
    if (descArgs.includes('-D')) {
      code = await branchDescription.remove();
    } else if (descArgs.includes('-S')) {
      code = await branchDescription.show();
    } else {
      const descriptionString = descArgs.length === 2 ? descArgs[1] : descArgs[0];
      code = await branchDescription.set(descriptionString);
    }
    process.exit(code);
  }
}

function execListBranches(expandedArgs: Array<string>, options: ExecuteGitOptions) {
  if (options.dryRun) {
    printDryRun(expandedArgs);
  } else {
    listBranches();
  }
}

function shouldListBranches(args: Array<string>) {
  if (args[0] === 'branch') {
    if (args.length === 1) {
      return true;
    }
    if (args.length === 2 && ['--list', '-l'].includes(args[1])) {
      return true;
    }
  }
  return false;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRunIndex = args.indexOf('--dry-run');
  const dryRun = dryRunIndex > -1;
  if (dryRun) {
    args.splice(dryRunIndex, 1);
  }

  if (args.includes('-h') || args.includes('--help')) {
    execHelp();
  } else if (args[0] === '-v' || args[0] === '--version') {
    console.log(`git-fury version ${getVersion()}`);
    process.exit(0);
  } else if (args[0] === 'desc') {
    const expandedArgs = getExpandedArgs(args);
    execBranchDescription(expandedArgs, { dryRun });
  } else if (shouldListBranches(args)) {
    execListBranches(args, { dryRun });
  } else {
    const expandedArgs = getExpandedArgs(args);
    const code = await executeGit(expandedArgs, { dryRun });
    if (!dryRun) {
      listBranches();
    }
    process.exit(code);
  }
}

main();
