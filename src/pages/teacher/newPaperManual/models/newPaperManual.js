import * as service from '../services/newPaperManual';
import router from 'umi/router';
import { message } from 'antd';
export default {
  namespace: 'newPaperManual',
  state: {
    selectedExams: [],
    paperDetail: {},
    paperList: [],
    total: 10,
    questionListModalVisbile: false,
    paperId: '',
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/teacher/newPaperManual') {
          dispatch({
            type: 'init',
            payload: {
              paperId: query.paperId,
            },
          });
          dispatch({
            type: 'save',
            payload: {
              paperId: query.paperId,
            },
          });
        }
      });
    },
  },
  effects: {
    *init({ payload }, { call, put }) {
      const [paperDetailRes, listAllRes, listPageRes] = yield [
        call(service.detailPaper, payload),
        call(service.listAll),
        call(service.listPage),
      ];
      const selectedExams = [];
      const { mapPaperExamSummary } = paperDetailRes.data;
      if (mapPaperExamSummary) {
        for (let i in mapPaperExamSummary) {
          // selectedExams.push(mapPaperExamSummary[i]);/
          if (
            mapPaperExamSummary[i] &&
            mapPaperExamSummary[i].paperExamVOList &&
            mapPaperExamSummary[i].paperExamVOList.length > 0
          ) {
            for (let j in mapPaperExamSummary[i].paperExamVOList) {
              let obj = mapPaperExamSummary[i].paperExamVOList[j];
              obj.baseExamAttrVOList = obj.paperExamAttrVOS;
              selectedExams.push(obj);
            }
          }
        }
      }

      yield put({
        type: 'save',
        payload: {
          paperDetail: paperDetailRes.data,
          typeList: listAllRes.data,
          questionList: listPageRes.data.result,
          total: listPageRes.data.count,
          selectedExams,
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
    *paperExamSave({ payload }, { call, put }) {
      const { code } = yield call(service.paperExamSave, payload);
      if (code === 200) {
        message.success('手动创建试卷成功').then(() => {
          router.push('/teacher/paperList');
        });
      }
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
