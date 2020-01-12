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
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/student/recentList') {
          dispatch({
            type: 'listRecent',
            payload:{
              createStaffId:getUserId()
            }
          });
        }
      });
    },
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
    *courseListpage({ payload }, { call, put }) {
      const {data} = yield call(service.courseListpage,payload)
      const {result} = data;
      yield put({
        type: 'save',
        payload: {
          courseList: result,
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
