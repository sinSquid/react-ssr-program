import { v4 as uuidv4 } from 'uuid';

const createActionTypes = (type = '') => {
  const t = `${type.toUpperCase()}_${uuidv4()}`;
  return {
    REQUEST: `${t}_REQUEST`,
    SUCCESS: `${t}_SUCCESS`,
    FAILURE: `${t}_FAILURE`,
  };
};

const createActionType = (type = '') => `${type.toUpperCase()}_${uuidv4()}`;

export { createActionType, createActionTypes };
