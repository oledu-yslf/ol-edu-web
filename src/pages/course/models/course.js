import * as service from '../services/course';
const pageSize = 20;

export default {
  namespace: 'course',
  state: {
    total:99,
    list: [],
    treeData:[]
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/course') {
          dispatch({
            type: 'courseListpage',
            payload:{
              page: {
                pageSize,
                pageNum: 1,
              },
            }
          });
          dispatch({
            type: 'categoryListAll',
          });
        }
      });
    },
  },
  effects: {
    *courseListpage({ payload }, { call, put }) {
      const { data } = yield call(service.courseListpage, payload);
      const { result, count } = data;
      yield put({
        type: 'save',
        payload: {
          list: result,
          total: count,
        },
      });
    },
    *categoryListAll({ payload }, { call, put }) {
      const { data } = yield call(service.categoryListAll, {});
      yield put({
        type: 'save',
        payload: {
          treeData: data,
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
