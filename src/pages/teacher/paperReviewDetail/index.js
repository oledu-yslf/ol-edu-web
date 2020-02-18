import React from 'react';
import {Button, Col, List, Checkbox, Radio, Row, Form, Input, Modal, Divider} from 'antd';
import {connect} from 'dva';
import styles from '@/style/common.less';
import router from 'umi/router';
import * as Util from '@/utils/util'

const mapExamName = {};
mapExamName[1] = "单选题";
mapExamName[2] = "多选题";
mapExamName[3] = "判断题";
mapExamName[4] = "问答题";
mapExamName[5] = "填空题";


class PaperReviewDetail extends React.Component {
  componentWillMount() {
    const {dispatch} = this.props;
    const {query} = this.props.location;

    dispatch({
      type: 'paperReviewDetail/init',
      payload: {
        ...query
      }
    });
  }

  handleSubmmit = (exam, maxCount, step) => {
    const {dispatch, cursorExamIndex} = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let result = "";

        result = this.props.form.getFieldsValue();
        const {query} = this.props.location;
        const {paperId, paperExamId, examId} = exam;
        const {planDetailId} = this.props.location.query;

        let nextIndex = cursorExamIndex + step;

        if (result === undefined || result === "" || result === null) {
          //未提交，进入下一题
          dispatch({
            type: 'paperReviewDetail/save',
            payload: {
              cursorExamIndex: nextIndex
            }
          })
        } else {
          //进行了答题,需要提交
          let sureCommit = 0; //是否最后一题标志，0否，1是
          if (cursorExamIndex === maxCount && step >= 0) {
            sureCommit = 1;     //最后一题
          }

          const reviewStaffId = Util.getStaffId();

          dispatch({
            type: 'paperReviewDetail/teacherCommitPaper',
            payload: {
              createStaffId: query.staffId,
              planDetailId,
              paperId,
              paperExamId,
              reviewStaffId,//审阅教师ID
              score: result.score,//得分
              isCorrect: result.isCorrect,//是否正确 0-错误，1-正确
              evaluate: result.evaluate,//教师给学生的评价
              examId,
              sureCommit
            }
          }).then(res => {

            if (res.code == 200) {
              //成功，
              if (sureCommit === 1) {
                //提交成功后，需要跳转。
                //router.push('/teacher/homeworkForTeacherList')
                //返回到上一个页面。

                dispatch({
                  type: 'paperReviewDetail/save',
                  payload: {
                    cursorExamIndex: nextIndex,
                    sureCommit:false
                  }
                })
                window.history.go(-1);
                return;
              }

              dispatch({
                type: 'paperReviewDetail/init',
                payload: {
                  ...query
                }
              })

              dispatch({
                type: 'paperReviewDetail/save',
                payload: {
                  cursorExamIndex: nextIndex,
                  sureCommit:false
                }
              })

              //antd中的form表单 initialValue导致数据不更新问题
              //https://blog.csdn.net/weixin_34087301/article/details/93900887
              this.props.form.resetFields();
            }
          });

        }

      }
    })
  }

  examRender = (item) => {
    return (
      <List.Item style={{width: '100%'}}>
        <Row gutter={24} style={{width: '100%'}}>
          <Col span={24}>
            <div>
              <div>{item.index}. {mapExamName[item.examType]} [{item.mark}分]</div>
              <div dangerouslySetInnerHTML={{__html: item.examName}}></div>
              {this.examAttrRender(item)}
              <Divider/>
              {this.renderResultScore(item)}
            </div>
          </Col>
        </Row>
      </List.Item>
    )
  }

  examAttrRender = (exam) => {
    const {form} = this.props;
    const {getFieldDecorator} = form;

    if (exam.examType === 1 || exam.examType === 2 || exam.examType === 3) {
      //选择题
      return (
        <div>
          <Row style={{width: '100%'}}>
            {exam.paperExamAttrVOS.map(temp => (
              <Col span={24} key={temp.paperExamAttrId}>
                <div style={{lineHeight: '32px'}}>
                  <label id={temp.paperExamAttrId} value={temp.sort}>{temp.sort}.</label>
                  <span display="inline-block" style={{width: '98%', float: 'right'}}
                        dangerouslySetInnerHTML={{__html: temp.attrName}}></span>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      )
    }
  }

  renderResultScore = (exam) => {
    const {form} = this.props;
    const {getFieldDecorator} = form;

    return <div>
      <Row>
        <div className={this.initStudentClassRed(exam)} style={{width: '100%'}}>
          <div className="pullleft">学生答案：</div>
          <div className="pullleft" dangerouslySetInnerHTML={{__html: exam.studentExamResult.result}}/>
        </div>
      </Row>
      <Row>
        <div className="clearfix">
          <div className="pullleft">正确答案：</div>
          <div className="pullleft" dangerouslySetInnerHTML={{__html: exam.result}}/>
        </div>
      </Row>

      <Form.Item>
        {getFieldDecorator('isCorrect', {initialValue: this.initFieldisCorrect(exam)})(
          <Radio.Group style={{width: '100%'}}>
            <Radio value={'1'}>对 </Radio>
            <Radio value={'0'}>错 </Radio>
          </Radio.Group>)
        }
      </Form.Item>
      <Form.Item label='得分'>
        {getFieldDecorator('score', {
          initialValue: this.initFieldScore(exam),
          rules: [
            {required: true, message: '请输入成绩!'},
            {pattern: new RegExp("^[0-9]*$"), message: '请输入数字!'},
            {
              validator: ((rule, value, callback) => {
                if (value > exam.mark) {
                  callback('得分不能大于分数值!');
                } else {
                  callback();
                }
              })
            }
          ]
        })(
          <Input style={{width: '30%'}}/>
        )
        }
      </Form.Item>
    </div>
  }

  initStudentClassRed = (exam) => {
    if (exam.studentExamResult != null && exam.studentExamResult.isCorrect != null) {
      //优先设置回显的值
      if (exam.studentExamResult.isCorrect == 1) {
        return styles.black;
      } else {
        return styles.red;
      }
    }

    if (this.isCollect(exam) == true) {
      //程序自动做预判断
      return styles.black;
    } else {
      return styles.red;
    }
  }

  initFieldisCorrect = (exam) => {
    if (exam.studentExamResult != null && exam.studentExamResult.isCorrect != null) {
      if (exam.studentExamResult.isCorrect == 1) {
        return '1';
      } else {
        return '0';
      }
    }

    if (this.isCollect(exam) == true) {
      //程序自动做预判断
      return '1';
    } else {
      return '0';
    }
  }

  initFieldScore = (exam) => {
    if (exam.studentExamResult != null && exam.studentExamResult.score != null) {
      return exam.studentExamResult.score;
    }
    if (this.isCollect(exam) == true) {
      //程序自动做预判断
      return exam.mark;
    } else {
      return '';
    }
  }
  isCollect = (exam) => {
    if (exam.result != null) {
      if (exam.studentExamResult === null || exam.studentExamResult.result === null) {
        //学生没有答案
        return false;
      }
      //有正确答案,才需要判断
      if (exam.examType === 1 || exam.examType === 3) {
        if (exam.result.toUpperCase() === exam.result.toUpperCase()) {
          //学生提交了答案，并且答案是正确的才返回正确。
          return true;
        } else {
          return false;
        }
      } else if (exam.examType === 2) {
        if (exam.studentExamResult.result.length > exam.result.length) {
          //学生提交答案多于正确答案
          return false;
        }

        let collectResult = exam.result;
        let studentResult = exam.studentExamResult.result;

        for (let i = 0; i < collectResult.length; i++) {
          let match = false;

          for (let j = 0; j < studentResult.length; j++) {
            if (collectResult[i].toUpperCase() === studentResult[j].toUpperCase()) {
              match = true;
            }
          }

          if (match === false) {
            //有一个答案不正确
            return false;
          }
        }

        //所有答案都正确，返回正确。
        return true;

      } else {
        //问答题、填空题，返回正确
        return true;
      }
    }
    return true;
  }

  render() {
    const {paperDetail, cursorExamIndex, sureCommit, form} = this.props;
    const {mapPaperExamSummary} = paperDetail;
    const {getFieldDecorator} = form;

    //cursorExamIndex 当前的试题号。

    if (mapPaperExamSummary == undefined) {
      return <div/>;
    }

    //对试题建立序列号
    let paperExam = [];

    let count = 0;
    for (let key in mapPaperExamSummary) {
      //查看效果
      let examSummary = mapPaperExamSummary[key];
      let examList = examSummary.paperExamVOList;
      for (let i in examList) {
        paperExam[count] = examList[i];
        paperExam[count].index = count + 1;
        paperExam[count].examType = examSummary.examType;
        count++;
      }
    }

    let curExam = paperExam[cursorExamIndex - 1];

    return (
      <div className={styles.box}>
        <Row>
          <Col span={23} offset={2}>
            <div className="gutter-box">
              <div>
                <Form style={{width: '100%'}}>
                  {this.examRender(curExam)}
                  <Row style={{width: '100%'}}>
                    {(cursorExamIndex == count) &&
                    <Col>
                      <Form.Item label='评价'>
                        {getFieldDecorator('evaluate',
                          {initialValue: paperDetail.paperPlanDetailVO.evaluate},
                          {rules: [{required: true, message: '请输入评价!'}]})(
                          <textarea name="" id="" cols="150" rows="10"></textarea>
                        )
                        }
                      </Form.Item>
                    </Col>
                    }
                    <Col style={{marginTop: '10px', marginBottom: '20px'}}>
                      <Button disabled={cursorExamIndex == 1} style={{marginRight: '10px'}} type="primary"
                              onClick={e => this.handleSubmmit(curExam, count, -1)}>上一题</Button>
                      {(cursorExamIndex != count) &&
                      <Button style={{marginLeft: '10px'}} type="primary"
                              onClick={e => this.handleSubmmit(curExam, count, 1)}>下一题</Button>
                      }

                      {(cursorExamIndex == count) &&
                      <Button style={{marginLeft: '10px'}} type="primary"
                              onClick={e => this.handleCommit()}>提交</Button>
                      }
                    </Col>
                  </Row>
                </Form>
              </div>
            </div>
          </Col>
        </Row>


        <Modal
          title="确认提交么？"
          visible={sureCommit}
          onOk={e => this.handleSubmmit(curExam, count, 0)}
          onCancel={e => this.handleCancel()}
          //confirmLoading={loading}
        >
          <p>提交后将不可修改!</p>
        </Modal>

      </div>
    );
  }

  handleCommit = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'paperReviewDetail/save',
      payload: {
        sureCommit: true
      }
    });
  }

  handleCancel = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'paperReviewDetail/save',
      payload: {
        sureCommit: false
      }
    });
  }

}

const PaperReviewDetailForm = Form.create({name: 'PaperReviewDetail'})(PaperReviewDetail);

export default connect(state => (
  {
    ...state.paperReviewDetail,
    loading: state.loading.models.paperReviewDetail,
  }))(PaperReviewDetailForm);

