import fury from "../src/fury.ts";
import { asserts, bdd, mock } from "../dev_deps.ts";
import BranchRepository from "./repositories/BranchRepository.ts";
import testSetup from "./testSetup.ts";
import { ServiceContainer } from "./fury.d.ts";
import { colors } from "../deps.ts";

const { beforeEach, describe, it } = bdd;
const { assertEquals } = asserts;

describe("execShorthandGitCommand", () => {
  let log: mock.Spy<void>;
  let services: ServiceContainer;

  beforeEach(() => {
    services = testSetup({ dryRun: false });
    log = services.log as mock.Spy<void>;
  });

  const execFury = (args: Array<string>) => {
    return fury(args, services);
  };

  it("should associate letters with branch names and show branch descriptions", async () => {
    const availableBranches = [
      "another-topic-branch",
      "main",
      "my-topic-branch",
    ];
    BranchRepository.getAvailableBranches = () =>
      Promise.resolve(availableBranches);

    BranchRepository.getCurrentBranch = () => Promise.resolve("main");

    BranchRepository.getBranchDescription = (branch: string) => {
      if (branch === "another-topic-branch") {
        return Promise.resolve("My description");
      } else {
        return Promise.resolve("");
      }
    };

    await execFury(["branch"]);

    assertEquals(
      log.calls[0].args[0],
      colors.reset("  ") + colors.yellow(`(a)`) +
        colors.reset(` another-topic-branch`) +
        colors.reset(colors.dim(` My description`)),
    );

    assertEquals(
      log.calls[1].args[0],
      colors.reset("* ") + colors.yellow(`(b)`) +
        colors.green(` main`) +
        colors.reset(colors.dim(` `)),
    );

    assertEquals(
      log.calls[2].args[0],
      colors.reset("  ") + colors.yellow(`(c)`) +
        colors.reset(` my-topic-branch`) +
        colors.reset(colors.dim(` `)),
    );
  });

  it("should account for more than 26 branches", async () => {
    const availableBranches = [
      "branch01",
      "branch02",
      "branch03",
      "branch04",
      "branch05",
      "branch06",
      "branch07",
      "branch08",
      "branch09",
      "branch10",
      "branch11",
      "branch12",
      "branch13",
      "branch14",
      "branch15",
      "branch16",
      "branch17",
      "branch18",
      "branch19",
      "branch20",
      "branch21",
      "branch22",
      "branch23",
      "branch24",
      "branch25",
      "branch26",
      "branch27",
      "branch28",
      "branch29",
    ];

    BranchRepository.getAvailableBranches = () =>
      Promise.resolve(availableBranches);

    BranchRepository.getCurrentBranch = () => Promise.resolve("branch27");

    BranchRepository.getBranchDescription = (branch: string) => {
      if (branch === "branch28") {
        return Promise.resolve("My description");
      } else {
        return Promise.resolve("");
      }
    };

    await execFury(["branch"]);

    assertEquals(
      log.calls[25].args[0],
      colors.reset("  ") + colors.yellow(`(z)`) +
        colors.reset(` branch26`) +
        colors.reset(colors.dim(` `)),
    );

    assertEquals(
      log.calls[26].args[0],
      colors.reset("* ") + colors.yellow(`(aa)`) +
        colors.green(` branch27`) +
        colors.reset(colors.dim(` `)),
    );

    assertEquals(
      log.calls[27].args[0],
      colors.reset("  ") + colors.yellow(`(ab)`) +
        colors.reset(` branch28`) +
        colors.reset(colors.dim(` My description`)),
    );

    assertEquals(
      log.calls[28].args[0],
      colors.reset("  ") + colors.yellow(`(ac)`) +
        colors.reset(` branch29`) +
        colors.reset(colors.dim(` `)),
    );
  });
});
