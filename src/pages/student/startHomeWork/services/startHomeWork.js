import request from '@/utils/request';
import getUserId from '@/utils/getUserId';

export async function studentPaperDetailForSdt (params) {
  return request({
    url:  '/api/exam/paper/studentPaperDetailForSdt',
    method: 'post',
    data: params,
  })
}

export async function commit (params) {
  return request({
    url:  '/api/exam/paperExamResultDetail/commit',
    method: 'post',
    data: Object.assign({
      createStaffId:getUserId(),
      planDetailId:'',
      paperId:'',
      paperExamId:'',
      examId:'',
      result:'',
      sureCommit:0
    },params),
  })
}
