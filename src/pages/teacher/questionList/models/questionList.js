import * as service from '../services/questionList';
import { message, Select } from 'antd';
import { cloneDeep } from 'lodash';

export default {
  namespace: 'questionList',
  state: {
    typeList: [],
    questionList: [],
    total: 10,
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
        console.log(cloneQuestionList);
        yield put({
          type: 'save',
          payload: {
            questionList: cloneQuestionList,
          },
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
