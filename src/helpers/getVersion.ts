export default function getVersion(): string {
  return require('../../package.json').version; // eslint-disable-line
}