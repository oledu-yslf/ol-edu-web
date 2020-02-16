import * as service from '../services/paperReview';
export default {
  namespace:'paperReview',
  state: {
    paperDetail: {},
    cursorExamIndex : 1,    //当前试题
    sureCommit:false,
  },
  subscriptions: {

  },
  effects: {
    *init({ payload }, { call, put }) {
      const [paperDetailRes] = yield [call(service.studentPaperDetailForThr,payload)]
      yield put({
        type: 'save',
        payload: {
          paperDetail:paperDetailRes.data
        },
      });
    },

    *teacherCommitPaper ({ payload }, {select, call, put }) {
      const [res] = yield [call(service.teacherCommitPaper,payload)]
      return res;
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
