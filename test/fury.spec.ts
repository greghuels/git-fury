import { CharToBranchMap } from '../src/helpers/getCharToBranchMap';
import { FuryFn } from '../src/fury';

describe('execShorthandGitCommand', () => {
  let executeGit: jest.Mock;
  let getCharToBranchMap: jest.Mock<CharToBranchMap>;

  let fury: FuryFn;
  const log: typeof console.log = () => undefined;

  beforeAll(() => {
    executeGit = jest.fn();
    getCharToBranchMap = jest.fn();
    jest.mock('../src/helpers/executeGit', () => executeGit);
    jest.mock('../src/helpers/getCharToBranchMap', () => getCharToBranchMap);
    const furyFn: FuryFn = require('../src/fury').default; // eslint-disable-line
    fury = (originalArgs: Array<string>) => furyFn(originalArgs, log);
  });

  beforeEach(() => {
    executeGit.mockClear();
    executeGit.mockResolvedValue(0);
    getCharToBranchMap.mockReturnValue({
      'a': 'another-topic-branch',
      'b': 'master',
      'c': 'my-topic-branch'
    });
  });

  it('should resolve with the exit code', async () => {
    const code = await fury(['checkout', 'c']);
    expect(code).toBe(0);
  });

  it('should expand letters to branch names', async () => {
    await fury(['checkout', 'c']);
    expect(executeGit).toHaveBeenCalledWith(['checkout', 'my-topic-branch'], { dryRun: false, log });
  });

  it('should prepend HEAD~ to numbers', async () => {
    await fury(['diff', '3', '2']);
    expect(executeGit).toHaveBeenCalledWith(['diff', 'HEAD~3', 'HEAD~2'], { dryRun: false, log });
  });

  it('should respect the --dry-run option', async () => {
    await fury(['diff', '3', '2', '--dry-run']);
    expect(executeGit).toHaveBeenCalledWith(['diff', 'HEAD~3', 'HEAD~2'], { dryRun: true, log });
  });

  it('should expand letters and numbers in the same command', async () => {
    await fury(['rebase', '--onto', 'b', '1']);
    expect(executeGit).toHaveBeenCalledWith(['rebase', '--onto', 'master', 'HEAD~1'], { dryRun: false, log });
  });

  it('should still respect actual branch names', async () => {
    await fury(['rebase', '--onto', 'master', '1']);
    expect(executeGit).toHaveBeenCalledWith(['rebase', '--onto', 'master', 'HEAD~1'], { dryRun: false, log });
  });

});