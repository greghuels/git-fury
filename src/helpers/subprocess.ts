const decode = (std: Uint8Array | undefined) =>
  std ? new TextDecoder().decode(std) : "";

export class Subprocess {
  static exec = async (...cmd: Array<string>) => {
    const p = Deno.run({ cmd, stderr: "piped", stdout: "piped" });
    const [status, stdout, stderr] = await Promise.all([
      p.status(),
      p.output(),
      p.stderrOutput(),
    ]);
    p.close();
    return {
      code: status.code,
      output: decode(stdout),
      error: decode(stderr),
    };
  };

  static spawn = async (...cmd: Array<string>) => {
    const p = Deno.run({ cmd });
    const status = await p.status();
    if (status.code !== 0) {
      Deno.exit(status.code);
    }
    return status.code;
  };
}
