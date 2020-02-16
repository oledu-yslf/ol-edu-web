import * as service from '../services/newPlan';
export default {
  namespace: 'newPlan',
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
      const [respResult,respDepartData,resExamList] = yield [
        payload.planId?call(service.listPage, payload):'',
        call(service.departListAll),
        call(service.getExamList),
      ];
      const { paperPlanListVOList } = respResult.data?respResult.data:{};
      const examList = resExamList.data
      yield put({
        type: 'save',
        payload: {
          paperPlanListVOList: paperPlanListVOList?paperPlanListVOList:[],
          treeDepartData:respDepartData.data,
          examList:examList.result,
          examListTotal:examList.count
        },
      });
    },
    *listPage({ payload }, { call, put }) {
      const { data } = yield call(service.listPage, payload);
      const { paperPlanListVOList } = data;
      yield put({
        type: 'save',
        payload: {
          paperPlanListVOList: paperPlanListVOList,
        },
      });
    },
    *examList({ payload }, { call, put }) {
      const {resExamList} = yield call(service.getExamList, payload);
      const examList = resExamList.data
      yield put({
        type: 'save',
        payload: {
          examList:examList.result,
          examListTotal:examList.count
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
