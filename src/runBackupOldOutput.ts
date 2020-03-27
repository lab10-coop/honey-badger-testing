
import * as _ from 'underscore';

var fs = require('fs');


console.log('current Dir: ',  process.cwd());
const outPutDir = process.cwd() + '/output';

const  dt = new Date();

const dateFormated =
    `${dt.getFullYear().toString()}${(dt.getMonth()+1).toString().padStart(2, '0')}${
    dt.getDate().toString().padStart(2, '0')}${
    dt.getFullYear().toString().padStart(4, '0')}${
    dt.getHours().toString().padStart(2, '0')}${
    dt.getMinutes().toString().padStart(2, '0')}${
    dt.getSeconds().toString().padStart(2, '0')}`;

console.log('Output Dir: ',  outPutDir);
const backupDir = outPutDir + '/' + dateFormated;
console.log('backupDir:' + backupDir);


function getFilesToMove(directory: string) {

    const ls = fs.readdirSync(directory);
    // we want only move files that we create.
    const filesToMove = new Array<string>();

    for(let i = 0; i < ls.length; i++) {
        const file =  ls[i];

        if (!file.startsWith('.') //ignore all . files, we also create with this tool. we don't create . files..
            && (file.endsWith('.transactions.csv')
                || file.endsWith('.transactions.json'))){
            filesToMove.push(file);
        }
    }
    return filesToMove;
}

const filesToMove = getFilesToMove(outPutDir);

if (filesToMove.length > 0) {
    fs.mkdirSync(backupDir);

    for(let i = 0; i < filesToMove.length; i++) {
        const fileToMove = filesToMove[i];
        fs.renameSync(`${outPutDir}/${fileToMove}`, `${backupDir}/${fileToMove}`);
    }
}

console.log(`Backed up old CSV Files to ${backupDir}`);


