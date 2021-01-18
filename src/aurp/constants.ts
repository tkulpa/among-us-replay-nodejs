import { BasicDataType, DataType } from './enums';

export const SIGNATURE_LENGTH = 4;

export const AURP_FORMAT = {
  signature: BasicDataType.SIGNATURE,
  version: BasicDataType.UINT32,
  timestamp: BasicDataType.UINT64,
  mod_version: BasicDataType.STRING,
  game_version: BasicDataType.STRING,
  map_id: BasicDataType.UINT32,
  player_count: BasicDataType.UINT32,
  // players: DataType.PLAYER,
  // events: DataType.EVENT,
};

export const PLAYER = {
  id: BasicDataType.UINT8,
  name: BasicDataType.STRING,
  color_id: BasicDataType.UINT8,
  hat_id: BasicDataType.UINT32,
  pet_id: BasicDataType.UINT32,
  skin_id: BasicDataType.UINT32,
  is_impostor: BasicDataType.BOOL,
};

export const EVENT = {
  type: BasicDataType.UINT8,
  dt: BasicDataType.UINT32,
  // event_data: DataType.FRAME_DATA,
};

export const FRAME_DATA = {
  is_complete: BasicDataType.BOOL,
  state_count: BasicDataType.UINT8,
  // player_states: DataType.PLAYER_STATE,
};

export const PLAYER_STATE = {
  id: BasicDataType.UINT8,
  position_x: BasicDataType.FLOAT,
  position_y: BasicDataType.FLOAT,
  velocity_x: BasicDataType.FLOAT,
  velocity_y: BasicDataType.FLOAT,
  is_dead: BasicDataType.BOOL,
  is_disconnected: BasicDataType.BOOL,
  task_count: BasicDataType.UINT8,
  // tasks: DataType.TASK_STATE,
};

export const TASK_STATE = {
  is_complete: BasicDataType.BOOL,
  type_id: BasicDataType.UINT8,
  id: BasicDataType.UINT32,
};
