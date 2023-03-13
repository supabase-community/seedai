#! /usr/bin/env node

const fs = require('fs')
const path = require('path')
const syncRequest = require('sync-request');

const migrationsPath = './supabase/migrations';
const url = 'https://onqzwpamowmszkqwiufk.functions.supabase.red/generate-seeds';
//const url = 'https://webhook.site/2aa83488-7137-4beb-9574-43c7e2e805ba';
const fileSuffix = '_init.sql';

if(!fs.existsSync('./supabase')){
  console.error('Not in a Supabase project. Quitting..');
  process.exit(1); //an error occurred
}

if(!fs.existsSync('./supabase/migrations')){
  console.error('No migrations folder. Did you run `supabase migration new`?');
  process.exit(1); //an error occurred
}

let files = fs.readdirSync(migrationsPath)
    .filter(file => file.endsWith(fileSuffix))
    .map(file => path.resolve(migrationsPath, file))

if(files.length != 1){
  console.error('No init.sql file. Quitting..');
  process.exit(1); //an error occurred
}

console.log(process.argv.length)

if(process.argv.length < 2){
  console.error('No query given. Quitting..');
  process.exit(1); //an error occurred
}

const query = process.argv[2];

const initFile = files[0];

try {
  const fileContent = fs.readFileSync(initFile, 'utf8');

  console.log(`Sending ${initFile} to ${url}`);

  const res = syncRequest('POST', url, {
    json: {
      query: query,
      migration: fileContent
    }
  });

  console.log(res.getBody().toString());
} catch (err) {
  console.error(err);
}
