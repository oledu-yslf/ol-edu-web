import * as service from '../services/studentAchieveDetail';
export default {
  namespace: 'studentAchieveDetail',
  state: {
    paperDetail: {},
    staffInfo:{},
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
      const [paperDetailRes,staffDetail] = yield [call(service.studentPaperDetailForThr,payload),call(service.staffDetail,payload)]
      yield put({
        type: 'save',
        payload: {
          paperDetail:paperDetailRes.data,
          staffInfo:staffDetail.data,
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
