import * as service from '../services/homeworkForStudent';
export default {
  namespace: 'homeworkForStudent',
  state: {
    total:10,
    paperList: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/student/homeworkForStudent') {
          dispatch({
            type: 'listPage',
          });
        }
      });
    },
  },
  effects: {
    // *init({ payload }, { call, put }) {
    //   const [paperRes] = yield [call(service.listPage)];
    //   const { count, result } = paperRes.data;
    //   yield put({
    //     type: 'save',
    //     payload: {
    //       paperList: result,
    //       total: count,
    //     },
    //   });
    // },
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
