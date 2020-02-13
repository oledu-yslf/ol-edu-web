import * as service from '../services/recentList';
import getUserId from '@/utils/getUserId';
export default {
  namespace: 'recentList',
  state: {
    list: [],
    total:12,
    courseList:[]
  },
  subscriptions: {
  },
  effects: {
    *listRecent({ payload }, { call, put }) {
      const {data} = yield call(service.listRecent,payload)
      const {result,count} = data;
      yield put({
        type: 'save',
        payload: {
          list: result,
          total:count
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
