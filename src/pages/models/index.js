import * as service from '../services/index';

export default {
  namespace: 'index',
  state: {
    recentList: [],
    newList: [],
    hotList: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/') {
          const roleInfo = JSON.parse(localStorage.getItem('roleInfo'));
          const staffNo = roleInfo.staffNo;
          dispatch({
            type: 'listRecent',
            payload: {
              createStaffId: staffNo,
              page: {
                pageSize: 4,
                pageNum: 1,
              },
            },
          });
          dispatch({
            type: 'courseListpage',
            payload: {
              orderBy: 'create_date desc',
              page: {
                pageSize: 4,
                pageNum: 1,
              },
            },
          });
          dispatch({
            type: 'courseListpage',
            payload: {
              orderBy: 'count_study desc',
              page: {
                pageSize: 4,
                pageNum: 1,
              },
            },
          });
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
          recentList: result,
        },
      });
    },
    *courseListpage({ payload }, { call, put }) {
      const { data } = yield call(service.courseListpage, payload);
      const { result } = data;
      if(payload.orderBy === 'create_date desc'){
        yield put({
          type: 'save',
          payload: {
            newList: result,
          },
        });
      }else{
        yield put({
          type: 'save',
          payload: {
            hotList: result,
          },
        });
      }
      
      
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
