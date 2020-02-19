import React from 'react';
import {connect} from 'dva';
import styles from './index.less';
import {Form, Input, Icon, Spin, Button, Checkbox, Row, Col, List, Radio} from 'antd';
import ExamListModal from './components/examListModal'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import OlBraftEditor from '@/components/olBraftEditor/OlBraftEditor'
import * as Util from '@/utils/util'

const mapExamName = {};
mapExamName[1] = "单选题";
mapExamName[2] = "多选题";
mapExamName[3] = "判断题";
mapExamName[4] = "问答题";
mapExamName[5] = "填空题";
let paperList = []
class newPaperManual extends React.Component {
  constructor() {
    super()
    this.state = {
      totalScore: 0,
      savePaperExamItems: [],
      paperDetail:{},
      addCount:0
    }
  }

  componentWillMount() {
    const { dispatch} = this.props;
    const {query} = this.props.location
    if(query.paperId){
      dispatch({
        type: 'newPaperManual/queryDetail',
        payload: {
          paperId:query.paperId ,
        },
      });

    }

  }

  addForm = e => {
    const {dispatch} = this.props;
    dispatch({
      type: 'newPaperManual/save',
      payload: {
        examListVisible: true,
      },
    });
  }
  examListMakeUp = (value,getFieldDecorator,isEdit) => {

    let paperExam = [];

    let count = 0;
    if(isEdit=='1'){
      for (let key in value) {
        //查看效果
        let examSummary = value[key];
        let examList = examSummary.paperExamVOList;
        for (let i in examList) {
          paperExam[count] = examList[i];
          paperExam[count].index = count + 1;
          paperExam[count].examType = examSummary.examType;
          count++;
        }
      }

    }else{
      for (let key in value) {
        //查看效果
        let examSummary = value[key];
        let examList = examSummary.paperExamVOList;
        for (let i in examList) {
          paperExam[count] = examList[i];
          paperExam[count].index = count + 1;
          paperExam[count].examType = examSummary.examType;
          count++;
        }
      }
    }


    let tempSavePaperExamItems = []
    for (let item of paperExam) {
      tempSavePaperExamItems.push(this.examRender(item, getFieldDecorator))
    }
    return tempSavePaperExamItems

  }


  examRender = (item,getFieldDecorator) => {
    return (
      <List.Item style={{width:'100%'}}>
        <Row gutter={24} style={{width:'100%'}}>
          <Col span={24}>
            <div>
              <div>{item.index}. {mapExamName[item.examType]} [{item.mark}分]</div>
              <div dangerouslySetInnerHTML={{__html: item.examName}}></div>
              {
                this.examListRender(item,getFieldDecorator)
              }
            </div>
          </Col>
        </Row>
      </List.Item>
    )
  }

  examListRender = (exam) => {
    const {form} = this.props;
    const {getFieldDecorator} = form;
    let oldResult = null;

    if (exam && exam.result) {
      oldResult = exam.result;
    }
    if (exam.examType === 1) {
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
                    <Radio value={temp.sort}>{temp.sort}. </Radio>
                    <span display="inline-block" style={{width: '100%'}}
                          dangerouslySetInnerHTML={{__html: temp.attrName}}></span>
                  </List.Item>
                }>
              </List>
            </Radio.Group>)
            }
          </Form.Item>
          <div>正确答案：{exam.result}</div>
          <Form.Item>
            {getFieldDecorator(`paperExamItems[${(exam.index - 1)}].mark`, {initialValue: exam.mark})(
              <Input style={{width: '100%'}}/>
            )}
          </Form.Item>
          <Form.Item style={{marginBottom:'0px'}}>
            {getFieldDecorator(`paperExamItems[${(exam.index - 1)}].sort`, {initialValue: (exam.index-1)})(
              <Input style={{display:'none'}}/>
            )}
          </Form.Item>
          <Form.Item style={{marginBottom:'0px'}}>
            {getFieldDecorator(`paperExamItems[${(exam.index - 1)}].examId`, {initialValue: (exam.examId)})(
              <Input style={{display:'none'}}/>
            )}
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
          <div>正确答案：{exam.result}</div>
          <Form.Item>
            {getFieldDecorator(`paperExamItems[${(exam.index - 1)}].mark`, {initialValue: exam.mark})(
              <Input style={{width: '100%'}}/>
            )}
          </Form.Item>
          <Form.Item style={{marginBottom:'0px'}}>
            {getFieldDecorator(`paperExamItems[${(exam.index - 1)}].sort`, {initialValue: (exam.index-1)})(
              <Input style={{display:'none'}}/>
            )}
          </Form.Item>
          <Form.Item style={{marginBottom:'0px'}}>
            {getFieldDecorator(`paperExamItems[${(exam.index - 1)}].examId`, {initialValue: (exam.examId)})(
              <Input style={{display:'none'}}/>
            )}
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
          <div>正确答案：{exam.result}</div>
          <Form.Item>
            {getFieldDecorator(`paperExamItems[${(exam.index - 1)}].mark`, {initialValue: exam.mark})(
              <Input style={{width: '100%'}}/>
            )}
          </Form.Item>
          <Form.Item style={{marginBottom:'0px'}}>
            {getFieldDecorator(`paperExamItems[${(exam.index - 1)}].sort`, {initialValue: (exam.index-1)})(
              <Input style={{display:'none'}}/>
            )}
          </Form.Item>
          <Form.Item style={{marginBottom:'0px'}}>
            {getFieldDecorator(`paperExamItems[${(exam.index - 1)}].examId`, {initialValue: (exam.examId)})(
              <Input style={{display:'none'}}/>
            )}
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
          <div>正确答案：{exam.result}</div>
          <Form.Item>
            {getFieldDecorator(`paperExamItems[${(exam.index - 1)}].mark`, {initialValue: exam.mark})(
              <Input style={{width: '100%'}}/>
            )}
          </Form.Item>
          <Form.Item style={{marginBottom:'0px'}}>
            {getFieldDecorator(`paperExamItems[${(exam.index - 1)}].sort`, {initialValue: (exam.index-1)})(
              <Input style={{display:'none'}}/>
            )}
          </Form.Item>
          <Form.Item style={{marginBottom:'0px'}}>
            {getFieldDecorator(`paperExamItems[${(exam.index - 1)}].examId`, {initialValue: (exam.examId)})(
              <Input style={{display:'none'}}/>
            )}
          </Form.Item>
        </div>
      )
    }

  }
  constructorPaper = (value, examId)=>{
    console.log(value.target.value,examId)
    this.state.savePaperExamItems.map((item,index)=>{
      if(item.examId == examId){

        let temp={}
        temp.examId = examId
        temp.mark = value.target.value
        temp.sort = index
        paperList[index]= temp
      }
    })
    let tempScore=0
    for(let item of paperList){
      tempScore += Number(item.mark)
    }
    this.setState({
      totalScore:tempScore
    })

  }
  handleSubmit = e => {
    debugger
    const {dispatch, paperId, history} = this.props;
    const { query } = this.props.location

    let result = this.props.form.getFieldsValue();
    const roleInfo = JSON.parse(sessionStorage.getItem('roleInfo'));
    const createStaffId = roleInfo.staffId;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
          dispatch({
          type: 'newPaperManual/saveExam',
          payload: {
            paperId: query.paperId,
            createStaffId:  createStaffId,
            passScore: result.passScore,
            paperExamItems: result.paperExamItems
          },
        });

      }
    });
  };

  showDetail = values =>{
    this.props.form.setFieldsValue({ 'passScore':  values.passScore})
    this.setState({
      // selRadioExamList
    })
  }

  render() {
    const {form,examListVisible,paperDetail,loading} = this.props;
    console.log("paperDetail----",paperDetail)


    // if(paperDetail){
    //   // this.props.form.setFieldsValue({ 'passScore':  paperDetail.passScore})
    //   this.setState({
    //     totalScore:paperDetail.totalScore
    //   })
    //
    // }
    const {getFieldDecorator} = form;
    const {
      totalScore,
    } = this.state


    return (
      <Spin spinning={loading}>
      <div className={styles.box} style={{marginTop:'15px'}}>
        <div className="clearfix">
          <div className="" style={{fontSize: '24px', lineHeight: '48px', textAlign: 'center'}}>
            <span>{paperDetail?paperDetail.paperName:''}</span>
          </div>
          <div className="pullright" style={{fontSize: '20px', lineHeight: '28px'}}>
            <div style={{fontSize: '14px', lineHeight: '28px'}}>
              总分：{paperDetail?paperDetail.totalScore:paperDetail.totalScore}
            </div>
          </div>

          <Form onSubmit={this.handleSubmit} layout='vertical'>
            <Form.Item labelCol={{span: 2}} wrapperCol={{span: 4}}>
              <Button type="dashed" onClick={this.addForm} style={{width: '60%'}}>
                <Icon type="plus"/> 选择试题
              </Button>
            </Form.Item>


            {this.examListMakeUp(paperDetail.mapPaperExamSummary,getFieldDecorator,'1')}

            <Form.Item label="及格分数：">
              {getFieldDecorator('passScore')(<Input/>)}
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                生成试卷
              </Button>
            </Form.Item>
          </Form>
        </div>

        <ExamListModal examListVisible={examListVisible} getStockInfo={(e) => {this.examListMakeUp(e,getFieldDecorator,'0')}}/>


      </div>
      </Spin>
    )
  }
}

const NewPaperManualForm = Form.create({name: 'newPaperAutoForm'})(newPaperManual);

export default connect(state => ({
  ...state.newPaperManual,
  loading: state.loading.models.newPaperManual,
}))(NewPaperManualForm);
