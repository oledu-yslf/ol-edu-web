import * as service from '../services/index';
const pageSize = 20;

export default {
  namespace: 'index',
  state: {
    total:99,
    recentList: [],
    treeData:[]
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/') {
          dispatch({
            type: 'listRecent',
            payload:{
              page: {
                pageSize:4,
                pageNum: 1,
              },
            }
          })
        }
      });
    },
  },
  effects: {
    *listRecent({ payload }, { call, put }) {
      const { data } = yield call(service.listRecent, payload);
      const { result } = data;
      yield put({
        type: 'save',
        payload: {
          list: result,
        },
      });
    },
    // *listRecent({ payload }, { call, put }) {
    //   const { data } = yield call(service.listRecent, payload);
    //   const { result } = data;
    //   yield put({
    //     type: 'save',
    //     payload: {
    //       list: result,
    //     },
    //   });
    // },
    // *listRecent({ payload }, { call, put }) {
    //   const { data } = yield call(service.listRecent, payload);
    //   const { result } = data;
    //   yield put({
    //     type: 'save',
    //     payload: {
    //       list: result,
    //     },
    //   });
    // }
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
