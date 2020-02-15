import * as service from '../services/studentAchieveList';
import { message } from 'antd';
export default {
  namespace: 'studentAchieveList',
  state: {
    total: 10,
    achieveList: [],    //结果
    pageSize:10,
    studentList:[],   //查询条件中的学生列表
  },
  subscriptions: {

  },
  effects: {
    *init({ payload }, { call, put }) {
      const [paperRes,studentRes] = yield [call(service.listPage,payload),call(service.getStudentList,payload)];
      const { count, result } = paperRes.data;

      yield put({
        type: 'save',
        payload: {
          achieveList: result,
          total: count,
          studentList:paperRes.data.result,
        },
      });
    },
    *listPage({ payload }, { call, put }) {
      const { data } = yield call(service.listPage, payload);
      const { count, result } = data;
      yield put({
        type: 'save',
        payload: {
          achieveList: result,
          total: count,
        },
      });
    },
    *avgDetailExport({ payload,callback }, { call, put }) {
      const response = yield call(service.avgDetailExport, payload);

      if (response instanceof Blob) {
        if (callback && typeof callback === 'function') {
          callback(response);
        }
      } else {
        message.warning('Some error messages...', 5);
      }
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
