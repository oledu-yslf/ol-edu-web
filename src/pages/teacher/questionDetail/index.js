import React from 'react';
import { Descriptions } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
class QuestionDetail extends React.Component {
  render() {
    const { examDetail } = this.props;
    console.log(examDetail);
    const {
      categoryId,
      examName,
      difficultyLevel,
      examType,
      mark,
      result,
      baseExamAttrVOList,
    } = examDetail;
    return (
      <div className={styles.box}>
        <Descriptions title="试题信息" bordered={true} column={3} style={{ marginTop: '20px' }}>
          <Descriptions.Item span={3} label="试题分类">
            {categoryId || '-'}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="试题名称">
            <div dangerouslySetInnerHTML={{ __html: examName }} />
          </Descriptions.Item>
          <Descriptions.Item label="试题难度">
            {difficultyLevel === '0'
              ? '易'
              : difficultyLevel === '1'
              ? '较易'
              : difficultyLevel === '2'
              ? '中等'
              : difficultyLevel === '3'
              ? '偏难'
              : '难'}
          </Descriptions.Item>
          <Descriptions.Item label="试题类型">
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
          <Descriptions.Item label="分数">{mark}</Descriptions.Item>
          {baseExamAttrVOList
            ? baseExamAttrVOList.map(item => {
                return (
                  <Descriptions.Item span={3} label={item.sort} key={item.examAttrId}>
                    <div dangerouslySetInnerHTML={{ __html: item.attrName }} />
                  </Descriptions.Item>
                );
              })
            : ''}

          <Descriptions.Item label="正确答案">{result}</Descriptions.Item>
        </Descriptions>
      </div>
    );
  }
}
export default connect(state => ({
  ...state.questionDetail,
  loading: state.loading.models.questionDetail,
}))(QuestionDetail);
