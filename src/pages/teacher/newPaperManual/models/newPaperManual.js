import * as service from '../services/newPaperManual';
import { message } from 'antd';
import router from 'umi/router'
export default {
  namespace: 'newPaperManual',
  state: {
    typeList:[],
    paperId:''
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/teacher/newPaperManual') {
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
    *saveExam({payload},{call,put}){
      const data = yield call(service.saveExam, payload);
      if (data.successed) {
        message.success('试卷保存成功');
        yield put({
          type:'save',
          payload: {
            addExamVisible: false
          }
        })
        router.push(`/teacher/paperList`)

      }
    },
    *queryDetail({payload},{call,put}){
      debugger
      const data = yield call(service.queryDetail, payload);
      console.log("queryDetail",data)
      if(data.successed){
        yield put({
          type:'save',
          payload: {
            paperDetail: data.data
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
