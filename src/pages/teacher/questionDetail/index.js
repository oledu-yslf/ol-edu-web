import React from 'react';
import {Descriptions, Spin} from 'antd';
import {connect} from 'dva';
import styles from './index.less';
class QuestionDetail extends React.Component {
  render() {
    const {examDetail, loading} = this.props;
    const {
      categoryId,
      categoryName,
      examName,
      difficultyLevel,
      examType,
      mark,
      result,
      baseExamAttrVOList,
      examSolution,
    } = examDetail;
    return (
      <div className={styles.box}>
        <Spin spinning={loading}>
          <Descriptions title="试题信息" bordered={true}  column={1} style={{marginTop: '20px'}}>
            <Descriptions.Item span={1} label="试题分类">
              {categoryName || '-'}
            </Descriptions.Item>

            <Descriptions.Item span={2} label="试题名称">
              <div dangerouslySetInnerHTML={{__html: examName}}/>
            </Descriptions.Item>
            <Descriptions.Item label="试题难度" span={1}>
              {difficultyLevel === 0
                ? '易'
                : difficultyLevel === 1
                ? '较易'
                : difficultyLevel === 2
                ? '中等'
                : difficultyLevel === 3
                ? '偏难'
                : '难'}
            </Descriptions.Item>
            <Descriptions.Item label="试题类型" span={1}>
              {examType === 1
                ? '单选题'
                : examType === 2
                ? '多选题'
                : examType === 3
                ? '判断题'
                : examType === 4
                ? '问答题'
                : '填空题'}
            </Descriptions.Item>
            <Descriptions.Item label="分数" span={1}>
              {mark}
            </Descriptions.Item>
            {baseExamAttrVOList
              ? baseExamAttrVOList.map(item => {
              return (
                <Descriptions.Item span={2} label={item.sort} key={item.examAttrId} >
                  <div  dangerouslySetInnerHTML={{__html: item.attrName}}/>
                </Descriptions.Item>
              );
            })
              : ''}

            <Descriptions.Item label="正确答案"><div  dangerouslySetInnerHTML={{__html: result}}/></Descriptions.Item>
            <Descriptions.Item label="试题讲解"><div  dangerouslySetInnerHTML={{__html: examSolution}}/></Descriptions.Item>
          </Descriptions>
        </Spin>
      </div>
    );
  }
}
export default connect(state => ({
  ...state.questionDetail,
  loading: state.loading.models.questionDetail,
}))(QuestionDetail);
