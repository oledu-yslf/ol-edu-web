import * as service from '../services/paperDetail';
export default {
  namespace: 'paperDetail',
  state: {
    paperDetail: {}
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/teacher/paperDetail') {
          dispatch({
            type: 'init',
            payload:{
              paperId:query.paperId
            }
          });
        }
      });
    },
  },
  effects: {
    *init({ payload }, { call, put }) {
      const [paperDetailRes] = yield [call(service.detailPaper,payload)]
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
