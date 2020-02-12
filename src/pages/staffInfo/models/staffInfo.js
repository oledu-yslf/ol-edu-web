import * as service from '../services/staffInfo';
import { message } from 'antd';

export default {
  namespace: 'staffInfo',
  state: {
    staffDetail:{},staffId:'',editInfoVisible:false
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/teacher') {

        }
      });
    },
  },
  effects: {
    *staffDetail({ payload }, { call, put }) {
      const { data } = yield call(service.staffDetail, payload);
      yield put({
        type: 'save',
        payload: {
          staffDetail: data,
        },
      });
    },
    *staffUpdate({ payload }, { call, put }) {
      const data = yield call(service.staffUpdate, payload);
      if (data.successed) {
        yield put({
          type:'save',
          payload:{
            editInfoVisible:false
          }
        })
        yield put({
          type:'staffDetail',
          payload:{
            staffId:payload.staffId
          }
        })
        message.success('更新成功', 3);

      }
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
