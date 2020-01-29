import * as service from '../services/changePsw';
import { message } from 'antd';

export default {
  namespace: 'teacher',
  state: {
    staffDetail:{},staffId:'',editInfoVisible:false
  },
  effects: {
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
