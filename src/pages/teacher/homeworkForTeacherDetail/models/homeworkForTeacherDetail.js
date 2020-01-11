import * as service from '../services/homeworkForTeacherDetail';
export default {
  namespace: 'homeworkForTeacherDetail',
  state: {
    paperDetail: {}
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/teacher/homeworkForTeacherDetail') {
          dispatch({
            type: 'init',
            payload:{
              ...query
            }
          });
        }
      });
    },
  },
  effects: {
    *init({ payload }, { call, put }) {
      const [paperDetailRes] = yield [call(service.studentPaperDetailForThr,payload)]
      yield put({
        type: 'save',
        payload: {
          paperDetail:paperDetailRes.data
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
