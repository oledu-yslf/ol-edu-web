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
    pageNum:1,
    pageSize:10,
    paperPlanListVOList:[],
    staffList:[],

    planId:null,    //用这个来衡量是新增还是更新。
  },
  subscriptions: {
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
      const { count, result,pageNum, pageSize } = data.data;
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
          planDetail:respResult.data,
          pageNum,
          pageSize,
        },
      });
    },

    *listPage({ payload }, { call, put }) {
      const { data } = yield call(service.listPage, payload);
      const { count, result,pageNum, pageSize} = data;
      yield put({
        type: 'save',
        payload: {
          planList: result,
          total: count,
          pageNum,
          pageSize,
        },
      });
    },


    *listDetailPage({ payload }, { call, put }) {
      const { data } = yield call(service.listDetailPage, payload);
      const { paperPlanListVOList } = data;
      yield put({
        type: 'save',
        payload: {
          paperPlanListVOList: paperPlanListVOList,
          planDetail:data,
          planId:data.planId,
        },
      });
    },
    *examList({ payload }, { call, put }) {
      const resExamList = yield call(service.getExamList, payload);
      console.log("resExamList",resExamList)
      const examList = resExamList.data
      yield put({
        type: 'save',
        payload: {
          examList:examList.result,
          examListTotal:examList.count,
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
    *paperPlanDelete({ payload }, { call, put, select }) {
      const { data } = yield call(service.paperPlanDelete, payload);

      if (data === 1) {
        message.success('删除成功');
      }
    },
    *paperPlanUpdate({ payload }, { call, put }) {
      const data = yield call(service.paperPlanUpdate, payload);
      if (data.successed) {
        message.success('计划更新成功', 3);
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
