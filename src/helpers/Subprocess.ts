const decode = (std: Uint8Array | undefined) =>
  std ? new TextDecoder().decode(std) : "";

export default class Subprocess {
  static exec = async (...cmd: Array<string>) => {
    const command = new Deno.Command(cmd[0], {
      args: cmd.slice(1),
      stderr: "piped",
      stdout: "piped",
    });
    const { code, stdout, stderr } = await command.output();
    return {
      code,
      output: decode(stdout),
      error: decode(stderr),
    };
  };

  static spawn = async (...cmd: Array<string>) => {
    const command = new Deno.Command(cmd[0], {
      args: cmd.slice(1),
      stdin: "inherit",
      stdout: "inherit",
      stderr: "inherit",
    });
    const { code } = await command.output();
    if (code !== 0) {
      Deno.exit(code);
    }
    return code;
  };
}
