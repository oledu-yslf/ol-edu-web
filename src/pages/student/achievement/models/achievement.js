import * as service from '../services/achievement';
export default {
  namespace: 'achievement',
  state: {
    count:0,
    pageNum:1,
    pageSize:10,
    paperList: [],
  },
  subscriptions: {

  },
  effects: {
    *getResultForStudent({ payload }, { call, put }) {
      const { data } = yield call(service.getResultForStudent, payload);
      const { count, result,pageNum,pageSize } = data;
      yield put({
        type: 'save',
        payload: {
          paperList: result,
          ...data,
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
