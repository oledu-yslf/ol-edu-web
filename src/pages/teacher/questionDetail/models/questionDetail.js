import * as service from '../services/questionDetail';
export default {
  namespace: 'questionDetail',
  state: {
    detail: {},
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
      const { examDetail } = examDetailRes.data;
      yield put({
        type: 'save',
        payload: {
          examDetail
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
