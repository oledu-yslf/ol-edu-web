import { routerRedux } from 'dva';

import * as service from '../services/courseEdit';
// import CourseEdit from '../index';
export default {
  namespace: 'courseEdit',
  state: {
    treeData: [],
    categoryId:'',
    courseId:'',
    courseName:'',
    file_ID:[],introduce:''
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/teacher/courseEdit') {
          dispatch({
            type: 'categoryListAll',
          });
        }
        if (query.id) {
          dispatch({
            type: 'courseDetail',
            payload:{courseId:query.id}
          });
        }
      });
    },
  },
  effects: {
    *categoryListAll({ payload }, { call, put }) {
      const { data } = yield call(service.categoryListAll, {});
      yield put({
        type: 'save',
        payload: {
          treeData: data,
        },
      });
    },
    *courseSave({ payload }, { call, put }){
      const {data} = yield call(service.courseSave, payload);
      yield put(routerRedux.push(`/teacher/courseDetail?id=${data}`));
    },
    *courseUpdate({ payload }, { call, put ,select}){
      yield call(service.courseUpdate, payload);
      const courseId = yield select(state => state.courseEdit.courseId)

      yield put(routerRedux.push(`/teacher/courseDetail?id=${courseId}`));
    },
    *courseDetail({ payload }, { call, put }){
      const {data} = yield call(service.courseDetail, payload);
      const {categoryId,courseId,courseName,logoFile,introduce} = data;
      const file = {};
      file.name = logoFile.fileName;
      file.url = `/api${logoFile.url}/${logoFile.fileName}`;
      file.status = 'done';
      file.uid = logoFile.fileId

      const file_ID = [file]
      yield put({
        type:'save',
        payload:{
          categoryId,courseId,courseName,file_ID,introduce
        }
      })
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
