import * as service from '../services/paperZone';
export default {
  namespace: 'paperZone',
  state: {
    result: {},
    paperPlanZoneVOList:[],
  },
  subscriptions: {

  },
  effects: {
    *getZone({ payload }, { call, put }) {
      const [resp] = yield [call(service.getZone,payload)]
      yield put({
        type: 'save',
        payload: {
          result:resp.data,
          paperPlanZoneVOList: resp.data.paperPlanZoneVOList,
        },
      });
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
