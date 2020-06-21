import fury from './fury';

async function main() {
  const originalArgs = process.argv.slice(2);
  try {
    const code = await fury(originalArgs);
    process.exit(code);
  } catch (e) {
    console.error(e);
    process.exit(e?.status ?? 1);
  }
}

main();
