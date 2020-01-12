import * as service from '../services/startHomeWork';
export default {
  namespace: 'startHomeWork',
  state: {
    paperDetail: {},
    paperId: '',
    planDetailId: '',
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/student/startHomeWork') {
          dispatch({
            type: 'init',
            payload: {
              ...query,
            },
          });
          dispatch({
            type: 'save',
            payload: {
              ...query,
            },
          });
        }
      });
    },
  },
  effects: {
    *init({ payload }, { call, put }) {
      const [paperDetailRes] = yield [call(service.studentPaperDetailForSdt, payload)];
      const { mapPaperExamSummary }= paperDetailRes.data;
      let examList = [];
      for(let i in mapPaperExamSummary){
        for(let j in mapPaperExamSummary[i].paperExamVOList){
          examList.push(mapPaperExamSummary[i].paperExamVOList[j])
        }
      }
      yield put({
        type: 'save',
        payload: {
          paperDetail: paperDetailRes.data,
          examList
        },
      });
    },
    *commit({ payload }, { call, put, select }) {
      const planDetailId = yield select(state => state.startHomeWork.planDetailId);
      const paperId = yield select(state => state.startHomeWork.paperId);
      const paperDetailRes = yield call(
        service.commit,
        Object.assign(
          {
            planDetailId,
            paperId,
          },
          payload
        ),
      );
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
