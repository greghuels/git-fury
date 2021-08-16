export default function quote(xs: Array<string>) {
  return xs.map((str) => {
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
