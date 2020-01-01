import request from '@/utils/request';

export async function listPage(params) {
  return request({
    url: '/api/exam/paper/listPage',
    method: 'post',
    data: Object.assign({
      page: {
        pageNum: 1,
        pageSize: 10,
      },
      paperName: '',
      paperType: '',
      createStaffId: '',
    },params),
  });
}
