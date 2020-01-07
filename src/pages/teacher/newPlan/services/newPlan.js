import request from '@/utils/request';

export async function departListAll(params) {
  return request({
    url: '/api/sys/depart/listAll',
    method: 'post',
    data: params,
  });
}

export async function listPage(params) {
  return request({
    url: '/api/exam/paper/listPage',
    method: 'post',
    data: Object.assign(
      {
        page: {
          pageNum: 1,
          pageSize: 10,
        },
        paperName: '',
        paperType: '',
        createStaffId: '',
      },
      params,
    ),
  });
}

export async function detailPaper(params) {
  return request({
    url: '/api/exam/paper/detailPaper',
    method: 'post',
    data: params,
  });
}

export async function paperPlanSave(params) {
  return request({
    url: '/api/exam/paperPlan/save',
    method: 'post',
    data: params,
  });
}

export async function staffList(params) {
  return request({
    url: '/api/sys/staff/list',
    method: 'post',
    data: Object.assign(
      {
        page: {
          pageNum: 1,
          pageSize: 15,
        },
        staffId: '',
        departId: '',
        staffNo: '',
        staffName: '',
        sex: '',
        staffType: '1',
        state: '1',
      },
      params,
    ),
  });
}
