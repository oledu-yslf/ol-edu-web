import request from '@/utils/request';
import getUserId from '@/utils/getUserId';

export async function getExamListForStudent(params) {
  return request({
    url: '/api/exam/paperPlanDetail/getResultForStudent',
    method: 'post',
    data: Object.assign(
      {
        page: {
          pageNum: 1,
          pageSize: 10,
        },
        staffId: getUserId()
      },
      params,
    ),
  });
}
