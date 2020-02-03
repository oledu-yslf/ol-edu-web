import * as service from '../services/examOrHomeworkDetail';
export default {
  namespace: 'examOrHomeworkDetail',
  state: {
    paperDetail: {}
  },
  subscriptions: {
    /*setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        console.log(pathname);
        console.log(query);
        dispatch({
          type: 'init',
          payload:{
            ...query
          }
        });

      });
    },*/
  },
  effects: {
    *init({ payload }, { call, put }) {
      const [paperDetailRes] = yield [call(service.studentPaperDetailForSdt,payload)]
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
