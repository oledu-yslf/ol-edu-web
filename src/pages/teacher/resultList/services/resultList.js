import request from '@/utils/request';

export async function departListAll(params) {
  return request({
    url: '/api/sys/depart/listAll',
    method: 'post',
    data: params,
  });
}

export async function planListPage(data) {
  return request({
    url: '/api/exam/paperPlan/listPage',
    method: 'post',
    data: Object.assign(
      {
        planName: '',
        page: {
          pageNum: 1,
          pageSize: 10,
        },
      },
      data,
    ),
  });
}

export async function paperListPage(params) {
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

export async function listPage(params) {
  return request({
    url: '/api/exam/paperresultsum/listPage',
    method: 'post',
    data: Object.assign(
      {
        page: {
          pageNum: 1,
          pageSize: 10,
        },
        planId: '',
        paperId: '',
        departId:'',
        orderBy: "",
      },
      params,
    ),
  });
}

export async function resultlistPage(params) {
  return request({
    url: '/api/exam/paper/listPage',
    method: 'post',
    data: Object.assign(
      {
        page: {
          pageNum: 1,
          pageSize: 10,
        },
        planId: '',
        paperId: '',
        departId: '',
        staffId:'',
      },
      params,
    ),
  });
}



