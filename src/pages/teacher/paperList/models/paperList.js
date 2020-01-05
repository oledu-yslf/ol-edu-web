import * as service from '../services/paperList';
import { message } from 'antd';
import { cloneDeep } from 'lodash';
import router from 'umi/router'
export default {
  namespace: 'paperList',
  state: {
    paperList: [],
    total: 10,
    newPaperVisible:false
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/teacher/paperList') {
          dispatch({
            type: 'init',
          });
        }
      });
    },
  },
  effects: {
    *init({ payload }, { call, put }) {
      const [paperRes] = yield [call(service.listPage)];
      const { count, result } = paperRes.data;
      yield put({
        type: 'save',
        payload: {
          paperList: result,
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
          paperList: result,
          total: count,
        },
      });
    },
    *paperDelete({ payload }, { call, put, select }) {
      const { data } = yield call(service.paperDelete, payload);

      if (data === 1) {
        message.success('删除成功');
        const paperList = yield select(state => state.paperList.paperList);
        let clonePaperList = cloneDeep(paperList);
        let index;
        for (let i = 0; i < clonePaperList.length; i++) {
          if (clonePaperList[i].paperId === payload.paperId) {
            index = i;
            break;
          }
        }
        clonePaperList.splice(index, 1);
        yield put({
          type: 'save',
          payload: {
            paperList: clonePaperList,
          },
        });
      }
    },
    *paperSave({ payload }, { call, put, select }){
      const { code,data } = yield call(service.paperSave, payload);
      if(code === 200 ){
        if(payload.genType === 0){
          message.success('新增试卷成功').then(()=>{
            router.push(`/teacher/newPaperManual?paperId=${data}`)
          })
        }else{
          message.success('新增试卷成功').then(()=>{
            router.push(`/teacher/newPaperAuto?paperId=${data}`)
          })
        }
      }
    }
  },
  reducers: {
    save(state, action) {
      console.log(action);
      return { ...state, ...action.payload };
    },
  },
};
