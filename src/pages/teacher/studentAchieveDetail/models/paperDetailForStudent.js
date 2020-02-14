import * as service from '../services/paperDetailForStudent';
export default {
  namespace: 'studentAchieveDetail',
  state: {
    paperDetail: {},
    treeDepartData:[],
    planList:[],
    paperList:[]
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
      const [departData,paperDetailRes] = yield [call(service.departListAll),call(service.studentPaperDetailForSdt,payload)]
      debugger
      yield put({
        type: 'save',
        payload: {
          treeDepartData: departData.data,
          paperDetail:paperDetailRes.data
        },
      });
    },
    *planListPage({ payload }, { call, put }) {
      debugger
      const { data } = yield call(service.planListPage, payload);
      const { result } = data;
      yield put({
        type: 'save',
        payload: {
          planList: result,
        },
      });
    },
    *paperListPage({ payload }, { call, put }) {
      debugger
      const { data } = yield call(service.paperListPage, payload);
      const { result } = data;
      yield put({
        type: 'save',
        payload: {
          paperList: result,
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
