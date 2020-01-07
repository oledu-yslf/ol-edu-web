import request from '@/utils/request';
import getUserId from '@/utils/getUserId';

export async function listPage(params) {
  return request({
    url: '/api/exam/paperPlanDetail/getHomeworkForTeacher',
    method: 'post',
    data: Object.assign(
      {
        page: {
          pageNum: 1,
          pageSize: 10,
        },
        paperName: '',
        planName:'',
        state:'',
        reviewStaffId:getUserId()
      },
      params,
    ),
  });
}
