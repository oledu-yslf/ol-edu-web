import React from 'react';
import {Button, Col, List, Checkbox, Radio, Row, Form, Input, Modal} from 'antd';
import {connect} from 'dva';
import styles from '../../../style/common.less';
import router from 'umi/router';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import OlBraftEditor from '@/components/olBraftEditor/OlBraftEditor'

const mapExamName = {};
mapExamName[1] = "单选题";
mapExamName[2] = "多选题";
mapExamName[3] = "判断题";
mapExamName[4] = "问答题";
mapExamName[5] = "填空题";


class PaperReview extends React.Component {
  componentWillMount() {
    const {dispatch} = this.props;
    const {query} = this.props.location;

    dispatch({
      type: 'paperReview/init',
      payload: {
        ...query
      }
    });
  }

  handleSubmmit = (exam, maxCount, step) => {
    const {dispatch, cursorExamIndex} = this.props;
    let result = "";

    // if (exam.examType === 1 || exam.examType === 3) {
    //   //单选题,判断题
    //   result = this.props.form.getFieldsValue().radio;
    // }
    // else if (exam.examType === 2) {
    //   //多选题
    //   let values = this.props.form.getFieldsValue().checkbox;
    //   if (values !== undefined && values !== []) {
    //     values.sort();
    //     for (let i in values) {
    //       result = result + values[i];
    //     }
    //   }
    // }
    // else if (exam.examType === 4 || exam.examType === 5) {
    //   //问答题,//填空题
    //   const context = this.props.form.getFieldsValue().braftEditor;
    //   result = context.toHTML();
    // }
    result = this.props.form.getFieldsValue();
    console.log(result)
    const {query} = this.props.location;
    const {paperId, paperExamId, examId} = exam;
    const {planDetailId} = this.props.location.query;

    let nextIndex = cursorExamIndex + step;

    if (result === undefined || result === "" || result === null) {
      //未提交，进入下一题
      dispatch({
        type: 'paperReview/save',
        payload: {
          cursorExamIndex: nextIndex
        }
      })
    } else {
      //进行了答题,需要提交
      let sureCommit = 0; //是否最后一题标志，0否，1是
      if (cursorExamIndex === maxCount) {
        sureCommit = 1;     //最后一题
      }

      let roleInfo = sessionStorage.getItem('roleInfo') ? JSON.parse(sessionStorage.getItem('roleInfo')) : '';
      const reviewStaffId = roleInfo ? roleInfo.staffId : '';

      dispatch({
        type: 'paperReview/teacherCommitPaper',
        payload: {
          createStaffId: query.staffId,
          planDetailId,
          paperId,
          paperExamId,
          reviewStaffId,//审阅教师ID
          score: result.getScore,//得分
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
            router.push('/teacher/homeworkForTeacherList')
            return;
          }

          dispatch({
            type: 'paperReview/init',
            payload: {
              ...query
            }
          })

          dispatch({
            type: 'paperReview/save',
            payload: {
              cursorExamIndex: nextIndex
            }
          })

          //antd中的form表单 initialValue导致数据不更新问题
          //https://blog.csdn.net/weixin_34087301/article/details/93900887
          this.props.form.resetFields();
        }
      });

    }
  }

  examRender = (item) => {
    return (
      <List.Item style={{width: '100%'}}>
        <Row gutter={24} style={{width: '100%'}}>
          <Col span={24}>
            <div>
              <div>{item.index}. {mapExamName[item.examType]} [{item.mark}分]</div>
              <div dangerouslySetInnerHTML={{__html: item.examName}}></div>
              {
                this.examAttrRadioRender(item)
              }
            </div>
          </Col>
        </Row>
      </List.Item>
    )
  }

  examAttrRadioRender = (exam) => {
    const {form} = this.props;
    const {getFieldDecorator} = form;
    let oldResult = null;

    if (exam.studentExamResult && exam.studentExamResult.result) {
      oldResult = exam.studentExamResult.result;
    }

    if (exam.examType === 1) {
      //选择题
      return (
        <div>
          <Form.Item>
            {getFieldDecorator('radio', {initialValue: oldResult})(<Radio.Group style={{width: '100%'}}>
              <List
                style={{width: '100%'}}
                dataSource={exam.paperExamAttrVOS}
                renderItem={(temp) =>
                  <List.Item style={{width: '100%'}}>
                    <Radio value={temp.sort}>{temp.sort}. </Radio>
                    <span display="inline-block" style={{width: '100%'}}
                          dangerouslySetInnerHTML={{__html: temp.attrName}}></span>
                  </List.Item>

                }>
              </List>

            </Radio.Group>)
            }
          </Form.Item>
          <p className={exam.studentExamResult.result == exam.result ? styles.black : styles.red}>
            学生答案：{exam.studentExamResult.result}</p>
          <p className={exam.studentExamResult.result == exam.result ? styles.black : styles.red}>正确答案：{exam.result}</p>
          <Form.Item>
            {getFieldDecorator('isCorrect', {initialValue: exam.studentExamResult.result == exam.result ? '1' : '0'})(
              <Radio.Group style={{width: '100%'}}>
                <Radio value={'1'}>对 </Radio>
                <Radio value={'0'}>错 </Radio>
              </Radio.Group>)
            }
          </Form.Item>
          <Form.Item label='得分'>
            {getFieldDecorator('getScore',
              {initialValue: exam.studentExamResult.result == exam.result ? exam.mark : ''},
              {rules: [{ required: true, message: '请输入成绩!' }]})(
              <span><Input style={{width:'30%'}}/></span>
            )
            }
          </Form.Item>
        </div>
      )
    }
    else if (exam.examType === 2) {
      //多选题
      let checkValue = [];
      if (oldResult != null) {
        for (let i = 0; i < oldResult.length; i++) {
          checkValue[i] = oldResult[i];
        }
      }

      return (
        <div>
          <Form.Item>
            {getFieldDecorator(`checkbox`, {initialValue: checkValue})(
              <Checkbox.Group name='mycheck' style={{width: '100%'}}>

                <Row style={{width: '100%'}}>
                  {exam.paperExamAttrVOS.map(temp => (

                    <Col span={24} key={temp.paperExamAttrId}>
                      <div style={{lineHeight: '32px'}}>
                        <Checkbox id={temp.paperExamAttrId} value={temp.sort}>{temp.sort}.</Checkbox>
                        <span display="inline-block" style={{width: '96%', float: 'right'}}
                              dangerouslySetInnerHTML={{__html: temp.attrName}}></span>
                      </div>
                    </Col>
                  ))}
                </Row>

              </Checkbox.Group>
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('isCorrect', {initialValue: exam.studentExamResult.result == exam.result ? '1' : '0'})(
              <Radio.Group style={{width: '100%'}}>
                <Radio value={'1'}>对 </Radio>
                <Radio value={'0'}>错 </Radio>
              </Radio.Group>)
            }
          </Form.Item>
          <Form.Item label='得分'>
            {getFieldDecorator('getScore',
              {initialValue: exam.studentExamResult.result == exam.result ? exam.mark : ''},
              {rules: [{ required: true, message: '请输入成绩!' }]})(
              <span><Input style={{width:'30%'}}/></span>
            )
            }
          </Form.Item>
        </div>
      )

    }
    else if (exam.examType === 3) {
      //判断题
      return (
        <div>
          <Form.Item>
            {getFieldDecorator('radio', {initialValue: oldResult})(<Radio.Group style={{width: '100%'}}>
              <List
                style={{width: '100%'}}
                dataSource={exam.paperExamAttrVOS}
                renderItem={(temp) =>
                  <List.Item style={{width: '100%'}}>
                    <Radio value={temp.attrName}></Radio>
                    <span display="inline-block" style={{width: '100%'}}
                          dangerouslySetInnerHTML={{__html: temp.attrName}}></span>
                  </List.Item>
                }>
              </List>
            </Radio.Group>)
            }
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('isCorrect', {initialValue: exam.studentExamResult.result == exam.result ? '1' : '0'})(
              <Radio.Group style={{width: '100%'}}>
                <Radio value={'1'}>对 </Radio>
                <Radio value={'0'}>错 </Radio>
              </Radio.Group>)
            }
          </Form.Item>
          <Form.Item label='得分'>
            {getFieldDecorator('getScore',
              {initialValue: exam.studentExamResult.result == exam.result ? exam.mark : exam.mark},
              {rules: [{ required: true, message: '请输入成绩!' }]})(
              <span><Input style={{width:'30%'}}/></span>
            )
            }
          </Form.Item>
        </div>
      )
    }
    else if (exam.examType === 4 || exam.examType === 5) {
      //问答题

      return (
        <div>
          <Form.Item>
            {getFieldDecorator('braftEditor', {initialValue: BraftEditor.createEditorState(oldResult || '')})(
              <OlBraftEditor
                contentStyle={{height: 200, overflow: 'scroll'}}
              />)
            }
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('isCorrect', {initialValue: exam.studentExamResult.result == exam.result ? '1' : '0'})(
              <Radio.Group style={{width: '100%'}}>
                <Radio value={'1'}>对 </Radio>
                <Radio value={'0'}>错 </Radio>
              </Radio.Group>)
            }
          </Form.Item>
          <Form.Item label='得分'>
            {getFieldDecorator('getScore',
              {initialValue: ''},
              {rules: [{ required: true, message: '请输入成绩!' }]})(
              <span><Input style={{width:'30%'}}/></span>
            )
            }
          </Form.Item>
        </div>
      )
    }
  }

  render() {
    const {paperDetail, cursorExamIndex, sureCommit,form} = this.props;
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
        <div>
          <Form style={{width: '100%'}}>
            {this.examRender(curExam)}
          </Form>
          <Row style={{width: '100%'}}>
            {(cursorExamIndex == count) &&
            <Col>
              <Form.Item label='评价'>
                {getFieldDecorator('evaluate',
                  {initialValue: ''},
                  {rules: [{ required: true, message: '请输入评价!' }]})(
                  <span><textarea name="" id="" cols="150" rows="10"></textarea></span>
                )
                }
              </Form.Item>
            </Col>
            }
            <Col style={{textAlign: 'center', marginTop: '30px'}}>
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
        </div>

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
      type: 'paperReview/save',
      payload: {
        sureCommit: true
      }
    });
  }

  handleCancel = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'paperReview/save',
      payload: {
        sureCommit: false
      }
    });
  }

}

const PaperReviewForm = Form.create({name: 'PaperReview'})(PaperReview);

export default connect(state => (
  {
    ...state.paperReview,
    loading: state.loading.models.paperReview,
  }))(PaperReviewForm);

