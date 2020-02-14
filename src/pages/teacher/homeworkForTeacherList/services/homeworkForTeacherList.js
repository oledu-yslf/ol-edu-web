import request from '@/utils/request';
import getUserId from '@/utils/getUserId';

export async function getHomeworkForTeacher(params) {
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

export async function getPaperForTeacher(params) {
  return request({
    url: '/api/exam/paperPlanDetail/getPaperForTeacher',
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
