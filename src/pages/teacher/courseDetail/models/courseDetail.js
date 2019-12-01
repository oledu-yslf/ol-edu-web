import * as service from '../services/courseDetail';

export default {
  namespace: 'courseDetail',
  state: {
    courseDetail: {},
    chapterDetail: {},
    periodDetail: {},
    isSelectedNode: false,
    isLeaf: false,
    selectedKeys: [],
    treeData: [],
    plusVisible: false,
    deleteVisible: false,
    editPeriod: false
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/teacher/courseDetail') {
          dispatch({
            type: 'courseDetail',
            payload: {courseId:query.id}
          });
        }
      });
    },
  },
  effects: {
    *courseDetail({ payload }, { call, put }) {
      const { data } = yield call(service.courseDetail, payload);
      const treeData = data.chapterVOList;
      for (let i in treeData) {
        if (!treeData[i].periodVOList) {
          treeData[i].periodVOList = [];
        }
      }
      yield put({
        type: 'save',
        payload: {
          courseDetail: data,
          treeData
        },
      });
    },
   
    *chapterSave({ payload }, { call, put, select }) {
      yield call(service.chapterSave, payload);
      const courseId = yield select(state => state.courseDetail.courseDetail.courseId)
      const { data } = yield call(service.courseDetail, { courseId: courseId });
      const treeData = data.chapterVOList;
      for (let i in treeData) {
        if (!treeData[i].periodVOList) {
          treeData[i].periodVOList = [];
        }
      }
      yield put({
        type: 'save',
        payload: {
          courseDetail: data,
          treeData,
          plusVisible: false
        },
      });
    },
    *chapterUpdate({ payload }, { call, put, select }) {
      yield call(service.chapterUpdate, payload);
      const courseId = yield select(state => state.courseDetail.courseDetail.courseId)
      const { data } = yield call(service.courseDetail, { courseId: courseId });
      const treeData = data.chapterVOList;
      for (let i in treeData) {
        if (!treeData[i].periodVOList) {
          treeData[i].periodVOList = [];
        }
      }
      yield put({
        type: 'save',
        payload: {
          courseDetail: data,
          treeData,
          plusVisible: false
        },
      });
    },
    *chapterDetail({ payload }, { call, put, select }) {
      const { data } = yield call(service.chapterDetail, payload);
      yield put({
        type: 'save',
        payload: {
          chapterDetail: data,
        },
      });
    },
    *chapterDelete({ payload }, { call, put, select }) {
      yield call(service.chapterDelete, payload);
      const courseDetail = yield select(state => state.courseDetail.courseDetail);
      const { data } = yield call(service.courseDetail, { courseId: courseDetail.courseId });
      const treeData = data.chapterVOList;
      for (let i in treeData) {
        if (!treeData[i].periodVOList) {
          treeData[i].periodVOList = [];
        }
      }
      yield put({
        type: 'save',
        payload: {
          courseDetail: data,
          treeData,
          editPeriod: false,
          deleteVisible:false
        },
      });
    },

    *periodSave({ payload }, { call, put, select }) {
      yield call(service.periodSave, payload);
      const courseDetail = yield select(state => state.courseDetail.courseDetail);
      const { data } = yield call(service.courseDetail, { courseId: courseDetail.courseId });
      const treeData = data.chapterVOList;
      for (let i in treeData) {
        if (!treeData[i].periodVOList) {
          treeData[i].periodVOList = [];
        }
      }
      yield put({
        type: 'save',
        payload: {
          courseDetail: data,
          treeData,
          editPeriod: false,

        },
      });
    },
    *periodUpdate({ payload }, { call, put, select }) {
      yield call(service.periodUpdate, payload);
      const courseDetail = yield select(state => state.courseDetail.courseDetail);
      const { data } = yield call(service.courseDetail, { courseId: courseDetail.courseId });
      const treeData = data.chapterVOList;
      for (let i in treeData) {
        if (!treeData[i].periodVOList) {
          treeData[i].periodVOList = [];
        }
      }
      yield put({
        type: 'save',
        payload: {
          courseDetail: data,
          treeData,
          editPeriod: false,

        },
      });
    },
    *periodDetail({ payload }, { call, put, select }) {
      const { data } = yield call(service.periodDetail, payload);
      const { attachFileInfo, videoFileInfo } = data;

      videoFileInfo.name = videoFileInfo.fileName;
      videoFileInfo.url = `/api${videoFileInfo.url}/${videoFileInfo.fileName}`;
      videoFileInfo.status = 'done';
      videoFileInfo.uid = videoFileInfo.fileId;

      attachFileInfo.name = attachFileInfo.fileName;
      attachFileInfo.url = `/api${attachFileInfo.url}/${attachFileInfo.fileName}`;
      attachFileInfo.status = 'done';
      attachFileInfo.uid = attachFileInfo.fileId

      yield put({
        type: 'save',
        payload: {
          periodDetail: data,
        },
      });
    },
    *periodDelete({ payload }, { call, put, select }) {
      yield call(service.periodDelete, payload);
      const courseDetail = yield select(state => state.courseDetail.courseDetail);
      const { data } = yield call(service.courseDetail, { courseId: courseDetail.courseId });
      const treeData = data.chapterVOList;
      for (let i in treeData) {
        if (!treeData[i].periodVOList) {
          treeData[i].periodVOList = [];
        }
      }
      yield put({
        type: 'save',
        payload: {
          courseDetail: data,
          treeData,
          editPeriod: false,
          deleteVisible:false
        },
      });
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    }
  },
};
