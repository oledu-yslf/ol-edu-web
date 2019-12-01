import * as service from '../services/coursePlay';
export default {
  namespace: 'coursePlay',
  state: {
    courseDetail: {},
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/course/coursePlay') {
          dispatch({
            type: 'courseDetail',
            payload: {
              courseId:query.courseId
            },
          });
        }
      });
    },
  },
  effects: {
    *courseDetail({ payload }, { call, put }) {
      const { data } = yield call(service.courseDetail, payload);
      yield put({
        type: 'save',
        payload: {
          courseDetail: data,
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
