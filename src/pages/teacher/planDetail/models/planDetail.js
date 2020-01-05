import * as service from '../services/planDetail';
export default {
  namespace: 'planDetail',
  state: {
    text: 'page work',
    list: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/teacher/planDetail') {
          dispatch({
            type: 'listPage',
            payload:query
          });
        }
      });
    },
  },
  effects: {
    *listPage({ payload }, { call, put }) {
      const { data } = yield call(service.listPage, payload);
      const { count, result } = data;
      yield put({
        type: 'save',
        payload: {
          paperList: result,
          total: count,
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
