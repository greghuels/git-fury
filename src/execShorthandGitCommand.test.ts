import fury from "../src/fury.ts";
import { GitService } from "../src/services/GitService.ts";
import { asserts, bdd, mock } from "../dev_deps.ts";
import BranchRepository from "./repositories/BranchRepository.ts";
import testSetup from "./testSetup.ts";
import { ServiceContainer } from "./fury.d.ts";

const { beforeEach, describe, it } = bdd;
const { assertEquals } = asserts;
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
    assertEquals(executeGit.calls[0].args[0], [
      "checkout",
      "my-topic-branch",
    ]);
  });

  it("should not expand branch names for longer than 2-digit branch abbreviations", async () => {
    availableBranches = new Array(703).fill(undefined).map((_, i) =>
      `branch${i + 1}`
    );
    await execFury(["diff", "zz", "aaa"]);
    assertEquals(executeGit.calls[0].args[0], [
      "diff",
      "branch702",
      "aaa",
    ]);
  });

  it("should prepend HEAD~ to numbers", async () => {
    await execFury(["diff", "3", "2"]);
    assertEquals(executeGit.calls[0].args[0], ["diff", "HEAD~3", "HEAD~2"]);
  });

  it("should not prepend HEAD~ to numbers greater than 999", async () => {
    await execFury(["diff", "1000", "999"]);
    assertEquals(executeGit.calls[0].args[0], ["diff", "1000", "HEAD~999"]);
  });

  it("should not prepend HEAD~ to numbers less less than 0", async () => {
    await execFury(["diff", "-1", "0"]);
    assertEquals(executeGit.calls[0].args[0], ["diff", "-1", "HEAD~0"]);
  });

  it("should expand letters and numbers in the same command", async () => {
    await execFury(["rebase", "--onto", "b", "1"]);
    assertEquals(executeGit.calls[0].args[0], [
      "rebase",
      "--onto",
      "main",
      "HEAD~1",
    ]);
  });

  it("should still respect actual branch names", async () => {
    await execFury(["rebase", "--onto", "main", "1"]);
    assertEquals(executeGit.calls[0].args[0], [
      "rebase",
      "--onto",
      "main",
      "HEAD~1",
    ]);
  });

  it("should work with tilde", async () => {
    await execFury(["diff", "b~1", "b"]);
    assertEquals(executeGit.calls[0].args[0], ["diff", "main~1", "main"]);

    await execFury(["diff", "HEAD~1", "HEAD"]);
    assertEquals(executeGit.calls[1].args[0], ["diff", "HEAD~1", "HEAD"]);
  });

  it("should work with caret", async () => {
    await execFury(["diff", "b^1", "b"]);
    assertEquals(executeGit.calls[0].args[0], ["diff", "main^1", "main"]);

    await execFury(["diff", "HEAD^1", "HEAD"]);
    assertEquals(executeGit.calls[1].args[0], ["diff", "HEAD^1", "HEAD"]);
  });

  it("should work with colon", async () => {
    await execFury(["push", ".", "HEAD:b"]);
    assertEquals(executeGit.calls[0].args[0], ["push", ".", "HEAD:main"]);

    await execFury(["push", ".", "HEAD:main"]);
    assertEquals(executeGit.calls[1].args[0], ["push", ".", "HEAD:main"]);
  });

  it("should work with slash", async () => {
    await execFury(["fetch", "origin/b"]);
    assertEquals(executeGit.calls[0].args[0], ["fetch", "origin/main"]);

    await execFury(["fetch", "origin/main"]);
    assertEquals(executeGit.calls[1].args[0], ["fetch", "origin/main"]);
  });

  it("should work with '...' ", async () => {
    await execFury(["diff", "b...a"]);
    assertEquals(executeGit.calls[0].args[0], [
      "diff",
      "main...another-topic-branch",
    ]);
  });

  it("should work with '..' ", async () => {
    await execFury(["diff", "b..a"]);
    assertEquals(executeGit.calls[0].args[0], [
      "diff",
      "main..another-topic-branch",
    ]);
  });

  it("should not work with '.' ", async () => {
    await execFury(["diff", "b.a"]);
    assertEquals(executeGit.calls[0].args[0], [
      "diff",
      "b.a",
    ]);
  });

  it("should work with combinations of special chars", async () => {
    await execFury(["push", ".", "origin/b~1:b"]);
    assertEquals(executeGit.calls[0].args[0], [
      "push",
      ".",
      "origin/main~1:main",
    ]);
  });

  it("should not indefinitely run", async () => {
    availableBranches = ["b", "a"];
    await execFury(["checkout", "a"]);
    assertEquals(executeGit.calls[0].args[0], ["checkout", "b"]);

    await execFury(["checkout", "a/b~1"]);
    assertEquals(executeGit.calls[1].args[0], ["checkout", "b/a~1"]);
  });
});
