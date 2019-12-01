import * as service from '../services/teacher';
export default {
  namespace: 'teacher',
  state: {
    treeData: [],
    list: [],
    total: 0,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/teacher/courseManage') {
          
        }
      });
    },
  },
  effects: {
    
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
