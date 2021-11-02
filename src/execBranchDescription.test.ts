import fury from "../src/fury.ts";
import { GitService } from "../src/services/GitService.ts";
import { mock, tincan } from "../dev_deps.ts";
import BranchRepository from "./repositories/BranchRepository.ts";
import testSetup from "./testSetup.ts";
import { ServiceContainer } from "./fury.d.ts";

const { beforeEach, describe, expect, it, run } = tincan;
const { stub } = mock;

describe("execBranchDescription", () => {
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

    BranchRepository.getCurrentBranch = () => Promise.resolve("main");

    return fury(args, services);
  };

  describe("setting a branch description", () => {
    it("works for current branch", async () => {
      await execFury(["desc", "my description"]);
      expect(executeGit.calls[0].args[0]).toEqual([
        "config",
        "branch.main.description",
        "my description",
      ]);
    });

    it("works for specified shorthand branch", async () => {
      await execFury(["desc", "c", "my description"]);
      expect(executeGit.calls[0].args[0]).toEqual([
        "config",
        "branch.my-topic-branch.description",
        "my description",
      ]);
    });

    it("does not transform branch description", async () => {
      await execFury(["desc", "c", "a"]);
      expect(executeGit.calls[0].args[0]).toEqual([
        "config",
        "branch.my-topic-branch.description",
        "a",
      ]);
    });
  });

  describe("deleting a branch description", () => {
    it("works for current branch", async () => {
      await execFury(["desc", "-D"]);
      expect(executeGit.calls[0].args[0]).toEqual([
        "config",
        "--unset",
        "branch.main.description",
      ]);
    });

    it("works for specified shorthand branch", async () => {
      await execFury(["desc", "c", "-D"]);
      expect(executeGit.calls[0].args[0]).toEqual([
        "config",
        "--unset",
        "branch.my-topic-branch.description",
      ]);
    });

    it("works for specified longform branch", async () => {
      await execFury(["desc", "another-topic-branch", "-D"]);
      expect(executeGit.calls[0].args[0]).toEqual([
        "config",
        "--unset",
        "branch.another-topic-branch.description",
      ]);
    });

    it("works when -D is the second argument", async () => {
      await execFury(["desc", "-D", "c"]);
      expect(executeGit.calls[0].args[0]).toEqual([
        "config",
        "--unset",
        "branch.my-topic-branch.description",
      ]);
    });
  });

  describe("showing a branch description with -S", () => {
    it("works for current branch with -S", async () => {
      await execFury(["desc", "-S"]);
      expect(executeGit.calls[0].args[0]).toEqual([
        "config",
        "branch.main.description",
      ]);
    });

    it("works for specified shorthand branch", async () => {
      await execFury(["desc", "c", "-S"]);
      expect(executeGit.calls[0].args[0]).toEqual([
        "config",
        "branch.my-topic-branch.description",
      ]);
    });

    it("works for specified longform branch", async () => {
      await execFury(["desc", "another-topic-branch", "-S"]);
      expect(executeGit.calls[0].args[0]).toEqual([
        "config",
        "branch.another-topic-branch.description",
      ]);
    });

    it("works when -S is the second argument", async () => {
      await execFury(["desc", "-S", "c"]);
      expect(executeGit.calls[0].args[0]).toEqual([
        "config",
        "branch.my-topic-branch.description",
      ]);
    });
  });

  describe("showing a branch description with -s", () => {
    it("works for current branch with -s", async () => {
      await execFury(["desc", "-s"]);
      expect(executeGit.calls[0].args[0]).toEqual([
        "config",
        "branch.main.description",
      ]);
    });

    it("works for specified shorthand branch", async () => {
      await execFury(["desc", "c", "-s"]);
      expect(executeGit.calls[0].args[0]).toEqual([
        "config",
        "branch.my-topic-branch.description",
      ]);
    });

    it("works for specified longform branch", async () => {
      await execFury(["desc", "another-topic-branch", "-s"]);
      expect(executeGit.calls[0].args[0]).toEqual([
        "config",
        "branch.another-topic-branch.description",
      ]);
    });

    it("works when -s is the second argument", async () => {
      await execFury(["desc", "-s", "c"]);
      expect(executeGit.calls[0].args[0]).toEqual([
        "config",
        "branch.my-topic-branch.description",
      ]);
    });
  });
});

run();
