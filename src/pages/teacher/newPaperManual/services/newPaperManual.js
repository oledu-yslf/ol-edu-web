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
export async function saveExam(data) {
  return request({
    url: '/api/exam/paperExam/save',
    method: 'POST',
    data:data
  })
}

export async function queryDetail(data) {
  return request({
    url: '/api/exam/paper/detailPaper',
    method: 'POST',
    data:data
  })
}
