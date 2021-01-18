import { AURP_FORMAT } from './constants';
import { BasicDataType } from './enums';
import { readDataType, readPlayer, readEvent } from './utils';

function readAurpFile(buffer: Buffer) {
  const obj: any = {};
  let offset = 0;
  for (const property in AURP_FORMAT) {
    const currentDataType: BasicDataType = AURP_FORMAT[property];
    const [resultData, size] = readDataType(buffer, currentDataType, offset);
    obj[property] = resultData;
    offset += size;
  }
  obj['players'] = [];
  for (let i = 0; i < obj.player_count || 0; i++) {
    const [player, size] = readPlayer(buffer, offset);
    offset += size;
    obj['players'].push(player);
  }
  obj['events'] = [];
  try {
    for (let i = 0; ; i++) {
      const [event, size] = readEvent(buffer, offset);
      offset += size;
      obj['events'].push(event);
    }
  } catch (err) {
    if (err.code === 'ERR_OUT_OF_RANGE') {
      console.log('No more events, TODO: figure better way to handle this');
    } else {
      console.error('err', err);
    }
  }
  console.log(`Parsed game with: ${obj['events'].length} events`);
  return obj;
}

export default readAurpFile;
