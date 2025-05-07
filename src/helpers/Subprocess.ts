const decode = (std: Uint8Array | undefined) =>
  std ? new TextDecoder().decode(std) : "";

export default class Subprocess {
  static exec = async (...cmd: Array<string>) => {
    const command = new Deno.Command(cmd[0], {
      args: cmd.slice(1),
      stderr: "piped",
      stdout: "piped",
    });
    const process = command.spawn();
    const [status, output] = await Promise.all([
      process.status,
      process.output(),
    ]);
    return {
      code: status.code,
      output: decode(output.stdout),
      error: decode(output.stderr),
    };
  };

  static spawn = async (...cmd: Array<string>) => {
    const command = new Deno.Command(cmd[0], {
      args: cmd.slice(1),
    });
    const process = command.spawn();
    const { code } = await process.status;
    if (code !== 0) {
      Deno.exit(code);
    }
    return code;
  };
}