import request from '@/utils/request';

export async function detailPaper (params) {
  return request({
    url:  '/api/exam/paper/detailPaper',
    method: 'post',
    data: params,
  })
}
