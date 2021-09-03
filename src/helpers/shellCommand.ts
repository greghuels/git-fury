export default function shellCommand(cmd: Array<string>) {
  return cmd.map((str) => {
    if (/["\s]/.test(str) && !/'/.test(str)) {
      return "'" + str.replace(/(['\\])/g, "\\$1") + "'";
    } else if (/["'\s]/.test(str)) {
      return '"' + str.replace(/(["\\$`!])/g, "\\$1") + '"';
    } else {
      return String(str).replace(
        /([A-z]:)?([#!"$&'()*,:;<=>?@\[\\\]^`{|}])/g,
        "$1\\$2",
      );
    }
  }).join(" ");
}
