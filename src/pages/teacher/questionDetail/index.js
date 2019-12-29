import React from 'react';

import { connect } from 'dva';
import styles from './index.less';
class QuestionDetail extends React.Component {
  render() {
    const { detail } = this.props;
    return (
      <div className={styles.box}>
        
      </div>
    );
  }
}
export default connect(state => ({
    ...state.questionList,
    loading: state.loading.models.questionList,
  }))(QuestionDetail);
