import * as service from '../services/examStartDetail';
export default {
  namespace:'examStartDetail',
  state: {
    paperDetail: {},
    cursorExamIndex : 1,    //当前试题
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
      const res = yield [call(service.studentCommitPaper,payload)]
      if (res.code === 200){
        //成功
        const state = yield select(state => state.examStartDetail);

        yield put({
            type: 'save',
            payload: {
              cursorExamIndex: state.cursorExamIndex + 1,
            },
          });
        }
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
