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
          dispatch({
            type:'init'
          })
        }
      });
    },
  },
  effects: {
    *init({ payload }, { call, put }) {
      const roleInfo = JSON.parse(localStorage.getItem('roleInfo'));
      const staffNo = roleInfo?roleInfo.staffNo :'';
      const [rencentResult,newResult,hotResult] = yield [
        call(service.listRecent, {
          createStaffId: staffNo,
          page: {
            pageSize: 4,
            pageNum: 1,
          },
        }),
        call(service.courseListpage, {
          orderBy: 'create_date desc',
          page: {
            pageSize: 4,
            pageNum: 1,
          },
        }),
        call(service.courseListpage, {
          orderBy: 'count_study desc',
          page: {
            pageSize: 4,
            pageNum: 1,
          },
        }),
      ];
      console.log(rencentResult);
      yield put({
        type: 'save',
        payload: {
          recentList:rencentResult.data.result,
          newList:newResult.data.result,
          hotList:hotResult.data.result
        },
      });
    }
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
