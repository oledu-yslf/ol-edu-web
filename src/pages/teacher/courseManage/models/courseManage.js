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
    userName:'',
    pageNum: 1,
    list: [],
    total: 0,
    optionCourseName:'',
    optionCourseId:'',
    deleteCourseVisible: false,
    selectedNodes:{}
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/teacher/courseManage') {
          dispatch({
            type: 'categoryListAll',
          });
          dispatch({
            type: 'courseListpage',
            payload: {
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
    },
    *courseDelete({ payload }, { call, put, select }) {
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
          courseName,
          categoryId:selectedNodes.categoryId || '',
          page: {
            pageSize,
            pageNum,
          },
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
