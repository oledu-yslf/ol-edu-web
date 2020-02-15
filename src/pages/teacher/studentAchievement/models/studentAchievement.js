import * as service from '../services/studentAchievement';
export default {
  namespace: 'studentAchievement',
  state: {
    total: 10,
    achievementList: [],
    condPlanList:[],
    condPaperList:[],
    treeDepartData:[],
    pageSize:10,

  },
  subscriptions: {

  },
  effects: {
    *init({ payload }, { call, put }) {
      const [respResult,respCond,respDepartData] = yield [
        call(service.listPage, payload),
        call(service.getPlanAndPaperList, payload),
        call(service.departListAll)
      ];
      const { count, result } = respResult.data;

      const { planVOList, paperVOList } = respCond.data;

      yield put({
        type: 'save',
        payload: {
          achievementList: result,
          total: count,
          condPlanList:planVOList,
          condPaperList:paperVOList,
          treeDepartData:respDepartData.data,
        },
      });
    },
    *listPage({ payload }, { call, put }) {
      const { data } = yield call(service.listPage, payload);
      const { count, result } = data;
      yield put({
        type: 'save',
        payload: {
          achievementList: result,
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
