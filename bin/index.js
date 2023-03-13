#! /usr/bin/env node

const fs = require('fs')
const path = require('path')
const syncRequest = require('sync-request');

const migrationsPath = './supabase/migrations';
const url = 'https://webhook.site/2aa83488-7137-4beb-9574-43c7e2e805ba';
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

const initFile = files[0];

try {
  const data = fs.readFileSync(initFile, 'utf8');

  console.log(`Sending ${initFile} to ${url}`);

  const res = syncRequest('POST', url, {
    body: data
  });
  // console.log(res.getBody());
} catch (err) {
  console.error(err);
}
