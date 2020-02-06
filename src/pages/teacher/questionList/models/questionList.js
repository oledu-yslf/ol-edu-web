import * as service from '../services/questionList';
import { message } from 'antd';
import { cloneDeep } from 'lodash';

export default {
  namespace: 'questionList',
  state: {
    typeList: [],
    questionList: [],
    total: 10,
    plusTypeVisible:false,
    editTypeVisible:false
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/teacher/questionList') {
          dispatch({
            type: 'init',
          });
        }
      });
    },
  },
  effects: {
    *init({ payload }, { call, put }) {
      const [typeListRes, questionRes] = yield [call(service.listAll), call(service.listPage)];
      const { count, result } = questionRes.data;
      yield put({
        type: 'save',
        payload: {
          typeList: typeListRes.data,
          questionList: result,
          total: count,
        },
      });
    },
    *listAll({ payload }, { call, put }) {
      const { data } = yield call(service.listAll, payload);
      // const { count, result } = data;
      yield put({
        type: 'save',
        payload: {
          typeList: data
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
    *examDelete({ payload }, { call, put, select }) {
      const { data } = yield call(service.examDelete, payload);

      if (data === 1) {
        message.success('删除成功');
        const questionList = yield select(state => state.questionList.questionList);
        let cloneQuestionList = cloneDeep(questionList);
        let index;
        for (let i = 0; i < cloneQuestionList.length; i++) {
          if (cloneQuestionList[i].examId === payload.examId) {
            index = i;
            break;
          }
        }
        cloneQuestionList.splice(index, 1);
        yield put({
          type: 'save',
          payload: {
            questionList: cloneQuestionList,
          },
        });
      }
    },
    *categorySave({ payload }, { call, put, select }){
      const { code } = yield call(service.categorySave, payload);
      if(code === 200){
        message.success('新增分类成功');
        yield put({
          type:'listAll'
        })
        yield put({
          type:'save',
          payload:{
            plusTypeVisible:false
          }
        })
      }
    },
    *categoryUpdate({ payload }, { call, put, select }){
      const { code } = yield call(service.categoryUpdate, payload);
      if(code === 200){
        message.success('更新分类成功');
        yield put({
          type:'listAll'
        })
        yield put({
          type:'save',
          payload:{
            editTypeVisible:false
          }
        })
      }

    },
    *categoryDelete({ payload }, { call, put, select }){
      const { code } = yield call(service.categoryDelete, {categoryId:payload.categoryId});
      if(code === 200){
        message.success('删除分类成功');
        yield put({
          type:'listAll'
        })
      }
    },
    *importExam({ payload }, { call, put }){
      const { code } = yield call(service.importExam(), {categoryId:payload.categoryId});
      if(code === 200){
        message.success('导入试题成功');
        yield put({
          type:'listAll'
        })
      }
    },
    *saveExam({payload},{call,put}){
      const data = yield call(service.saveExam, payload);
      if (data.successed) {
        message.success('试题保存成功');
        yield put({
          type:'save',
        })
      }
    },
    *examDetail({payload},{call,put}){
      const data = yield call(service.examDetail, payload);
      if (data.successed) {
        yield put({
          type:'save',
          payload: {
            examDetail:data.data ,
            editTypeVisible:false

          },
        })
      }
    },
    *updateExam({payload},{call,put}){
      const data = yield call(service.updateExam, payload);
      if (data.successed) {
        message.success('试题更新成功');
        yield put({
          type:'save',
        })
      }
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
