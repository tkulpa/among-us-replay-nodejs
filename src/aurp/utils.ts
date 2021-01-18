import {
  EVENT,
  FRAME_DATA,
  PLAYER,
  PLAYER_STATE,
  SIGNATURE_LENGTH,
  TASK_STATE,
} from './constants';
import { BasicDataType, DataType } from './enums';

export function getTypeSize(type: BasicDataType) {
  switch (type) {
    case BasicDataType.UINT8:
      return 1;
    case BasicDataType.UINT16:
      return 2;
    case BasicDataType.UINT32:
      return 4;
    case BasicDataType.UINT64:
      return 8;
    case BasicDataType.BOOL:
      return 1;
    case BasicDataType.FLOAT:
      return 4;
    default:
      return 0;
  }
}

export const getReadFunction = (
  buffer: Buffer,
  type: BasicDataType
): ((offset: number) => void) => {
  switch (type) {
    case BasicDataType.UINT8:
      return buffer.readUInt8;
    case BasicDataType.UINT16:
      return buffer.readUInt16LE;
    case BasicDataType.UINT32:
      return buffer.readUInt32LE;
    case BasicDataType.UINT64:
      return buffer.readBigInt64LE;
    case BasicDataType.BOOL:
      return buffer.readUInt8;
    case BasicDataType.FLOAT:
      return buffer.readFloatLE;
    default:
      return () => 'UNDEFINED READ FUNCTION';
  }
};

export function readDataType(
  buffer: Buffer,
  dataType: BasicDataType,
  offset
): [any, number] {
  let data = 'UNDEFINED';
  let size = getTypeSize(dataType);
  if (size) {
    const readFunction = getReadFunction(buffer, dataType);
    data = readFunction.call(buffer, offset);
  } else if (dataType === BasicDataType.SIGNATURE) {
    size = SIGNATURE_LENGTH;
    data = readSignature(buffer, offset);
  } else if (dataType === BasicDataType.STRING) {
    size = readStringLength(buffer, offset);
    data = readString(buffer, offset);
  }
  return [data, size];
}

export function readSignature(buffer: Buffer, offset: number): string {
  return buffer.toString('binary', offset, SIGNATURE_LENGTH);
}

export function readStringLength(buffer: Buffer, offset: number): number {
  return buffer.readInt32LE(offset) + 4;
}

export function readString(buffer: Buffer, offset: number): string {
  const stringLength = buffer.readInt32LE(offset);
  const contentOffset = offset + 4;
  return buffer.toString('binary', contentOffset, contentOffset + stringLength);
}

export function readPlayer(buffer: Buffer, offset: number): [any, number] {
  const data = {};
  const initOffset = offset;
  for (const property in PLAYER) {
    const currentDataType: BasicDataType = PLAYER[property];
    const [resultData, size] = readDataType(buffer, currentDataType, offset);
    data[property] = resultData;
    offset += size;
  }
  return [data, offset - initOffset];
}

export function readTaskState(buffer: Buffer, offset: number): [any, number] {
  const data = {};
  const initOffset = offset;
  for (const property in TASK_STATE) {
    const currentDataType: BasicDataType = TASK_STATE[property];
    const [resultData, size] = readDataType(buffer, currentDataType, offset);
    data[property] = resultData;
    offset += size;
  }
  return [data, offset - initOffset];
}

export function readPlayerState(buffer: Buffer, offset: number): [any, number] {
  const data: any = {};
  const initOffset = offset;
  for (const property in PLAYER_STATE) {
    const currentDataType: BasicDataType = PLAYER_STATE[property];
    const [resultData, size] = readDataType(buffer, currentDataType, offset);
    data[property] = resultData;
    offset += size;
  }

  data['tasks'] = [];
  for (let i = 0; i < data.task_count || 0; i++) {
    const [task, tasksSize] = readTaskState(buffer, offset);
    offset += tasksSize;
    data['tasks'].push(task);
  }

  return [data, offset - initOffset];
}

export function readEvent(buffer: Buffer, offset: number): [any, number] {
  const data: any = {};
  const initOffset = offset;
  for (const property in EVENT) {
    const currentDataType: BasicDataType = EVENT[property];
    const [resultData, size] = readDataType(buffer, currentDataType, offset);
    data[property] = resultData;
    offset += size;
  }
  for (const property in FRAME_DATA) {
    const currentDataType: BasicDataType = FRAME_DATA[property];
    const [resultData, size] = readDataType(buffer, currentDataType, offset);
    data[property] = resultData;
    offset += size;
  }

  data['playerStates'] = [];
  for (let i = 0; i < data.state_count || 0; i++) {
    const [playerState, playerStateSize] = readPlayerState(buffer, offset);
    offset += playerStateSize;
    data['playerStates'].push(playerState);
  }

  return [data, offset - initOffset];
}
