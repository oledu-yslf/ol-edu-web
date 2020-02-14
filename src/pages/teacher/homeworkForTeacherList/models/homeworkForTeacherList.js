import * as service from '../services/homeworkForTeacherList';
export default {
  namespace: 'homeworkForTeacherList',
  state: {
    total: 10,
    paperList: [],
    pageNum:1,
    pageSize:10,
  },
  subscriptions: {
  },
  effects: {
    *getHomeworkForTeacher({ payload }, { call, put }) {
      //const { data } = yield call(service.listPage, payload);
      const [resp] = yield [call(service.getHomeworkForTeacher, payload)];

      const { count, pageNum, pageSize, result } = resp.data;

      yield put({
        type: 'save',
        payload: {
          paperList: result,
          total: count,
          pageNum,
          pageSize,
        },
      });
    },

    *getPaperForTeacher({ payload }, { call, put }) {
      //const { data } = yield call(service.listPage, payload);
      const [resp] = yield [call(service.getPaperForTeacher, payload)];

      const { count, pageNum, pageSize, result } = resp.data;

      yield put({
        type: 'save',
        payload: {
          paperList: result,
          total: count,
          pageNum,
          pageSize,
        },
      });
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
