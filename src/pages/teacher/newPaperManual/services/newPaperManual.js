import request from '@/utils/request';

export async function listAllExamCategory (data) {
  return request({
    url:  '/api/exam/category/listAll',
    method: 'post',
    data,
  })
}

export async function listPageExam (data) {
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

export async function paperExamSave(data) {
  return request({
    url: '/api/exam/paperExam/save',
    method: 'POST',
    data:data
  })
}

export async function paperExamDetail(data) {
  return request({
    url: '/api/exam/paper/detailPaper',
    method: 'POST',
    data:data
  })
}
