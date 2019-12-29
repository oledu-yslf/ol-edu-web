import React from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
class QuestionEdit extends React.Component {
  render() {
    const { examDetail } = this.props;
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
        
      </div>
    );
  }
}
export default connect(state => ({
  ...state.questionEdit,
  loading: state.loading.models.questionEdit,
}))(QuestionEdit);
