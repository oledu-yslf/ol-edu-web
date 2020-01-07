import * as service from '../services/homeworkForTeacherList';
export default {
  namespace: 'homeworkForTeacherList',
  state: {
    text: 'page work',
    list: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/teacher/homeworkForTeacherList') {
          dispatch({
            type: 'init',
          });
        }
      });
    },
  },
  effects: {
    *init({ payload }, { call, put }) {
      const [paperRes] = yield [call(service.listPage)];
      const { count, result } = paperRes.data;
      yield put({
        type: 'save',
        payload: {
          paperList: result,
          total: count,
        },
      });
    },
    *listPage({ payload }, { call, put }) {
      const { data } = yield call(service.listPage, payload);
      const { count, result } = data;
      yield put({
        type: 'save',
        payload: {
          paperList: result,
          total: count,
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
