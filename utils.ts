// Usage example:
// const logger = new LitLogger("[CustomPrefix]");
// logger.log("This is a log message");
// logger.throwError('This is an error message');

export class LitLogger {
  PREFIX: string;
  static orange = "\x1b[33m";
  static reset = "\x1b[0m";
  static red = "\x1b[31m";
  debug: boolean;

  constructor(prefix = "[PKPCosmosSigner]", debug = false) {
    this.PREFIX = prefix;
    this.debug = debug;
  }

  log(...args: any[]) {
    if (!this.debug) return;
    console.log(LitLogger.orange + this.PREFIX + LitLogger.reset, ...args);
  }

  throwError(message: string): never {
    if (this.debug) {
      console.error(
        LitLogger.orange + this.PREFIX + LitLogger.reset,
        LitLogger.red + message + LitLogger.reset
      );
    }
    throw new Error(message);
  }
}
