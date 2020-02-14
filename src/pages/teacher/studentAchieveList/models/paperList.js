import * as service from '../services/paperList';
import { message } from 'antd';
export default {
  namespace: 'studentAchieveList',
  state: {
    total: 10,
    paperList: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/teacher/studentAchieveList') {
          dispatch({
            type: 'init',
            payload:{
              ...query
            }
          });
        }
      });
    },
  },
  effects: {
    *init({ payload }, { call, put }) {
      const [paperRes] = yield [call(service.listPage,payload)];
      const { count, result } = paperRes.data;
      yield put({
        type: 'save',
        payload: {
          paperList: result,
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
          paperList: result,
          total: count,
        },
      });
    },
    *avgDetailExport({ payload }, { call, put }) {
      const { data } = yield call(service.avgDetailExport, payload);
      if (data.successed) {
        message.success('导出成功');
      }
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
