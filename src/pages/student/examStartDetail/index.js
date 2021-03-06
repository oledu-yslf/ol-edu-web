import React from 'react';
import {Button, Col, List, Checkbox, Radio, Row, Form, message,Modal} from 'antd';
import {connect} from 'dva';
import styles from './index.less';
import router from 'umi/router';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import OlBraftEditor from '@/components/olBraftEditor/OlBraftEditor'
import MaxLength from 'braft-extensions/dist/max-length'

/*
const excludeControls = [
  'emoji','link'
]

const options = {
  defaultValue: 16777215, // 指定默认限制数，如不指定则为Infinity(无限),16M
  //defaultValue: 20,
};
BraftEditor.use(MaxLength(options));
*/

const mapExamName = {};
mapExamName[1] = "单选题";
mapExamName[2] = "多选题";
mapExamName[3] = "判断题";
mapExamName[4] = "问答题";
mapExamName[5] = "填空题";


class ExamStartDetail extends React.Component {
  componentWillMount() {
    const {dispatch} = this.props;
    const {query} = this.props.location;

    dispatch({
      type: 'examStartDetail/init',
      payload: {
        ...query
      }
    });
  }

  handleSubmmit = (exam, maxCount,step) => {
    const {dispatch, cursorExamIndex} = this.props;
    let result = "";

    if (exam.examType === 1 || exam.examType === 3) {
      //单选题,判断题
      result = this.props.form.getFieldsValue().radio;
    }
    else if (exam.examType === 2) {
      //多选题
      let values = this.props.form.getFieldsValue().checkbox;
      if (values !== undefined && values !== []) {
        values.sort();
        for (let i in values) {
          result = result + values[i];
        }
      }
    }
    else if (exam.examType === 4 || exam.examType === 5) {
      //问答题,//填空题
      const context = this.props.form.getFieldsValue().braftEditor;
      result = context.toHTML();
    }


    const {query} = this.props.location;
    const {paperId, paperExamId, examId} = exam;
    const {planDetailId} = this.props.location.query;

    let nextIndex = cursorExamIndex + step;

    if (result === undefined || result === "" || result === null) {
      //未提交，进入下一题
      dispatch({
        type: 'examStartDetail/save',
        payload: {
          cursorExamIndex: nextIndex
        }
      })
    } else {
      //进行了答题,需要提交
      let sureCommit = 0; //是否最后一题标志，0否，1是
      if (cursorExamIndex === maxCount && step >= 0){
        sureCommit = 1;     //最后一题
      }


      dispatch({
        type: 'examStartDetail/studentCommitPaper',
        payload: {
          createStaffId: query.staffId,
          planDetailId,
          paperId,
          paperExamId,
          examId,
          result,
          sureCommit
        }
      }).then(res => {

        if (res.code == 200) {
          //成功，
          if (sureCommit === 1){
            //提交成功后，需要跳转。
            dispatch({
              type: 'paperReviewDetail/save',
              payload: {
                cursorExamIndex: nextIndex,
                sureCommit:false
              }
            })

            window.history.go(-2);
            return ;
          }

          dispatch({
            type: 'examStartDetail/init',
            payload: {
              ...query
            }
          })

          dispatch({
            type: 'examStartDetail/save',
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

  /*
  handleNext = (exam, maxCount) => {
    const {dispatch, cursorExamIndex} = this.props;
    let result = "";

    if (exam.examType === 1 || exam.examType === 3) {
      //单选题,判断题
      result = this.props.form.getFieldsValue().radio;
    }
    else if (exam.examType === 2) {
      //多选题
      let values = this.props.form.getFieldsValue().checkbox;
      if (values !== undefined && values !== []) {
        values.sort();
        for (let i in values) {
          result = result + values[i];
        }
      }
    }
    else if (exam.examType === 4 || exam.examType === 5) {
      //问答题,//填空题
      const context = this.props.form.getFieldsValue().braftEditor;
      result = context.toHTML();
    }


    const {query} = this.props.location;
    const {paperId, paperExamId, examId} = exam;
    const {planDetailId} = this.props.location.query;

    if (result === undefined || result === "" || result === null) {
      //未提交，进入下一题
      dispatch({
        type: 'examStartDetail/save',
        payload: {
          cursorExamIndex: cursorExamIndex + 1
        }
      })
    } else {
      //进行了答题,需要提交
      let sureCommit = 0; //是否最后一题标志，0否，1是
      if (cursorExamIndex === maxCount){
        sureCommit = 1;     //最后一题
      }


      dispatch({
        type: 'examStartDetail/studentCommitPaper',
        payload: {
          createStaffId: query.staffId,
          planDetailId,
          paperId,
          paperExamId,
          examId,
          result,
          sureCommit
        }
      }).then(res => {

        if (res.code == 200) {
          //成功，
          if (sureCommit === 1){
            //提交成功后，需要跳转。
            router.push('/student')
            return ;
          }

          dispatch({
            type: 'examStartDetail/init',
            payload: {
              ...query
            }
          })

          dispatch({
            type: 'examStartDetail/save',
            payload: {
              cursorExamIndex: cursorExamIndex + 1
            }
          })

          //antd中的form表单 initialValue导致数据不更新问题
          //https://blog.csdn.net/weixin_34087301/article/details/93900887
          this.props.form.resetFields();
        }
      });

    }
  }
  handlePre = () => {
    const {dispatch} = this.props;
    const {cursorExamIndex} = this.props;
    let pre = cursorExamIndex - 1;

    dispatch({
      type: 'examStartDetail/save',
      payload: {
        cursorExamIndex: pre
      }
    });

    this.props.form.resetFields();

  }
*/

  examRender = (item) => {
    return (
      <List.Item style={{width:'100%'}}>
        <Row gutter={24} style={{width:'100%'}}>
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

    if (exam.studentExamResult && exam.studentExamResult.result){
      oldResult = exam.studentExamResult.result;
    }

    if (exam.examType === 1) {
      //判断题
      return (
        <Form.Item >
          {getFieldDecorator('radio', {initialValue:oldResult})(<Radio.Group style={{width: '100%'}}>
            <List
              style={{width: '100%'}}
              dataSource={exam.paperExamAttrVOS}
              renderItem={(temp) =>
                <List.Item style={{width: '100%'}}>
                  <Radio value={temp.sort} >{temp.sort}. </Radio>
                  <span display="inline-block" style={{width: '100%'}} dangerouslySetInnerHTML={{__html: temp.attrName}}></span>
                </List.Item>
              }>
            </List>
          </Radio.Group>)
          }
        </Form.Item>
      )
    }
    else if (exam.examType === 2) {
      //多选题
      let checkValue = [];
      if (oldResult != null){
        for (let i = 0; i < oldResult.length; i ++){
          checkValue[i] = oldResult[i];
        }
      }

      return (<Form.Item >
          {getFieldDecorator(`checkbox`, {initialValue : checkValue})(
            <Checkbox.Group  name='mycheck' style={{width: '100%'}} >

              <Row style={{width:'100%'}}>
                {exam.paperExamAttrVOS.map(temp => (

                    <Col span={24} key={temp.paperExamAttrId}>
                      <div style={{lineHeight:'32px'}}>
                        <Checkbox id={temp.paperExamAttrId} value={temp.sort}>{temp.sort}.</Checkbox>
                        <span display="inline-block" style={{width: '96%',float:'right'}} dangerouslySetInnerHTML={{__html: temp.attrName}}></span>
                      </div>
                    </Col>
                ))}
              </Row>

            </Checkbox.Group>
          )}
        </Form.Item>
      )

    }
    else if (exam.examType === 3) {
      //判断题
      return (
        <Form.Item >
          {getFieldDecorator('radio', {initialValue:oldResult})(<Radio.Group style={{width: '100%'}}>
            <List
              style={{width: '100%'}}
              dataSource={exam.paperExamAttrVOS}
              renderItem={(temp) =>
                <List.Item style={{width: '100%'}}>
                  <Radio value={temp.attrName} ></Radio>
                  <span display="inline-block" style={{width: '100%'}} dangerouslySetInnerHTML={{__html: temp.attrName}}></span>
                </List.Item>
              }>
            </List>
          </Radio.Group>)
          }
        </Form.Item>
      )
    }
    else if (exam.examType === 4 || exam.examType === 5) {
      //问答题

      return <Form.Item >
        {getFieldDecorator('braftEditor', {initialValue:BraftEditor.createEditorState(oldResult||'')})(
          <OlBraftEditor
            contentStyle={{height: 200, overflow: 'scroll'}}
          />)
        }
      </Form.Item>
    }
  }

  render() {
    const {paperDetail, cursorExamIndex,sureCommit} = this.props;
    const {mapPaperExamSummary} = paperDetail;

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
        <div  >
          <Form style={{width:'100%'}}>
            {this.examRender(curExam)}
          </Form>
          <Row style={{width:'100%'}}>
            <Col style={{textAlign: 'center', marginTop: '30px'}}>
              <Button disabled={cursorExamIndex == 1} style={{marginRight: '10px'}} type="primary"
                      onClick={e => this.handleSubmmit(curExam, count,-1)}>上一题</Button>
              {(cursorExamIndex != count) &&
              <Button style={{marginLeft: '10px'}} type="primary"
                      onClick={e => this.handleSubmmit(curExam, count,1)}>下一题</Button>
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
          onOk={ e => this.handleSubmmit(curExam,count,0)}
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
      type: 'examStartDetail/save',
      payload: {
        sureCommit : true
      }
    });
  }

  handleCancel = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'examStartDetail/save',
      payload: {
        sureCommit : false
      }
    });
  }

}

const ExamStartDetailForm = Form.create({name: 'ExamStartDetail'})(ExamStartDetail);

export default connect(state => (
  {
    ...state.examStartDetail,
    //loading: state.loading.models.examStartDetail,
  }))(ExamStartDetailForm);

