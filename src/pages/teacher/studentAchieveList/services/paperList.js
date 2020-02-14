import request from '@/utils/request';
import getUserId from '@/utils/getUserId';

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
        paperId: '',
        planId:'',
        departId:'',
        staffId:getUserId()
      },
      params,
    ),
  });
}

export async function avgDetailExport(params) {
  return request({
    url: '/api/exam/paperPlanDetail/avgDetailExport',
    method: 'post',
    data: params,
  });
}
