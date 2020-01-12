import * as service from '../services/student';
import { message } from 'antd';

export default {
  namespace: 'student',
  state: {
    staffDetail:{},staffId:'',editInfoVisible:false
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/student') {
          const roleInfo = localStorage.getItem('roleInfo')
            ? JSON.parse(localStorage.getItem('roleInfo'))
            : '';
          const staffId = roleInfo ? roleInfo.staffId : '';
          dispatch({
            type: 'staffDetail',
            payload: {
              staffId
            },
          });
          dispatch({
            type:'save',
            payload:{
              staffId
            }
          })
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
