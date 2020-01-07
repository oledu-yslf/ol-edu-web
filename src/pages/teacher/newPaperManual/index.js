import React from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Form, Icon, Button, Divider, List, Input } from 'antd';
import QuestionListModal from './components/QuestionListModal';
import { cloneDeep } from 'lodash';
import getUserId from '@/utils/getUserId';

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
  preExamSort = (item, index) => {
    const { dispatch, selectedExams } = this.props;
    const perItem = selectedExams[index - 1];
    const cloneSelectedExams = cloneDeep(selectedExams);
    cloneSelectedExams[index] = perItem;
    cloneSelectedExams[index - 1] = item;
    dispatch({
      type: 'newPaperManual/save',
      payload: {
        selectedExams: cloneSelectedExams,
      },
    });
  };
  nextExamSort = (item, index) => {
    const { dispatch, selectedExams } = this.props;
    const nextItem = selectedExams[index + 1];
    const cloneSelectedExams = cloneDeep(selectedExams);
    cloneSelectedExams[index] = nextItem;
    cloneSelectedExams[index + 1] = item;
    dispatch({
      type: 'newPaperManual/save',
      payload: {
        selectedExams: cloneSelectedExams,
      },
    });
  };
  removeExam = (item, index) => {
    const { dispatch, selectedExams } = this.props;
    const cloneSelectedExams = cloneDeep(selectedExams);
    cloneSelectedExams.splice(index, 1);
    dispatch({
      type: 'newPaperManual/save',
      payload: {
        selectedExams: cloneSelectedExams,
      },
    });
  };
  totalScoreCompute = e => {
    const { form } = this.props;
    setTimeout(() => {
      const values = form.getFieldsValue();
      const { mark } = values;
      let totalScore = parseInt(e) || 0;
      for (let i in mark) {
        totalScore += parseInt(mark[i]) || 0;
      }
      console.log(totalScore);
      this.setState({
        totalScore,
      });
    }, 0);
  };
  handleSubmit = e => {
    e.preventDefault();
    const { form, selectedExams, paperId, dispatch } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const { mark, passScore } = values;
        const paperExamItems = [];
        Object.keys(mark).forEach((key, i) => {
          let obj = {};
          obj.sort = i;
          obj.examId = key;
          obj.mark = mark[key];
          paperExamItems.push(obj);
        });
        console.log({
          passScore,
          paperId,
          createStaffId: getUserId(),
          paperExamItems,
        });
        dispatch({
          type:'newPaperManual/paperExamSave',
          payload:{
            passScore,paperId,createStaffId:getUserId(),paperExamItems
          }
        })
      }
    });
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedExams !== this.props.selectedExams && nextProps.selectedExams.length > 0) {
      const selectedExams = nextProps.selectedExams;
      let totalScore = 0;
      for (let i in selectedExams) {
        totalScore += parseInt(selectedExams[i].mark) || 0;
      }
      this.setState({
        totalScore,
      });
    }
  }

  render() {
    const { selectedExams, paperDetail, questionListModalVisbile, form } = this.props;
    const { getFieldDecorator } = form;
    const { totalScore } = this.state;
    const { passScore } = paperDetail;
    let examLength = selectedExams.length;
    let keys = [];
    for (let a = 0; a < examLength; a++) {
      keys.push(a);
    }
    console.log(selectedExams);
    return (
      <div className={styles.box}>
        <Form layout="inline" onSubmit={this.handleSubmit}>
          <div className="clearfix" style={{ textAlign: 'center' }}>
            <div className="pullleft" style={{ fontSize: '24px', lineHeight: '80px' }}>
              <Button type="dashed" onClick={this.questionListModal}>
                <Icon type="plus" /> 增加试题
              </Button>
            </div>
            <span style={{ fontSize: '24px', lineHeight: '80px' }}>{paperDetail.paperName}</span>
            <div className="pullright" style={{ fontSize: '24px', lineHeight: '80px' }}>
              <span>总分：{totalScore}</span>
              <Form.Item label="及格分数:" style={{ marginTop: '23px', marginLeft: '20px' }}>
                {getFieldDecorator('passScore', {
                  initialValue: passScore,
                })(<Input style={{ width: '120px' }} />)}
              </Form.Item>
            </div>
          </div>
          <Divider />

          <List
            bordered
            dataSource={keys}
            itemLayout="vertical"
            renderItem={(i, index) => {
              const item = selectedExams[i];
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
                        <div className="pullright">
                          {index !== 0 && (
                            <Button
                              style={{ marginLeft: '20px' }}
                              onClick={e => this.preExamSort(item, index, e)}
                            >
                              上移
                            </Button>
                          )}
                          {examLength - 1 !== index && (
                            <Button
                              style={{ marginLeft: '20px' }}
                              onClick={e => this.nextExamSort(item, index, e)}
                            >
                              下移
                            </Button>
                          )}
                          <Button
                            style={{ marginLeft: '20px' }}
                            onClick={e => this.removeExam(item, index, e)}
                          >
                            移除
                          </Button>
                        </div>
                      </div>
                    }
                  />
                  {item.examType <= 3 &&
                    item.baseExamAttrVOList.map(v => {
                      return (
                        <div className="clearfix" key={v.examAttrId}>
                          <div className="pullleft">{v.sort}.</div>
                          <div
                            className="pullleft"
                            dangerouslySetInnerHTML={{ __html: v.attrName }}
                          />
                        </div>
                      );
                    })}
                  <Divider />
                  <div className="clearfix">
                    <div className="pullleft">答案：</div>
                    <div className="pullleft" dangerouslySetInnerHTML={{ __html: item.result }} />
                  </div>
                  <div className="clearfix">
                    <div className="pullleft">
                      <Form.Item label="分数:" style={{ marginTop: '23px' }}>
                        {getFieldDecorator(`mark[${item.examId}]`, {
                          initialValue: item.mark,
                        })(
                          <Input
                            style={{ width: '120px' }}
                            onChange={e => this.totalScoreCompute(e)}
                          />,
                        )}
                      </Form.Item>
                    </div>
                  </div>
                </List.Item>
              );
            }}
          />
          <Form.Item style={{ margin: '20px' }}>
            <Button type="primary" htmlType="submit" icon="search">
              提交
            </Button>
          </Form.Item>
        </Form>
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
