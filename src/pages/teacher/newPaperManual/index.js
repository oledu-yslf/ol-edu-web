import React from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Form, Icon, Button, Divider, List } from 'antd';
import QuestionListModal from './components/QuestionListModal';

class NewPaperManual extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalScore: 0,
    };
  }
  questionListModal = e => {
    // this.setState({
    //   questionListModalVisbile:true
    // })
    const { dispatch } = this.props;
    dispatch({
      type: 'newPaperManual/save',
      payload: {
        questionListModalVisbile: true,
      },
    });
  };
  render() {
    const { selectedExams, paperDetail, questionListModalVisbile } = this.props;
    console.log(selectedExams);
    // const { getFieldDecorator, getFieldValue } = form;
    const { totalScore } = this.state;

    return (
      <div className={styles.box}>
        <div className="clearfix" style={{ textAlign: 'center' }}>
          <div className="pullleft" style={{ fontSize: '24px', lineHeight: '80px' }}>
            {/* <Button>选择试题</Button> */}
            <Button type="dashed" onClick={this.questionListModal}>
              <Icon type="plus" /> 增加试题
            </Button>
          </div>
          <span style={{ fontSize: '24px', lineHeight: '80px' }}>{paperDetail.paperName}</span>
          <div className="pullright" style={{ fontSize: '24px', lineHeight: '80px' }}>
            <span>总分：{totalScore}</span>
          </div>
        </div>
        <Divider />
        <List
          bordered
          dataSource={selectedExams}
          itemLayout="vertical"
          renderItem={(item, index) => {
            return (
              <List.Item key={item.examId}>
                <List.Item.Meta
                  title={
                    <div className="clearfix">
                      <div className="pullleft">{index + 1}.</div>
                      <div
                        className="pullleft"
                        dangerouslySetInnerHTML={{ __html: item.examName }}
                      />
                    </div>
                  }
                />
                <Divider />
                <div className="clearfix">
                  <div className="pullleft">答案：</div>
                  <div className="pullleft" dangerouslySetInnerHTML={{ __html: item.result }} />
                </div>
                <div className="clearfix">
                  <div className="pullleft">分数：{item.mark}</div>
                </div>
              </List.Item>
            );
          }}
        />
        <QuestionListModal questionListModalVisbile={questionListModalVisbile} />
      </div>
    );
  }
}
const NewPaperManualForm = Form.create({ name: 'newPaperManualForm' })(NewPaperManual);

export default connect(state => ({
  ...state.newPaperManual,
  loading: state.loading.models.newPaperManual,
}))(NewPaperManualForm);
