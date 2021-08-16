import fury from "./src/fury.ts";

async function main() {
  const originalArgs = Deno.args;
  try {
    const code = await fury(originalArgs);
    Deno.exit(code);
  } catch (e) {
    console.error(e);
    Deno.exit(e?.status ?? 1);
  }
}

main();
