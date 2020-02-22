import * as service from '../services/paperPlan';
import { message } from 'antd';
import {cloneDeep} from 'lodash'
import router from 'umi/router';

export default {
  namespace: 'paperPlan',
  state: {
    total: 10,
    planList: [],
    examListTotal: 10,
    examList: [],
    treeDepartData:[],
    pageSize:10,
    paperPlanListVOList:[],
    staffList:[]
  },
  subscriptions: {
    // setup({ dispatch, history }) {
    //   return history.listen(({ pathname, query }) => {
    //     if (pathname === '/teacher/paperPlan') {
    //       dispatch({
    //         type: 'listPage',
    //       });
    //     }
    //   });
    // },
  },
  effects: {
    *init({ payload }, { call, put }){
      const [ data,respResult,respDepartData,resExamList,resStaffList ] = yield [
        call(service.listPage, payload),
        payload.planId?call(service.listDetailPage, payload):'',
        call(service.departListAll),
        call(service.getExamList),
        call(service.staffList)
      ];

      const { paperPlanListVOList } = respResult.data?respResult.data:{};
      const examList = resExamList.data
      const staffList = resStaffList.data
      const { count, result } = data.data;
      yield put({
        type: 'save',
        payload: {
          planList: result,
          total: count,
          paperPlanListVOList: paperPlanListVOList?paperPlanListVOList:[],
          treeDepartData:respDepartData.data,
          examList:examList.result,
          examListTotal:examList.count,
          staffList:staffList.result,
          planDetail:respResult.data
        },
      });
    },
    // *modalInit({ payload }, { call, put }) {
    //   const [respResult,respDepartData,resExamList,resStaffList] = yield [
    //     payload.planId?call(service.listPage, payload):'',
    //     call(service.departListAll),
    //     call(service.getExamList),
    //     call(service.staffList)
    //   ];
    //   const { paperPlanListVOList } = respResult.data?respResult.data:{};
    //   const examList = resExamList.data
    //   const staffList = resStaffList.data
    //   yield put({
    //     type: 'save',
    //     payload: {
    //       paperPlanListVOList: paperPlanListVOList?paperPlanListVOList:[],
    //       treeDepartData:respDepartData.data,
    //       examList:examList.result,
    //       examListTotal:examList.count,
    //       staffList:staffList.result,
    //       planDetail:respResult.data
    //     },
    //   });
    // },
    *listPage({ payload }, { call, put }) {
      const { data } = yield call(service.listPage, payload);
      const { count, result } = data;
      yield put({
        type: 'save',
        payload: {
          planList: result,
          total: count,
        },
      });
    },
    *paperPlanUpdate({ payload }, { call, put, select }) {
      const { data } = yield call(service.paperPlanUpdate, payload);

      if (data === 1) {
        message.success('删除成功');
        const planList = yield select(state => state.paperList.planList);
        let clonePlanList = cloneDeep(planList);
        let index;
        for (let i = 0; i < clonePlanList.length; i++) {
          if (clonePlanList[i].planId === payload.planId) {
            index = i;
            break;
          }
        }
        clonePlanList.splice(index, 1);
        yield put({
          type: 'save',
          payload: {
            planList: clonePlanList,
          },
        });
      }
    },
    *listDetailPage({ payload }, { call, put }) {
      const { data } = yield call(service.listDetailPage, payload);
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
        message.success('计划提交成功', 3);
        yield put({
          type: 'save',
          payload: {
            newPlanVisible:false
          },
        });
      }
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
