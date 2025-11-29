import fury from "./src/fury.ts";

async function main() {
  const originalArgs = Deno.args;
  try {
    const code = await fury(originalArgs);
    Deno.exit(code);
  } catch (e) {
    console.error(e);
    const exitCode = (e && typeof e === "object" && "code" in e)
      ? (e as { code: number }).code
      : 1;
    Deno.exit(exitCode);
  }
}

main();
