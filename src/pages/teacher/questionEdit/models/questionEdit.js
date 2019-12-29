import * as service from '../services/questionEdit';
export default {
  namespace: 'questionEdit',
  state: {
    examDetail: {},
    typeList: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/teacher/questionEdit') {
          if (query.examId) {
            dispatch({
              type: 'examDetail',
              payload: {
                examId: query.examId,
              },
            });
          }
          dispatch({
            type: 'listAll'
          });
        }
      });
    },
  },
  effects: {
    *listAll({ payload }, { call, put }) {
      const {data} = yield  call(service.listAll);
      yield put({
        type: 'save',
        payload: {
          typeList:data,
        },
      });
    },
    *examDetail({ payload }, { call, put }) {
      const { data } = yield call(service.examDetail, payload) ;
      yield put({
        type: 'save',
        payload: {
          examDetail: data,
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
