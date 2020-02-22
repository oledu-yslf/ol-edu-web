import request from '@/utils/request';

export async function paperListPage(params) {
  return request({
    url: '/api/exam/paper/listPage',
    method: 'post',
    data: params,
  });
}

export async function paperDelete(params) {
  return request({
    url: '/api/exam/paper/delete',
    method: 'post',
    data: params,
  });
}

export async function paperSave(params) {
  return request({
    url: '/api/exam/paper/save',
    method: 'post',
    data: params,
  });
}

export async function listAllExamCategory (data) {
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
