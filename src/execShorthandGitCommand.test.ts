import fury from "../src/fury.ts";
import { BranchService } from "../src/services/BranchService/BranchService.ts";
import { GitService } from "../src/services/GitService/GitService.ts";
import {
  beforeEach,
  describe,
  expect,
  it,
  run,
} from "https://deno.land/x/tincan@0.2.1/mod.ts";
import { stub, Stub } from 'https://deno.land/x/mock@v0.10.0/mod.ts';
import BranchDescriptionService from "../src/services/BranchDescriptionService/BranchDescriptionService.ts";

describe('execShorthandGitCommand', () => {
  let gitService: GitService;
  let branchService: BranchService;
  let branchDescriptionService: BranchDescriptionService;
  let executeGit: Stub<GitService>;

  const log: typeof console.log = () => undefined;

  beforeEach(() => {
   const options = { dryRun: false };
    gitService = new GitService(options, log);
    branchService = new BranchService(options, log);
    branchDescriptionService = new BranchDescriptionService(options, gitService, branchService);
    stub(branchService, 'getCharToBranchMap', () => Promise.resolve({
      'a': 'another-topic-branch',
      'b': 'main',
      'c': 'my-topic-branch'
    }));
    stub(branchService, 'listBranches');
    executeGit = stub(gitService, 'executeGit');
  });

  const execFury = (args: Array<string>) => {
    return fury(args, {
      log,
      gitService,
      branchService,
      branchDescriptionService
    });
  }

  it('should expand letters to branch names', async () => {
    await execFury(['checkout', 'c']);
    expect(executeGit.calls[0].args[0]).toEqual(['checkout', 'my-topic-branch']);
  });

  it('should prepend HEAD~ to numbers', async () => {
    await execFury(['diff', '3', '2']);
    expect(executeGit.calls[0].args[0]).toEqual(['diff', 'HEAD~3', 'HEAD~2']);
  });

  it('should expand letters and numbers in the same command', async () => {
    await execFury(['rebase', '--onto', 'b', '1']);
    expect(executeGit.calls[0].args[0]).toEqual(['rebase', '--onto', 'main', 'HEAD~1']);
  });

  it('should still respect actual branch names', async () => {
    await execFury(['rebase', '--onto', 'main', '1']);
    expect(executeGit.calls[0].args[0]).toEqual(['rebase', '--onto', 'main', 'HEAD~1']);
  });

  it('should work with tilde', async () => {
    await execFury(['diff', 'b~1', 'b']);
    expect(executeGit.calls[0].args[0]).toEqual(['diff', 'main~1', 'main']);

    await execFury(['diff', 'HEAD~1', 'HEAD']);
    expect(executeGit.calls[1].args[0]).toEqual(['diff', 'HEAD~1', 'HEAD']);
  });

  it('should work with caret', async () => {
    await execFury(['diff', 'b^1', 'b']);
    expect(executeGit.calls[0].args[0]).toEqual(['diff', 'main^1', 'main']);

    await execFury(['diff', 'HEAD^1', 'HEAD']);
    expect(executeGit.calls[1].args[0]).toEqual(['diff', 'HEAD^1', 'HEAD']);
  });

  it('should work with colon', async () => {
    await execFury(['push', '.', 'HEAD:b']);
    expect(executeGit.calls[0].args[0]).toEqual(['push', '.', 'HEAD:main']);

    await execFury(['push', '.', 'HEAD:main']);
    expect(executeGit.calls[1].args[0]).toEqual(['push', '.', 'HEAD:main']);
  });

  it('should work with slash', async () => {
    await execFury(['fetch', 'origin/b']);
    expect(executeGit.calls[0].args[0]).toEqual(['fetch', 'origin/main']);

    await execFury(['fetch', 'origin/main']);
    expect(executeGit.calls[1].args[0]).toEqual(['fetch', 'origin/main']);
  });

  it('should work with combinations of special chars', async () => {
    await execFury(['push', '.', 'b~1:a']);
    expect(executeGit.calls[0].args[0]).toEqual(['push', '.', 'main~1:another-topic-branch']);
  });
});

run();