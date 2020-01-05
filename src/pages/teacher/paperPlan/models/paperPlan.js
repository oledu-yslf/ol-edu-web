import * as service from '../services/paperPlan';
export default {
  namespace: 'paperPlan',
  state: {
    text: 'page work',
    list: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/teacher/paperPlan') {
          dispatch({
            type: 'listPage',
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
          planList: result,
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
