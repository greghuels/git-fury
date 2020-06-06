const DEFAULT = '\x1b[0m';
const FADED = '\x1b[2m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';

export default class Colorizer {

  private colors: string;
  private textArray: Array<string>;

  constructor() {
    this.colors = '';
    this.textArray = [];
  }

  private colorize(c: string, text: string) {
    this.colors += `${c}%s`;
    this.textArray.push(text);
  }

  normal(text: string): void {
    this.colorize(DEFAULT, text);
  }

  fadedNormal(text: string): void {
    this.colorize(`${DEFAULT}${FADED}`, text);
  }

  green(text: string): void {
    this.colorize(GREEN, text);
  }

  yellow(text: string): void {
    this.colorize(YELLOW, text);
  }

  log(): void {
    this.colors += DEFAULT;
    const args = [
      this.colors,
      ...this.textArray
    ];
    console.log(...args);
  }
}