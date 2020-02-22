import * as service from '../services/paperList';
import { message } from 'antd';
import { cloneDeep } from 'lodash';
import router from 'umi/router'
export default {
  namespace: 'teacherPaperList',
  state: {
    paperList: [],
    total: 10,
    newPaperVisible:false,
    pageSize:10,
    pageNum : 1,
    newPaperStep:1,
    categoryTree:[],    //试题分类试卷列表
    paperId:'',   //新增的试卷ID
  },
  subscriptions: {

  },
  effects: {
    *paperListPage({ payload }, { call, put }) {
      const [paperRes] = yield [call(service.paperListPage,payload)];
      const { pageNum,pageSize,count, result } = paperRes.data;

      yield put({
        type: 'save',
        payload: {
          paperList: result,
          total: count,
          pageNum,
          pageSize
        },
      });
    },

    *paperDelete({ payload }, { call, put, select }) {
      const { data } = yield call(service.paperDelete, payload);

      if (data === 1) {
        message.success('删除成功');
      }
    },
    *paperSave({ payload }, { call, put, select }){
      //保存前，先清空原来的paperId，
      yield put({
        type: 'save',
        payload: {
          paperId:''
        },
      });

      const { code,data } = yield call(service.paperSave, payload);
      if(code === 200 ){
        yield put({
          type: 'save',
          payload: {
            paperName:payload.paperName,
            paperId:data
          },
        });
        message.success('新增试卷成功');

        if(payload.genType === 0){
          yield put({
            type: 'save',
            payload: {
              newPaperVisible:false,
              newPaperStep:1
            },
          });

          router.push(`/teacher/newPaperManual?paperId=${data}`)

        }else{

          yield put({
            type: 'save',
            payload: {
              newPaperStep:2
            },
          });
        }
      }
    },

    *listAllExamCategory({ payload }, { call, put }) {
      const {data} = yield call(service.listAllExamCategory);
      yield put({
        type: 'save',
        payload: {
          categoryTree: data,
        },
      });
    },

    *paperExamRand({ payload }, { call, put }){
      console.log(payload);
      const { code } = yield call(service.paperExamRand,payload);
      if(code === 200){
        message.success('随机试题生成成功')
        router.push(`/teacher/newPaperManual?paperId=${payload.paperId}`)
        yield put({
          type: 'save',
          payload: {
            newPaperVisible:false,
            newPaperStep:1
          },
        });
      }
    }

  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
