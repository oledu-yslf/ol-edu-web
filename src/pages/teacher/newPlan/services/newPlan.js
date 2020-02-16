import request from '@/utils/request';
import getUserId from '@/utils/getUserId';

export async function listPage(params) {
  return request({
    url: '/api/exam/paperPlan/detail',
    method: 'post',
    data: params,
  });
}

export async function getExamList(params) {
  return request({
    url: '/api/exam/paper/listPage',
    method: 'post',
    data:Object.assign(
      {
        page: {
          pageNum: 1,
          pageSize: 10,
        },
        createStaffId: getUserId()
      },
      params
    )
  });
}

export async function departListAll (params) {
  return request({
    url:  '/api/sys/depart/listAll',
    method: 'post',
    data: params,
  })
}
