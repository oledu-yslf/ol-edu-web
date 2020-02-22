import request from '@/utils/request';

export async function listAll (data) {
  return request({
    url:  '/api/exam/category/listAll',
    method: 'post',
    data,
  })
}

export async function paperExamRand (data) {
  return request({
    url:  '/api/exam/paperExam/rand',
    method: 'post',
    data,
  })
}
