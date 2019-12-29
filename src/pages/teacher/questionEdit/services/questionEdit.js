import request from '@/utils/request';

export async function examDetail (data) {
  return request({
    url:  '/api/exam/detail',
    method: 'post',
    data,
  })
}

