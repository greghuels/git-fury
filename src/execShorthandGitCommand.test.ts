import fury from "../src/fury.ts";
import { GitService } from "../src/services/GitService.ts";
import { mock, tincan } from "../mod_test.ts";
import BranchRepository from "./repositories/BranchRepository.ts";
import testSetup from "./testSetup.ts";
import { ServiceContainer } from "./fury.d.ts";

const { beforeEach, describe, expect, it, run } = tincan;
const { stub } = mock;

describe("execShorthandGitCommand", () => {
  let executeGit: mock.Stub<GitService>;
  let services: ServiceContainer;
  let availableBranches: Array<string>;

  beforeEach(() => {
    availableBranches = [
      "another-topic-branch",
      "main",
      "my-topic-branch",
    ];
    services = testSetup({ dryRun: false });
    executeGit = stub(services.gitService, "executeGit");
  });

  const execFury = (args: Array<string>) => {
    BranchRepository.getAvailableBranches = () =>
      Promise.resolve(availableBranches);

    return fury(args, services);
  };

  it("should expand letters to branch names", async () => {
    await execFury(["checkout", "c"]);
    expect(executeGit.calls[0].args[0]).toEqual([
      "checkout",
      "my-topic-branch",
    ]);
  });

  it("should not expand branch names for longer than 2-digit branch abbreviations", async () => {
    availableBranches = new Array(703).fill(undefined).map((_, i) =>
      `branch${i + 1}`
    );
    await execFury(["diff", "zz", "aaa"]);
    expect(executeGit.calls[0].args[0]).toEqual([
      "diff",
      "branch702",
      "aaa",
    ]);
  });

  it("should prepend HEAD~ to numbers", async () => {
    await execFury(["diff", "3", "2"]);
    expect(executeGit.calls[0].args[0]).toEqual(["diff", "HEAD~3", "HEAD~2"]);
  });

  it("should not prepend HEAD~ to numbers greater than 999", async () => {
    await execFury(["diff", "1000", "999"]);
    expect(executeGit.calls[0].args[0]).toEqual(["diff", "1000", "HEAD~999"]);
  });

  it("should not prepend HEAD~ to numbers less less than 0", async () => {
    await execFury(["diff", "-1", "0"]);
    expect(executeGit.calls[0].args[0]).toEqual(["diff", "-1", "HEAD~0"]);
  });

  it("should expand letters and numbers in the same command", async () => {
    await execFury(["rebase", "--onto", "b", "1"]);
    expect(executeGit.calls[0].args[0]).toEqual([
      "rebase",
      "--onto",
      "main",
      "HEAD~1",
    ]);
  });

  it("should still respect actual branch names", async () => {
    await execFury(["rebase", "--onto", "main", "1"]);
    expect(executeGit.calls[0].args[0]).toEqual([
      "rebase",
      "--onto",
      "main",
      "HEAD~1",
    ]);
  });

  it("should work with tilde", async () => {
    await execFury(["diff", "b~1", "b"]);
    expect(executeGit.calls[0].args[0]).toEqual(["diff", "main~1", "main"]);

    await execFury(["diff", "HEAD~1", "HEAD"]);
    expect(executeGit.calls[1].args[0]).toEqual(["diff", "HEAD~1", "HEAD"]);
  });

  it("should work with caret", async () => {
    await execFury(["diff", "b^1", "b"]);
    expect(executeGit.calls[0].args[0]).toEqual(["diff", "main^1", "main"]);

    await execFury(["diff", "HEAD^1", "HEAD"]);
    expect(executeGit.calls[1].args[0]).toEqual(["diff", "HEAD^1", "HEAD"]);
  });

  it("should work with colon", async () => {
    await execFury(["push", ".", "HEAD:b"]);
    expect(executeGit.calls[0].args[0]).toEqual(["push", ".", "HEAD:main"]);

    await execFury(["push", ".", "HEAD:main"]);
    expect(executeGit.calls[1].args[0]).toEqual(["push", ".", "HEAD:main"]);
  });

  it("should work with slash", async () => {
    await execFury(["fetch", "origin/b"]);
    expect(executeGit.calls[0].args[0]).toEqual(["fetch", "origin/main"]);

    await execFury(["fetch", "origin/main"]);
    expect(executeGit.calls[1].args[0]).toEqual(["fetch", "origin/main"]);
  });

  it("should work with combinations of special chars", async () => {
    await execFury(["push", ".", "origin/b~1:b"]);
    expect(executeGit.calls[0].args[0]).toEqual([
      "push",
      ".",
      "origin/main~1:main",
    ]);
  });
});

run();
