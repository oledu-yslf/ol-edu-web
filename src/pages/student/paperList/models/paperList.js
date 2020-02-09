import * as service from '../services/paperList';
export default {
  namespace: 'paperList',
  state: {
    count:0,
    pageNum:1,
    pageSize:10,
    paperList: [],
  },
  subscriptions: {

  },
  effects: {
    *getExamListForStudent({ payload }, { call, put }) {
      const { data } = yield call(service.getExamListForStudent, payload);
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
