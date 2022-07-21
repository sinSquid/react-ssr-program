import { createActionType } from './createActionTypes';

const SET_USER_AGENT = createActionType('SET_USER_AGENT');
const setUserAgent = userAgent => ({
  meta: { userAgent },
  type: SET_USER_AGENT,
});

const SET_NOW_TIME = createActionType('SET_NOW_TIME');
const setNowTime = nowTime => ({
  meta: { nowTime },
  type: SET_NOW_TIME,
});

const SET_LOCALE = createActionType('SET_LOCALE');
const setLocale = locale => ({
  type: SET_LOCALE,
  meta: { locale },
});

const SET_CLIENT_IP = createActionType('SET_CLIENT_IP');
const setClientIp = clientIp => ({
  type: SET_CLIENT_IP,
  meta: { clientIp },
});

const SET_REQUEST = createActionType('SET_REQUEST');
const setRequest = ({ host, path, queries }) => ({
  type: SET_REQUEST,
  meta: { host, path, queries },
});

const initialState = {
  userAgent: '',
  locale: '',
  clientIp: '',
  host: '',
  path: '',
  queries: {},
};

const _ = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_AGENT: {
      const { userAgent } = action.meta;
      return {
        ...state,
        userAgent,
      };
    }

    case SET_NOW_TIME: {
      const { nowTime } = action.meta;
      return {
        ...state,
        nowTime,
      };
    }

    case SET_LOCALE: {
      const { locale } = action.meta;
      return {
        ...state,
        locale,
      };
    }

    case SET_CLIENT_IP: {
      const { clientIp } = action.meta;
      return {
        ...state,
        clientIp,
      };
    }

    case SET_REQUEST: {
      const { host, path, queries } = action.meta;
      return {
        ...state,
        host,
        path,
        queries,
      };
    }

    default:
      return state;
  }
};

export default _;

export { setUserAgent, setNowTime, setLocale, setClientIp, setRequest };
