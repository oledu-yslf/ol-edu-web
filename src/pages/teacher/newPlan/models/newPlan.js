import * as service from '../services/newPlan';
export default {
  namespace: 'newPlan',
  state: {
    planDetail: {},
    treeDepartData: [],
    paperList: [],
    total: 10,
    paperListModalVisbile:false,
    selectedPaper:[]
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/teacher/newPlan') {
          dispatch({
            type: 'init',
          });
          if (query.planId) {
            dispatch({
              type: 'detailPaper',
              payload: query,
            });
          }
        }
      });
    },
  },
  effects: {
    *init({ payload }, { call, put }) {
      const [departData, paperRes] = yield [
        call(service.departListAll),
        call(service.listPage),
      ];
      const { count, result } = paperRes.data;
      yield put({
        type: 'save',
        payload: {
          treeDepartData: departData.data,
          paperList: result,
          total: count,
        },
      });
    },
    *detailPaper({ payload }, { call, put }) {
      const { data } = yield call(service.detailPaper, payload);
      yield put({
        type: 'save',
        payload: {
          paperDetail: data,
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
