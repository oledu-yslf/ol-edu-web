import * as service from '../services/paperPlan';
import { message } from 'antd';
import {cloneDeep} from 'lodash'

export default {
  namespace: 'paperPlan',
  state: {
    total: 10,
    planList: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/teacher/paperPlan') {
          dispatch({
            type: 'listPage',
          });
        }
      });
    },
  },
  effects: {
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
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
