import * as service from '../services/examStart';
export default {
  namespace: 'examStart',
  state: {
    paperDetail: {},
    urlParam:{},
  },
  subscriptions: {

  },
  effects: {
    *init({ payload }, { call, put }) {
      const [paperDetailRes] = yield [call(service.studentPaperDetailForSdt,payload)]
      yield put({
        type: 'save',
        payload: {
          paperDetail:paperDetailRes.data,
          urlParam: payload,
        },
      });
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
