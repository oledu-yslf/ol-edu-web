import * as service from '../services/newPlan';
import { message } from 'antd';
import router from 'umi/router';

export default {
  namespace: 'newPlan',
  state: {
    examListTotal: 10,
    examList: [],
    treeDepartData:[],
    pageSize:10,
    paperPlanListVOList:[]

  },
  subscriptions: {

  },
  effects: {
    *init({ payload }, { call, put }) {
      const [respResult,respDepartData,resExamList,resStaffList] = yield [
        payload.planId?call(service.listPage, payload):'',
        call(service.departListAll),
        call(service.getExamList),
        call(service.staffList)
      ];
      const { paperPlanListVOList } = respResult.data?respResult.data:{};
      const examList = resExamList.data
      const staffList = resStaffList.data
      yield put({
        type: 'save',
        payload: {
          paperPlanListVOList: paperPlanListVOList?paperPlanListVOList:[],
          treeDepartData:respDepartData.data,
          examList:examList.result,
          examListTotal:examList.count,
          staffList:staffList.result,
          planDetail:respResult.data
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
          planDetail:data

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
    *savePaperPlan({ payload }, { call, put }) {
      const data = yield call(service.savePaperPlan, payload);
      if (data.successed) {
        message.success('提交成功', 3);
        router.push('/teacher/paperPlan')
      }
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
