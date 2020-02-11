import * as service from '../services/courseManage';

const pageSize = 5;
export default {
  namespace: 'courseManage',
  state: {
    treeData: [],
    plusVisible: false,
    deleteVisible: false,
    editVisible: false,
    courseName: '',
    // userName:'',
    pageNum: 1,
    list: [],
    total: 0,
    optionCourseName:'',
    optionCourseId:'',
    deleteCourseVisible: false,
    putawayVisible:false,
    selectedNodes:{}
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/teacher/courseManage') {
          let roleInfo = sessionStorage.getItem('roleInfo')?JSON.parse(sessionStorage.getItem('roleInfo')):'';
          const staffId = roleInfo?roleInfo.staffId :'';
          dispatch({
            type: 'categoryListAll',
          });
          dispatch({
            type: 'courseListpage',
            payload: {
              createStaffId:staffId,
              page: {
                pageSize,
                pageNum: 1,
              },
            },
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
    *categorySave({ payload }, { call, put }) {
      yield call(service.categorySave, payload);
      yield put({
        type: 'save',
        payload: {
          plusVisible: false,
        }
      })
      const { data } = yield call(service.categoryListAll, {});
      yield put({
        type: 'save',
        payload: {
          treeData: data,
        }
      });
    },
    *categoryUpdate({ payload }, { call, put }) {
      yield call(service.categoryUpdate, payload);
      yield put({
        type: 'save',
        payload: {
          editVisible: false,
        }
      })
      const { data } = yield call(service.categoryListAll, {});
      yield put({
        type: 'save',
        payload: {
          treeData: data,
        },
      });
    },
    *categoryDelete({ payload }, { call, put }) {
      yield call(service.categoryDelete, payload);
      yield put({
        type: 'save',
        payload: {
          deleteVisible: false,
        }
      })
      const { data } = yield call(service.categoryListAll, {});
      yield put({
        type: 'save',
        payload: {
          treeData: data,
        },
      });
    },
    *courseListpage({ payload }, { call, put }) {
      const { data } = yield call(service.courseListpage, payload);
      const { result, count } = data;
      yield put({
        type: 'save',
        payload: {
          list: result,
          total: count,
        },
      });

      return count;
    },
    *courseDelete({ payload }, { call, put, select }) {
      let roleInfo = sessionStorage.getItem('roleInfo')?JSON.parse(sessionStorage.getItem('roleInfo')):'';
      const staffId = roleInfo?roleInfo.staffId :'';
      yield call(service.courseDelete, payload);
      yield put({
        type: 'save',
        payload: {
          deleteCourseVisible: false,
        }
      })
      const courseName = yield select(
        (state) => {
        return state.courseManage.courseName})
      const pageNum = yield select(state => state.courseManage.pageNum)
      const selectedNodes = yield select(state => state.courseManage.selectedNodes)

      yield put({
        type: 'courseListpage',
        payload: {
          createStaffId:staffId,
          courseName,
          categoryId:selectedNodes.categoryId || '',
          page: {
            pageSize,
            pageNum,
          },
        },
      });
    },
    *courseUpdate({ payload }, { call, put ,select}){
      return yield call(service.courseUpdate, payload);
      // yield put(routerRedux.push(`/teacher/courseDetail?id=${courseId}`));/
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
