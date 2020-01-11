import * as service from '../services/resultDetail';
export default {
  namespace: 'resultDetail',
  state: {
    total: 10,
    resultDetail: [],staffList:[]
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/teacher/resultDetail') {
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
          resultDetail: result,
          total: count,
        },
      });
    },
    *staffList({ payload }, { call, put }) {
      const { data } = yield call(service.staffList, payload);
      yield put({
        type: 'save',
        payload: {
          staffList: data.result,
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
