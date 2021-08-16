export const shouldExecHelp = (args: Array<string>): boolean =>
  !args.length || args.includes("-h") || args.includes("--help");

export default function execHelp(): number {
  console.log("Usage: git fury [options]");
  console.log("");
  console.log("Options:");
  console.log("  -h, --help  display help for command");
  console.log("  --dry-run  display expanded git command without executing it");
  console.log("  desc [branch] <description>, Set a branch description");
  console.log("  desc -D [branch], Delete a branch description");
  console.log("");
  console.log("Examples:");
  console.log("");
  console.log("- Set a branch description");
  console.log(
    "  $ git fury desc https://github.com/greghuels/git-fury/pull/12345",
  );
  console.log('  $ git fury desc a "Some description for branch a"');
  console.log("");
  console.log("- Delete a branch description");
  console.log("  $ git fury desc -D");
  console.log("");
  console.log(
    '- Use git shorthand (set config aliases like `git config --global alias.co "fury checkout"` for enhanced productivity)',
  );
  console.log("  $ git fury diff 2 1  ### --> git diff HEAD~2 HEAD~1");
  console.log(
    "  $ git fury checkout a  ### --> git checkout <branch-name-for-a>",
  );
  console.log("  $ git fury rebase -i 2  ### --> git rebase -i HEAD~2");
  return 0;
}
