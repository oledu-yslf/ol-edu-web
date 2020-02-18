import request from '@/utils/request';
import qs from 'qs'

export async function listAll (data) {
  return request({
    url:  '/api/exam/category/listAll',
    method: 'post',
    data,
  })
}

export async function listPage (data) {
  return request({
    url:  '/api/exam/listPage',
    method: 'post',
    data,
  })
}

export async function examDelete (data) {
  return request({
    url:  '/api/exam/delete',
    method: 'post',
    data
  })
}

export async function categorySave (data) {
  return request({
    url:  '/api/exam/category/save',
    method: 'post',
    data
  })
}

export async function categoryUpdate (data) {
  return request({
    url:  '/api/exam/category/update',
    method: 'post',
    data
  })
}

export async function categoryDelete (data) {
  return request({
    url:  '/api/exam/category/delete',
    method: 'post',
    data
  })
}

export async function importExam(param) {

  return request({
    url:  '/api/exam/import',
    headers: {
      'Content-Type': "multipart/form-data",
    },
    method: 'POST',
    data:param
  })
}

export async function saveExam(data) {

  return  request({
    url: '/api/exam/save',
    method:'POST',
    data
  })
}

export async function examDetail(data) {
  return request({
    url: '/api/exam/detail',
    method: 'POST',
    data
  })
}

export async function updateExam(data) {
  return request({
    url: '/api/exam/update',
    method: 'POST',
    data
  })
}
