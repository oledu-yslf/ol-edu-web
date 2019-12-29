import * as service from '../services/questionEdit';
export default {
  namespace: 'questionEdit',
  state: {
    text: 'page work',
    list: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/teacher/questionEdit') {
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
