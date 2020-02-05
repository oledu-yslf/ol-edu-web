import React from 'react';
import {Button, Col, List, Checkbox, Radio, Row} from 'antd';
import {connect} from 'dva';
import styles from './index.less';
import router from 'umi/router';
import BraftEditor from 'braft-editor'


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

  handleNext = (exam,maxCount) => {
    const {dispatch} = this.props;
    let result = ``;

    if (exam.examType === 1 || exam.examType === 3) {
      //单选题,判断题
      let radio = document.getElementsByName("examAttr");
      console.log(radio);
      for (let i in radio){
        console.log(radio[i].checked)

        if (radio[i].checked){
          result = radio[i].value;
        }
      }
    }
    else if (exam.examType === 2) {
      //多选题
      let obj = document.getElementsByName("examAttr");
      for (let i in obj){
        if (obj[i].checked){
          result = result + obj[i].value;
        }
      }
    }
    else if (exam.examType === 4) {
      //问答题

    }
    else if (exam.examType === 5) {
      //填空题

    }

    console.log(result);
    dispatch({
      type: 'examStartDetail/studentCommitPaper',
      payload: {

      }
    });

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
    if (exam.examType === 1 || exam.examType === 3) {
      //单选题,判断题
      return <Radio.Group style={{width: '100%'}}>
        <List
          style={{width: '100%'}}
          dataSource={exam.paperExamAttrVOS}
          renderItem={(temp) =>
            <List.Item style={{width: '100%'}}>
              <Radio name='examAttr' value={temp.sort} style={{width: '100%'}}>{temp.sort}. <span
                dangerouslySetInnerHTML={{__html: temp.attrName}}></span></Radio>
            </List.Item>
          }>
        </List>
      </Radio.Group>
    }
    else if (exam.examType === 2) {
      //多选题
      return <Checkbox.Group style={{width: '100%'}}>
        <List
          style={{width: '100%'}}
          dataSource={exam.paperExamAttrVOS}
          renderItem={(temp) =>
            <List.Item style={{width: '100%'}}>
              <Checkbox name='examAttr' value={temp.sort} style={{width: '100%'}}>{temp.sort}.<span
                dangerouslySetInnerHTML={{__html: temp.attrName}}></span></Checkbox>
            </List.Item>
          }>
        </List>
      </Checkbox.Group>

    }
    else if (exam.examType === 4) {
      //问答题
      return <List
        style={{width: '100%'}}
        dataSource={exam.paperExamAttrVOS}
        renderItem={(temp) =>
          <List.Item style={{width: '100%'}}>
            <span dangerouslySetInnerHTML={{__html: temp.attrName}}></span>
            <BraftEditor
              contentStyle={{height: 80, overflow: 'scroll'}}
              // value={editor}
              onChange={this.handleEditorChange}
            />
          </List.Item>
        }>
      </List>
    }
    else if (exam.examType === 5) {
      //填空题
      return <List
        style={{width: '100%'}}
        dataSource={exam.paperExamAttrVOS}
        renderItem={(temp) =>
          <List.Item style={{width: '100%'}}>
            <span dangerouslySetInnerHTML={{__html: temp.attrName}}></span><input/>
          </List.Item>
        }>
      </List>;
    }
  }

  render() {
    const {paperDetail, cursorExamIndex} = this.props;
    const {mapPaperExamSummary} = paperDetail;

    //cursorExamIndex 当前的试题号。

    if (mapPaperExamSummary == undefined){
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

          {this.examRender(curExam)}

          <Row >
            <Col style={{textAlign: 'center', marginTop: '30px'}}>
              <Button disabled={cursorExamIndex == 1} style={{marginRight: '10px'}} type="primary"
                      onClick={e => this.handlePre()}>上一题</Button>
              <Button style={{marginLeft: '10px'}} type="primary"
                      onClick={e => this.handleNext(curExam,count)}>{cursorExamIndex == count ? `提交` : `下一题`}</Button>
            </Col>
          </Row>
        </div>

      </div>
    );
  }


}

export default connect(state => (
  {
    ...state.examStartDetail,
    //loading: state.loading.models.examStartDetail,
  }))(ExamStartDetail);

