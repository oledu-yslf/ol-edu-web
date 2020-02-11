import * as service from '../services/paperList';
export default {
  namespace: 'favoriteList',
  state: {
    list: []
  },
  subscriptions: {
    setup({ dispatch, history }) {
      const roleInfo = sessionStorage.getItem('roleInfo') ? JSON.parse(sessionStorage.getItem('roleInfo')) : '';
      const staffId = roleInfo.staffId || '';
      debugger
      return history.listen(({ pathname, query }) => {
        if (pathname === '/teacher/favorite') {
          dispatch({
            type: 'init',
            payload:{
              page: {
                pageNum: 1,
                pageSize: 10,
              },
              courseName:'',
              createStaffId:staffId,
            }
          });
        }
      });
    },
  },
  effects: {
    *init({ payload }, { call, put }) {
      debugger
      const { data } = yield call(service.listPage, payload);
      const { count, result } = data;
      yield put({
        type: 'save',
        payload: {
          list:result,
          total:count
        },
      });
    },
    *listPage({ payload }, { call, put }) {
      debugger
      const { data } = yield call(service.listPage, payload);
      const { count, result } = data;
      yield put({
        type: 'save',
        payload: {
          list:result,
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
