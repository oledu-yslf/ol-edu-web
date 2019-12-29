import request from '@/utils/request';

export async function examDetail (data) {
  return request({
    url:  '/api/exam/detail',
    method: 'post',
    data,
  })
}

export async function listAll (data) {
  return request({
    url:  '/api/exam/category/listAll',
    method: 'post',
    data,
  })
}

