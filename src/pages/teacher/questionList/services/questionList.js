import request from '@/utils/request';

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
    data:Object.assign({
      categoryId:'',
      examType:'',
      difficultyLevel:'',
      examName:'',
      page:{
        pageNum:1,
        pageSize:10
      }
    },data)
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