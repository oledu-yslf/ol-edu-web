import * as service from '../services/newPlan';
import router from 'umi/router';
import { message } from 'antd';
export default {
  namespace: 'newPlan',
  state: {
    planDetail: {},
    treeDepartData: [],
    paperList: [],
    total: 10,
    paperListModalVisbile:false,
    selectedPapers:[],
    staffList:[]
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
              type: 'planDetail',
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
    *planDetail({ payload }, { call, put }) {
      const { data } = yield call(service.planDetail, payload);
      yield put({
        type: 'save',
        payload: {
          planDetail: data,
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
    *staffList({ payload }, { call, put }) {
      const { data } = yield call(service.staffList, payload);
      yield put({
        type: 'save',
        payload: {
          staffList: data.result,
        },
      });
    },
    *paperPlanSave({ payload }, { call, put }) {
      const { code } = yield call(service.paperPlanSave, payload);
      if (code === 200) {
        message.success('发布计划成功').then(() => {
          router.push('/teacher/paperPlan');
        });
      }
    },
    *paperPlanUpdate({ payload }, { call, put }) {
      const { code } = yield call(service.paperPlanUpdate, payload);
      if (code === 200) {
        message.success('修改计划成功').then(() => {
          router.push('/teacher/paperPlan');
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
