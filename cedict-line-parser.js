// cedict-line-parser.js
// job  : checks line of CEDICT for valid Han entry
// job  : returns valid entry as tspd object
// git  : https://github.com/motetpaper/motet-cedict-json
// lic  : MIT
// EXAMPLE: const isValid = CedictLineParser.parse(line).isValid
// EXAMPLE: const obj = CedictLineParser.parse(line).entry
//

class CedictLineParser {

  constructor() {}

  static parse(str) {
    const re = /^(\p{Script=Han}+)\s(\p{Script=Han}+)\s\[(.*)\]\s\/(.*)\/$/u
    const isValid = re.test(str);
    let line, t, s, p, d, entry;
    if(isValid) {
      [ line, t, s, p, d ] = Array.from([...str.match(re)])
      entry = {
          line: line,
          t: t,
          s: s,
          p: p,
          d: d
        };
    }

    return {
      input: str,
      isValid: isValid,
      entry: isValid ? entry : {}
    }
  }
}
module.exports.CedictLineParser = CedictLineParser
