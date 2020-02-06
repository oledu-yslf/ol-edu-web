import * as service from '../services/examStartDetail';
export default {
  namespace:'examStartDetail',
  state: {
    paperDetail: {},
    cursorExamIndex : 1,    //当前试题
    sureCommit:false,
  },
  subscriptions: {

  },
  effects: {
    *init({ payload }, { call, put }) {
      const [paperDetailRes] = yield [call(service.studentPaperDetailForSdt,payload)]
      yield put({
        type: 'save',
        payload: {
          paperDetail:paperDetailRes.data
        },
      });
    },

    *studentCommitPaper ({ payload }, {select, call, put }) {
      const [res] = yield [call(service.studentCommitPaper,payload)]
      return res;
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
