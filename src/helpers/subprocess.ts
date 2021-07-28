const decode = (std: Uint8Array | undefined) => std ? new TextDecoder().decode(std) : ''

export const exec = async (...cmd: Array<string>) => {
  const p = Deno.run({ cmd, stderr: 'piped', stdout: 'piped' });
  const [status, stdout, stderr] = await Promise.all([
    p.status(),
    p.output(),
    p.stderrOutput()
  ]);
  p.close();
  return {
    code: status.code,
    output: decode(stdout),
    error: decode(stderr),
  }
}

export const spawn = async (...cmd: Array<string>) => {
  const p = Deno.run({ cmd, stdout: 'piped', stdin: 'piped', stderr: 'piped' });
  const [status, stdout, stderr] = await Promise.all([
    p.status(),
    p.output(),
    p.stderrOutput()
   ]);
  p.close();
  if (status.code === 0) {
    await Deno.stdout.write(stdout);
  } else {
    if (stderr) {
      const errorString = decode(stderr);
      console.error(errorString);
      Deno.exit(status.code)
    }
  }
  return status.code;
}