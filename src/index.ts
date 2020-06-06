import { program } from 'commander';

import getExpandedArgs from './helpers/getExpandedArgs';
import listBranches from './helpers/listBranches';
import { spawn } from 'child_process';
import BranchDescription from './BranchDescription';
import getCurrentBranch from './helpers/getCurrentBranch';

function execHelp() {
  console.log('Usage: git fury [options]');
  console.log('');
  console.log('Options:');
  console.log('  -h, --help  display help for command');
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
  const filteredArgs = descArgs.filter(arg => arg !== '-D');
  const isDelete = filteredArgs.length !== descArgs.length;
  if (isDelete) {
    return filteredArgs[0] ?? getCurrentBranch();
  } else {
    return filteredArgs.length < 2 ? getCurrentBranch() : filteredArgs[0];
  }
}

function getDescriptionString(descArgs: Array<string>) {
  return descArgs.length === 2 ? descArgs[1] : descArgs[0];
}

async function execBranchDescription() {
  const descArgs = getExpandedArgs().slice(1);
  program
    .usage('desc [branch] <description|options>')
    .option('-D', 'Delete description for the current branch or optionally specified branch / shorthand branch')
    .description('Set or delete a branch description for the current branch or optionally specified branch / shorthand branch');

  if (descArgs.length === 0 || descArgs.length > 2) {
    program.outputHelp();
    process.exit(1);
  } else {
    const branchName = getBranchName(descArgs);
    const branchDescription = new BranchDescription(branchName);
    const code = descArgs.includes('-D')
      ? await branchDescription.remove()
      : await branchDescription.set(getDescriptionString(descArgs));
    if (!code) {
      listBranches();
    }
    process.exit(code);
  }
}

const args = process.argv.slice(2);
if (args.includes('-h') || args.includes('--help')) {
  execHelp();
} else if (args[0] === 'desc') {
  execBranchDescription();
} else if (args.length === 1 && args[0] === 'br' || args[0] === 'branch') {
  listBranches();
} else {
  const expandedArgs = getExpandedArgs(args);
  const child = spawn('git', [...expandedArgs], { stdio: 'inherit' });
  child.on('exit', (code) => {
    listBranches();
    process.exit(code);
  });
}