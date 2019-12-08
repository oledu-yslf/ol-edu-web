import * as service from '../services/coursePlay';
export default {
  namespace: 'coursePlay',
  state: {
    countStudy:0,
    courseId:'',
    url:'',
    courseDetail: {},
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/course/coursePlay') {
          dispatch({
            type: 'courseDetail',
            payload: {
              courseId:query.courseId
            },
          });
          dispatch({
            type: 'save',
            payload: {
              courseId:query.courseId
            },
          });
        }
      });
    },
  },
  effects: {
    *courseDetail({ payload }, { call, put ,select}) {
      const { data } = yield call(service.courseDetail, payload);
      yield put({
        type: 'save',
        payload: {
          courseDetail: data,
          countStudy:data.countStudy
        },
      });
    },
    *favoriteSave({ payload }, { call, put ,select}) {
      // let courseId = yield select(state=>state.coursePlay.courseId);
      return yield call(service.favoriteSave,payload);
    },
    *studySave({ payload }, { call, put ,select}){
      yield call(service.studySave,payload)
    }
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
