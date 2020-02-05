import React from 'react';
import {Button, Col, List, Checkbox, Radio, Row, Form, message} from 'antd';
import {connect} from 'dva';
import styles from './index.less';
import router from 'umi/router';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import MaxLength from 'braft-extensions/dist/max-length'

const options = {
  defaultValue: 16777215, // 指定默认限制数，如不指定则为Infinity(无限),16M
  //defaultValue: 20,
};
BraftEditor.use(MaxLength(options));

const mapExamName = {};
mapExamName[1] = "单选题";
mapExamName[2] = "多选题";
mapExamName[3] = "判断题";
mapExamName[4] = "问答题";
mapExamName[5] = "填空题";

let result = ``;

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

    console.log(result);
    if (result === undefined || result === "") {
      //未提交，进入下一题
      dispatch({
        type: 'examStartDetail/save',
        payload: {
          cursorExamIndex: cursorExamIndex + 1
        }
      })
    } else {
      //进行了答题,需要提交
      dispatch({
        type: 'examStartDetail/studentCommitPaper',
        payload: {
          createStaffId: query.staffId,
          planDetailId,
          paperId,
          paperExamId,
          examId,
          result
        }
      }).then(res => {

        console.log(res);
        if (res.code == 200) {
          //成功，
          console.log(cursorExamIndex);
          dispatch({
            type: 'examStartDetail/save',
            payload: {
              cursorExamIndex: cursorExamIndex + 1
            }
          })
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
  }

  handleMaxLength = () => {
    // console.log(1111);
    message.info('最多只能输入16777215个字符')
  };

  examRender = (item) => {
    return (
      <List.Item >
        <Row gutter={24}>
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
    let oldResult;

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
                  <Radio value={temp.sort} style={{width: '100%'}}>{temp.sort}. <span
                    dangerouslySetInnerHTML={{__html: temp.attrName}}></span></Radio>
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
      console.log(checkValue);
      return (<Form.Item >
          {getFieldDecorator('checkbox', {initialValue:checkValue})(
            <Checkbox.Group style={{width: '100%'}}>
              <List
                style={{width: '100%'}}
                dataSource={exam.paperExamAttrVOS}
                renderItem={(temp) =>
                  <List.Item style={{width: '100%'}}>
                    <Checkbox value={temp.sort} style={{width: '100%'}}>{temp.sort}.<span
                      dangerouslySetInnerHTML={{__html: temp.attrName}}></span></Checkbox>
                  </List.Item>
                }>
              </List>
            </Checkbox.Group>
          )}
        </Form.Item>
      )

    }
    if (exam.examType === 3) {
      //判断题
      return (
        <Form.Item >
          {getFieldDecorator('radio', {initialValue:oldResult})(<Radio.Group style={{width: '100%'}}>
            <List
              style={{width: '100%'}}
              dataSource={exam.paperExamAttrVOS}
              renderItem={(temp) =>
                <List.Item style={{width: '100%'}}>
                  <Radio value={temp.attrName} style={{width: '100%'}}><span
                    dangerouslySetInnerHTML={{__html: temp.attrName}}></span></Radio>
                </List.Item>
              }>
            </List>
          </Radio.Group>)
          }
        </Form.Item>
      )
    }
    else if (exam.examType === 4 || exam.examType === 5) {
      //问答题,填空题
      return <Form.Item >
        {getFieldDecorator('braftEditor', {initialValue:oldResult})(
          <BraftEditor
            contentStyle={{height: 200, overflow: 'scroll'}}
            placeholder="请输入答案"
            maxLength={16777215}
            onReachMaxLength={this.handleMaxLength}
          />)
        }
      </Form.Item>
    }
  }

  render() {
    const {paperDetail, cursorExamIndex} = this.props;
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
          <Form>
            {this.examRender(curExam)}
          </Form>
          <Row >
            <Col style={{textAlign: 'center', marginTop: '30px'}}>
              <Button disabled={cursorExamIndex == 1} style={{marginRight: '10px'}} type="primary"
                      onClick={e => this.handlePre()}>上一题</Button>
              <Button style={{marginLeft: '10px'}} type="primary"
                      onClick={e => this.handleNext(curExam, count)}>{cursorExamIndex == count ? `提交` : `下一题`}</Button>
            </Col>
          </Row>
        </div>

      </div>
    );
  }


}

const ExamStartDetailForm = Form.create({name: 'ExamStartDetail'})(ExamStartDetail);

export default connect(state => (
  {
    ...state.examStartDetail,
    //loading: state.loading.models.examStartDetail,
  }))(ExamStartDetailForm);

