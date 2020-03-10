import * as service from '../services/login';
export default {
  namespace: 'login',
  state: {
    prerouter: '',
    bannerPicData:null,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/login') {
          dispatch({
            type: 'save',
            prerouter: query,
          });
        }
      });
    },
  },
  effects: {
    *token({ payload }, { call, put }) {
      return yield call(service.token, payload);
    },
    *loadUserByUserName({ payload }, { call, put }) {
      return yield call(service.loadUserByUserName, payload);
    },
    *queryBanner({payload}, {call, put})
    {
      const resp = yield call(service.queryBanner, {});
      console.log(resp);

      if (resp.code == 200){
        yield put({
          type: 'save',
          payload: {
            bannerPicData:resp.data,
          },
        });
      }
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload};
    },
  },
};
