import * as service from '../services/newPaperManual';
export default {
  namespace: 'newPaperManual',
  state: {
    selectedExams:[],
    paperDetail: {},
    paperList:[],
    total:10,
    questionListModalVisbile:false
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/teacher/newPaperManual') {
          dispatch({
            type: 'init',
            payload:{
              paperId:query.paperId
            }
          });
        }
      });
    },
  },
  effects: {
    *init({ payload }, { call, put }) {
      const [paperDetailRes,listAllRes,listPageRes] = yield [call(service.detailPaper,payload),call(service.listAll),call(service.listPage)]
      console.log(paperDetailRes);
      yield put({
        type: 'save',
        payload: {
          paperDetail:paperDetailRes.data,
          typeList:listAllRes.data,
          questionList: listPageRes.data.result,
          total: listPageRes.data.count,
        },
      });
    },
    *listAll({ payload }, { call, put }) {
      const { data } = yield call(service.listAll);
      yield put({
        type: 'save',
        payload: {
          typeList: data,
        },
      });
    },
    *listPage({ payload }, { call, put }) {
      const { data } = yield call(service.listPage, payload);
      const { count, result } = data;
      yield put({
        type: 'save',
        payload: {
          questionList: result,
          total: count,
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
