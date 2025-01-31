#!/usr/bin/env node

// index.js
// job  : converts CEDICT file into JSON object
// job  : only converts "valid" CEDICT lines
// git  : https://github.com/motetpaper/motet-cedict-json
// lic  : MIT
//
// after you make the cedict.json file,
// you can use `jq`` to create subsets
//
// EXAMPLE: to get a file with only two fields, of specific length
// $ cat cedict.json | jq -c '.[] | {s,d} | select( .s | length == 2)' > two.json
//
// EXAMPLE: put the above results in an array (-s slurp)
// $ cat cedict.json | jq -c '.[] | {s,d} | select( .s | length == 2)' | jq -s > two.json
// $ cat cedict.json | jq -c '.[] | {s,d} | select( .s | length == 1)' | jq -s > one.json

const fs = require('fs');
const { CedictLineParser } = require('./cedict-line-parser.js')

const outfile = 'cedict.json';

fs.readFile('cedict_ts.u8', 'utf8', (err, data)=>{

  if (err) throw err;

  const lines = data.split(/\n|\r|\r\n/)
    .filter((a)=>a.charCodeAt(0) !== 35) // remove comments
    .filter((a)=>!!a) // remove blanks
    .filter((a)=>CedictLineParser.parse(a).isValid) // skip non-Han lines
    .filter((a)=>a.trim()) // trim each entry
    .map((a)=>{

      // this area annotates the entry with metapinyin

      // CEDICT entry with no new annotations
      const entry = CedictLineParser.parse(a).entry;

      // annotates entries with metapinyin
      entry.pmash = pmash(entry.p);
      entry.pbash = pbash(entry.p);
      entry.psmash = psmash(entry.p);
      entry.phash = phash(entry.p);

      // annotates entries with umlaut metapinyin
      entry.pmush = pmush(entry.p);
      entry.ppush = ppush(entry.p);

      return entry;
    });

    // JSON pretty print
    const outdata = JSON.stringify(lines,null,2);
    fs.writeFile(outfile, outdata, (err)=>{
      if(err) throw err;
    });
});

// metapinyin helper functions below

function pmash(str) {
  return nospace(str);
}

function pbash(str) {
  return nospace(nodigit(str));
}

function psmash(str) {
  return str.toLowerCase().split(' ')
    .map((a) => { return a[0] }).join('');
}

function phash(str) {
  return ([...new Set(pbash(str).split(''))])
    .sort().join('');
}

function nospace(str) {
  return str.toLowerCase()
    .replace(/\s/ig, '');
}

function nodigit(str) {
  return str.toLowerCase()
    .replace(/\d/ig, '');
}

function umlaut(str) {
  const re = new RegExp('u:', 'ig');
  return str.replace(re, 'v');
}

function pmush(str) {
  return umlaut(nospace(str));
}

function ppush(str) {
  return umlaut(nospace(nodigit(str)));
}
