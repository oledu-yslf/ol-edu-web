import * as service from '../services/newPaperAuto';
import { message } from 'antd';
export default {
  namespace: 'newPaperAuto',
  state: {
    typeList:[],
    paperId:''
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/teacher/newPaperAuto') {
          dispatch({
            type: 'listAll',
          });
        }
        dispatch({
          type:'save',
          payload:{
            paperId:query.paperId
          }
        })
      });
    },
  },
  effects: {
    *listAll({ payload }, { call, put }) {
      const { data } = yield call(service.listAll);
      yield put({
        type: 'save',
        payload: {
          typeList: data,
        },
      });
    },
    *paperExamRand({ payload }, { call, put }){
      console.log(payload);
      const { code } = yield call(service.paperExamRand,payload);
      if(code === 200){
        message.success('随机试题生成成功')
      }
    }
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
