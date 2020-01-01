import * as service from '../services/paperList';
export default {
  namespace: 'paperList',
  state: {
    paperList: [],
    total: undefined,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/teacher/paperList') {
          dispatch({
            type: 'init',
          });
        }
      });
    },
  },
  effects: {
    *init({ payload }, { call, put }) {
      const [paperRes] = yield [call(service.listPage)];
      const { count, result } = paperRes.data;
      yield put({
        type: 'save',
        payload: {
          questionList: result,
          total: count,
        },
      });
    },
  },
  reducers: {
    save(state, action) {
      console.log(action);
      return { ...state, ...action.payload };
    },
  },
};
