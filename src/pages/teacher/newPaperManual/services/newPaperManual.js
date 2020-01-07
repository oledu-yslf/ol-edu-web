import request from '@/utils/request';

export async function detailPaper(params) {
  return request({
    url: '/api/exam/paper/detailPaper',
    method: 'post',
    data: params,
  });
}

export async function listAll(data) {
  return request({
    url: '/api/exam/category/listAll',
    method: 'post',
    data,
  });
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

export async function paperExamSave(data) {
  return request({
    url: '/api/exam/paperExam/save',
    method: 'post',
    data,
  });
}

