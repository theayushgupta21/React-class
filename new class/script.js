// NPM Understanding

// text to speech
// installing and uninstalling anything basic& advanced
// installing particular versions 
//npm install (i) packagename
//understanding node_modules


//devdependencies - jo packages development me kaam ayenge or jab develop hojayega tab or upload hojayega tab wo kaam nhi ayega

//scripts- understanding default scripts Path and coustom sripts

const fs = require('fs');

// File padhna aur print karna
const content = fs.readFileSync('.txt', 'utf8');
console.log(content);
