import fs from 'fs';
import util from 'util';
import readAurpFile from './aurp/';

const readFileAsync = util.promisify(fs.readFile);

const AURP_FILE_SIGNATURE = 'AURP';
const COMPATIBLE_AURP_VERSION = 3;

async function main(aurpReplayPath?: string) {
  const myArgs = process.argv.slice(2);
  const data = await readFileAsync(aurpReplayPath || myArgs[0]);
  const fistFourBytesAsString = data.toString('binary', 0, 4);
  if (fistFourBytesAsString !== AURP_FILE_SIGNATURE) {
    throw new Error(
      `File ${myArgs} dosen\'t contain signature of aurp format. Make sure that you are reading a correct .aurp replay file.`
    );
  }
  const fileAurpFormatVersion = data.readInt32LE(4);
  if (COMPATIBLE_AURP_VERSION !== fileAurpFormatVersion) {
    throw new Error(
      `File ${myArgs} has not supported AURP format, try different version of parser. This parsers takes 'v${COMPATIBLE_AURP_VERSION}' version and file is 'v${fileAurpFormatVersion}'.`
    );
  }

  // EVERYTHING IS OK, READ REST OF FILE
  return readAurpFile(data);
}

module.exports = main;
