import request from '@/utils/request';

export async function listPage(params) {
  return request({
    url: '/api/exam/paperPlanDetail/getAvgDetailForTeacher',
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
        staffId: '',
      },
      params,
    ),
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
        staffType: '2',
        state: '1',
      },
      params,
    ),
  });
}
