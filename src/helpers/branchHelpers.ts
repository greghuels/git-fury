import Subprocess from "./Subprocess.ts";

const getAvailableBranches = async () => {
  try {
    const { code, output, error } = await Subprocess.exec(
      "git",
      "branch",
    );
    if (!code) {
      return output.split("\n").map((line) => {
        if (line.startsWith("*")) {
          line = line.slice(1);
        }
        return line.trim();
      });
    } else {
      console.error(error);
      Deno.exit(code);
    }
  } catch (e) {
    console.error(e);
    Deno.exit(1);
  }
};

const getBranchDescription = async (branch: string): Promise<string> => {
  try {
    const { code, output, error } = await Subprocess.exec(
      "git",
      "config",
      `branch.${branch}.description`,
    );
    if (!code) {
      return output.trim();
    } else if (code === 1 && !error) {
      return "";
    } else {
      console.error(error);
      Deno.exit(code);
    }
  } catch (e) {
    console.error(e);
    Deno.exit(1);
  }
};

const getCurrentBranch = async (): Promise<string> => {
  try {
    const { code, output, error } = await Subprocess.exec(
      "git",
      "rev-parse",
      "--symbolic-full-name",
      "HEAD",
    );
    if (!code) {
      const prefix = "refs/heads/";
      const branchRef = output.split("\n").find((ref) =>
        ref.startsWith(prefix)
      );
      return branchRef?.slice(prefix.length).trim() ?? "";
    } else {
      console.error(error);
      Deno.exit(code);
    }
  } catch (e) {
    console.error(e);
    Deno.exit(1);
  }
};

export const _internals = {
  getAvailableBranches,
  getBranchDescription,
  getCurrentBranch,
};
