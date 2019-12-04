export default {
  namespace: 'global',
  state: {
    selectedMenu:['/']
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
