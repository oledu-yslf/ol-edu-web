import * as service from '../services/questionDetail';
export default {
  namespace: 'questionDetail',
  state: {
    examDetail: {},
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/teacher/questionDetail') {
          dispatch({
            type: 'init',
            payload:{
              examId:query.examId
            }
          });
        }
      });
    },
  },
  effects: {
    *init({ payload }, { call, put }) {
      const [examDetailRes] = yield [call(service.examDetail,payload)];
      yield put({
        type: 'save',
        payload: {
          examDetail:examDetailRes.data
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
