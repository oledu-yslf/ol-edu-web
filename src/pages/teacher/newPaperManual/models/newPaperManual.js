import * as service from '../services/newPaperManual';
import { message } from 'antd';
import router from 'umi/router'
export default {
  namespace: 'newPaperManual',
  state: {
    paperDetail:{},
    paperExamSummery:[],    //paperDetail.mapPaperExamSummary转为为数组，后续就用这个数组去渲染。


    ////////////////////////
    categoryTree:[],    //试题分类试卷列表
    examList:[],
    total:0,
    pageNum:1,
    pageSize:10,
    examListVisible:false,

    ////////////////////
  },
  subscriptions: {

  },
  effects: {
    *listPageExam({ payload }, { call, put }) {
      const { data } = yield call(service.listPageExam, payload);
      const { count, pageNum,pageSize,result  } = data;
      yield put({
        type: 'save',
        payload: {
          examList: result,
          total: count,
          pageNum,
          pageSize,
        },
      });
    },
    *paperExamSave({payload},{call,put}){
      const data = yield call(service.paperExamSave, payload);
      if (data.successed) {
        message.success('试卷保存成功',3);
        router.push(`/teacher/paperList`)
      }
    },

    *initExamModal({ payload }, { call, put }) {
      const [resExamCategory,resExam] = yield [call(service.listAllExamCategory),call(service.listPageExam,payload)]

      const { count, pageNum,pageSize,result } = resExam.data;
      yield put({
        type: 'save',
        payload: {
          categoryTree: resExamCategory.data,
          examList: result,
          total: count,
          pageNum,
          pageSize,
        },
      });
    },

    *paperExamDetail({payload},{call,put}){
      const data = yield call(service.paperExamDetail, payload);

      const paperDetail = data.data;

      const {mapPaperExamSummary} = paperDetail;

      let paperExamSummery = [];
      for (let i in mapPaperExamSummary) {
        paperExamSummery[i] = mapPaperExamSummary[i];
      }

      if(data.successed){
        yield put({
          type:'save',
          payload: {
            paperDetail,
            paperExamSummery
          }
        })
      }
    }

  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
