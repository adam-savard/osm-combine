#!/bin/env node
const fs = require('fs');
const path = require('path');
const http = require('http');

const getOSMConvert = async function (osmPathLocal) {
  const os = await (await import('node:os')).default;
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(osmPathLocal);
    const url =
      os.platform() == 'win32'
        ? 'http://m.m.i24.cc/osmconvert64.exe'
        : 'http://m.m.i24.cc/osmconvert64';

    const request = http.get(url, function (response) {
      response.pipe(file);

      // after download completed close filestream
      file.on('finish', () => {
        file.close();
        console.error('Download Completed');
        resolve();
      });
    });
  });
};

const processOptions = async function () {
  const os = await (await import('node:os')).default;
  const osmconvertPathLocal =
    os.platform() == 'win32'
      ? path.join(__dirname, '../osmc/osmconvert.exe')
      : path.join(__dirname, '../osmc/osmconvert');

  if (!fs.existsSync(path.join(__dirname, '../osmc'))) {
    fs.mkdirSync(path.join(__dirname, '../osmc'));
  }

  if (!fs.existsSync(osmconvertPathLocal)) {
    console.error('Downloading osmconvert...');
    await getOSMConvert(osmconvertPathLocal);
    os.platform() == 'win32'
      ? console.error('No need to set execution bit')
      : fs.chmodSync(osmconvertPathLocal, '755');
  }

  console.error('Checking for osm-combine.json in current directory');

  let options = '';
  const configPath = path.join(process.cwd(), 'osm-combine.json');
  if (fs.existsSync(configPath)) {
    console.error('Found a config file!');
    const { files } = require(`${configPath}`);

    if (!Array.isArray(files)) {
      console.error('Property "files" is not an array. Exiting.');
      process.exit(1);
    }

    if (files.length < 2) {
      console.error(
        'Less than 2 files provided; a minimum of 2 files are needed to proceed.'
      );
      process.exit(1);
    }

    //loop over the files and check to see if they exist
    files.forEach((p, i) => {
      if (!fs.existsSync(p)) {
        console.error(
          `File ${p} does not exist. Please check your osm-combine.json`
        );
        process.exit(1);
      }

      //the first and last entries must be different
      if (i == 0) {
        options = `${osmconvertPathLocal} "${p}" --out-o5m |`;
      } else if (i == files.length - 1) {
        options = `${options} ${osmconvertPathLocal} - "${p}" -o=${path.join(
          process.cwd(),
          `region-combined-count-${files.length}.osm.pbf`
        )} --verbose`;
      } else {
        options = `${options} ${osmconvertPathLocal} - "${p}" --out-o5m |`;
      }
    });

    console.error('Spawning session to combine selected files:');
    console.error(files.toString().replaceAll(',', '\n'));

    console.error('This may take some time...');

    const exec = require('child_process').exec;
    const proc = exec(`${options}`);
    return;
  } else {
    console.error('No config file found; exiting');
    process.exit(1);
  }
};

const main = async function () {
  await processOptions();
};

main();
