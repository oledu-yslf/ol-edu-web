import * as service from '../services/resultList';
export default {
  namespace: 'resultList',
  state: {
    treeDepartData:[],
    resultList: [],
    total:10,
    planList:[],
    paperList:[]
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/teacher/resultList') {
          dispatch({
            type: 'init',
          });
        }
      });
    },
  },
  effects: {
    *init({ payload }, { call, put }) {
      const [departData,resultRes] = yield [call(service.departListAll),call(service.listPage)]
      const { count, result } = resultRes.data;
      yield put({
        type: 'save',
        payload: {
          treeDepartData: departData.data,
          resultList: result,
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
          resultList: result,
          total: count,
        },
      });
    },
    *planListPage({ payload }, { call, put }) {
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
