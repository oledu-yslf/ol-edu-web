
export default {
  namespace: 'global',
  state: {
    selectedMenu:[]
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/') {
          
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
