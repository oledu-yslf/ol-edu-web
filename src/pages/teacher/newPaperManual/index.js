import React from 'react';
import {connect} from 'dva';
import styles from './index.less';
import {Form, Input, Icon, Select, Button, Checkbox, Row, Col, List, Radio} from 'antd';
import ExamListModal from './components/examListModal'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import OlBraftEditor from '@/components/olBraftEditor/OlBraftEditor'

let examListArr = []

const mapExamName = {};
mapExamName[1] = "单选题";
mapExamName[2] = "多选题";
mapExamName[3] = "判断题";
mapExamName[4] = "问答题";
mapExamName[5] = "填空题";

class newPaperManual extends React.Component {
  constructor() {
    super()
    this.state = {
      selRadioExamList: [],
      selCheckboxExamList: [],
      selTrueOrFalseExamList: [],
      selBlankExamList: [],
      selQuestionExamList: [],
      selRadioExamFlag: false,
      selCheckboxExamFlag: false,
      selTrueOrFalseExamFlag: false,
      selBlankExamFlag: false,
      selQuestionExamFlag: false,
      totalScore: 0,
      savePaperExamItems: []
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
  examListMakeUp = (value,getFieldDecorator) => {
    let selRadioExamListTemp = []
    let selCheckboxExamListTemp = []
    let selTrueOrFalseExamListTemp = []
    let selBlankExamListTemp = []
    let selQuestionExamListTemp = []
    let tempTotalScore = 0
    let selRadioExamFlagTemp = false
    let selCheckboxExamFlagTemp = false
    let selTrueOrFalseExamFlagTemp = false
    let selQuestionExamFlagTemp = false
    let selBlankExamFlagTemp = false
    let tempSavePaperExamItems = []
    for (let item of value) {
      tempTotalScore += parseInt(item.mark)
      tempSavePaperExamItems.push(item)
      if (item.examType == 1) {
        selRadioExamFlagTemp = true
        selRadioExamListTemp.push(this.examListRender(item,getFieldDecorator))
      } else if (item.examType == 2) {
        selCheckboxExamFlagTemp = true
        selCheckboxExamListTemp.push(this.examListRender(item,getFieldDecorator))
      } else if (item.examType == 3) {
        selTrueOrFalseExamFlagTemp = true
        selTrueOrFalseExamListTemp.push(this.examListRender(item,getFieldDecorator))
      } else if (item.examType == 4) {
        selQuestionExamFlagTemp = true
        selQuestionExamListTemp.push(this.examListRender(item,getFieldDecorator))
      } else if (item.examType == 5) {
        selBlankExamFlagTemp = true
        selBlankExamListTemp.push(this.examListRender(item,getFieldDecorator))
      }

    }

    this.setState({
      selRadioExamList: selRadioExamListTemp,
      selCheckboxExamList: selCheckboxExamListTemp,
      selTrueOrFalseExamList: selTrueOrFalseExamListTemp,
      selBlankExamList: selBlankExamListTemp,
      selQuestionExamList: selQuestionExamListTemp,
      totalScore: tempTotalScore,
      selRadioExamFlag: selRadioExamFlagTemp,
      selCheckboxExamFlag: selCheckboxExamFlagTemp,
      selTrueOrFalseExamFlag: selTrueOrFalseExamFlagTemp,
      selBlankExamFlag: selBlankExamFlagTemp,
      selQuestionExamFlag: selQuestionExamFlagTemp,
      savePaperExamItems: tempSavePaperExamItems
    });
  }
  examListRender = (value,getFieldDecorator) => {
    let oldResult = null;

    if (value && value) {
      oldResult = value;
    }

    if (value.examType === 1) {
      //单选题
      return (
        <div style={{width: '100%'}}>
          <Form.Item style={{width: '100%'}}>
            <div dangerouslySetInnerHTML={{__html: value.examName}}></div>
            {getFieldDecorator('radio', {initialValue: ''})(<Radio.Group style={{width: '100%'}}>
              <List
                style={{width: '100%'}}
                dataSource={value.baseExamAttrVOList}
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
          <Form.Item label="分数：">
            {getFieldDecorator(`${value.examId}`)(<Input id={value.examId}/>)}
          </Form.Item>
        </div>
      )
    }
    else if (value.examType === 2) {
      //多选题
      let checkValue = [];
      if (oldResult != null) {
        for (let i = 0; i < oldResult.length; i++) {
          checkValue[i] = oldResult[i];
        }
      }
      return (
        <div style={{width: '100%'}}>
          <Form.Item style={{width: '100%'}}>
            <div dangerouslySetInnerHTML={{__html: value.examName}}></div>

            {getFieldDecorator(`checkbox`)(
              <Checkbox.Group name='mycheck' style={{width: '100%'}}>

                <Row key={value.examId} style={{width: '100%'}}>
                  {value.baseExamAttrVOList.map((temp, index) => (

                    <Col span={24} key={temp.baseExamAttrVOList}>
                      <div style={{lineHeight: '32px'}}>
                        <Checkbox id={temp.examId + index} value={temp.sort}>{temp.sort}.</Checkbox>
                        <span display="inline-block" style={{width: '96%', float: 'right'}}
                              dangerouslySetInnerHTML={{__html: temp.attrName}}></span>
                      </div>
                    </Col>
                  ))}
                </Row>

              </Checkbox.Group>
            )}
          </Form.Item>
          <Form.Item label="分数：">
            {getFieldDecorator(`${value.examId}`)(<Input id={value.examId}/>)}
          </Form.Item>
        </div>
      )

    }
    else if (value.examType === 3) {
      //判断题
      return (
        <div style={{width: '100%'}}>
          <Form.Item style={{width: '100%'}}>
            <div dangerouslySetInnerHTML={{__html: value.examName}}></div>

            {getFieldDecorator('radio')(<Radio.Group style={{width: '100%'}}>
              <List
                style={{width: '100%'}}
                dataSource={value.baseExamAttrVOList}
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
          <Form.Item label="分数：">
            {getFieldDecorator(`${value.examId}`)(<Input id={value.examId}/>)}
          </Form.Item>

        </div>
      )
    } else if (value.examType === 4) {
      //问答题
      return (
        <div style={{width: '100%'}}>
          <Form.Item style={{width: '100%'}}>
            <div dangerouslySetInnerHTML={{__html: value.examName}}></div>
            {getFieldDecorator('braftEditor')(
              <OlBraftEditor
                contentStyle={{height: 200, overflow: 'scroll'}}
              />)
            }
          </Form.Item>
          <Form.Item label="分数：">
            {getFieldDecorator(`${value.examId}`)(<Input id={value.examId}/>)}
          </Form.Item>
        </div>
      )
    } else if (value.examType === 5) {
      //填空题
      return (
        <div style={{width: '100%'}}>
          <Form.Item style={{width: '100%'}}>
            <div dangerouslySetInnerHTML={{__html: value.examName}}></div>
            {getFieldDecorator('braftEditor')(
              <OlBraftEditor
                contentStyle={{height: 200, overflow: 'scroll'}}
              />)
            }
          </Form.Item>
          <Form.Item label="分数：">
            {getFieldDecorator(`${value.examId}`)(<Input id={value.examId}/>)}
          </Form.Item>
        </div>
      )
    }

  }

  handleSubmit = e => {
    const {dispatch, paperId, history} = this.props;
    console.log(history.location.query.paperId)
    console.log(history.location.query.paperName)
    const {
      totalScore,
      savePaperExamItems
    } = this.state
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const roleInfo = sessionStorage.getItem('roleInfo')
          ? JSON.parse(sessionStorage.getItem('roleInfo'))
          : '';
        const staffId = roleInfo ? roleInfo.staffId : '';
        console.log("values:", values)
        dispatch({
          type: 'newPaperManual/saveExam',
          payload: {
            paperId: history.location.query.paperId,
            createStaffId: staffId,
            passScore: totalScore,
            paperExamItems: savePaperExamItems
          },
        });

      }
    });
  };

  render() {
    const {form,examListVisible} = this.props;
    const {getFieldDecorator} = form;
    const {
      selRadioExamList,
      selCheckboxExamList,
      selTrueOrFalseExamList,
      selBlankExamList,
      selQuestionExamList,
      totalScore,
      selRadioExamFlag,
      selCheckboxExamFlag,
      selTrueOrFalseExamFlag,
      selBlankExamFlag,
      selQuestionExamFlag,
    } = this.state

    return (

      <div className={styles.box}>
        <div className="clearfix">
          <div className="" style={{fontSize: '24px', lineHeight: '48px', textAlign: 'center'}}>
            <span>111</span>
          </div>
          <div className="pullright" style={{fontSize: '20px', lineHeight: '28px'}}>
            <div style={{fontSize: '14px', lineHeight: '28px'}}>
              总分：{totalScore}
            </div>
          </div>

          <Form onSubmit={this.handleSubmit} layout='vertical'>
            <Form.Item labelCol={{span: 2}} wrapperCol={{span: 4}}>
              <Button type="dashed" onClick={this.addForm} style={{width: '60%'}}>
                <Icon type="plus"/> 选择试题
              </Button>
            </Form.Item>

            <div>
              <div style={{display: selRadioExamFlag ? 'block' : 'none'}}>
                <div>{selRadioExamList.length > 0 ? '一、' + mapExamName[1] : mapExamName[1]}</div>
                <List
                  style={{width: '100%'}}
                  dataSource={selRadioExamList}
                  renderItem={(tempRadio) =>
                    <List.Item style={{width: '100%'}}>
                      {tempRadio ? tempRadio : ''}
                    </List.Item>
                  }>
                </List>
              </div>

              <div style={{display: selCheckboxExamFlag ? 'block' : 'none'}}>
                <div>{
                  selRadioExamList.length > 0 && selCheckboxExamList.length > 0 ?
                    ('二、' + mapExamName[2]) : (selRadioExamList.length == 0 && selCheckboxExamList.length > 0 ? '一、' + mapExamName[2] : '')
                }</div>
                <List
                  style={{width: '100%'}}
                  dataSource={selCheckboxExamList}
                  renderItem={(temp1) =>
                    <List.Item style={{width: '100%'}}>
                      {temp1}
                    </List.Item>
                  }>
                </List>
              </div>

              <div style={{display: selTrueOrFalseExamFlag ? 'block' : 'none'}}>
                <div>{
                  selRadioExamList.length > 0 && selCheckboxExamList.length > 0 && selTrueOrFalseExamList.length > 0 ?
                    ('三、' + mapExamName[3]) :
                    (selRadioExamList.length == 0 && selCheckboxExamList.length == 0 ? '一、' + mapExamName[3] : (selRadioExamList.length > 0 || selCheckboxExamList.length > 0 ? '二、' + mapExamName[3] : ''))
                }
                </div>
                <List
                  style={{width: '100%'}}
                  dataSource={selTrueOrFalseExamList}
                  renderItem={(temp2) =>
                    <List.Item style={{width: '100%'}}>
                      {temp2}
                    </List.Item>
                  }>
                </List>
              </div>

              <div style={{display: selQuestionExamFlag ? 'block' : 'none'}}>
                <div>{
                  selRadioExamList.length > 0 && selCheckboxExamList.length > 0 && selTrueOrFalseExamList.length > 0 && selQuestionExamList.length > 0 ?
                    ('四、' + mapExamName[4]) :
                    (selRadioExamList.length == 0 && selCheckboxExamList.length == 0 && selTrueOrFalseExamList.length == 0 ? '一、' + mapExamName[4] :
                      ((selRadioExamList.length > 0 && selCheckboxExamList.length == 0 && selTrueOrFalseExamList.length == 0) || (selRadioExamList.length == 0 && selCheckboxExamList.length > 0 && selTrueOrFalseExamList.length == 0) || (selRadioExamList.length == 0 && selCheckboxExamList.length == 0 && selTrueOrFalseExamList.length > 0) ? '二、' + mapExamName[4] :
                        ((selRadioExamList.length > 0 && selCheckboxExamList.length > 0 && selTrueOrFalseExamList.length == 0) || (selRadioExamList.length > 0 && selCheckboxExamList.length == 0 && selTrueOrFalseExamList.length > 0) || (selRadioExamList.length == 0 && selCheckboxExamList.length > 0 && selTrueOrFalseExamList.length > 0)) ? '三、' + mapExamName[4] : ''))
                }
                </div>
                <List
                  style={{width: '100%'}}
                  dataSource={selQuestionExamList}
                  renderItem={(temp3) =>
                    <List.Item style={{width: '100%'}}>
                      {temp3}
                    </List.Item>
                  }>
                </List>
              </div>

              <div style={{display: selBlankExamFlag ? 'block' : 'none'}}>
                <div>{
                  selRadioExamList.length > 0 && selCheckboxExamList.length > 0 && selTrueOrFalseExamList.length > 0 && selQuestionExamList.length > 0 && selBlankExamList.length > 0 ?
                    ('五、' + mapExamName[5]) :
                    (selRadioExamList.length == 0 && selCheckboxExamList.length == 0 && selTrueOrFalseExamList.length == 0 && selQuestionExamList.length == 0 ? '一、' + mapExamName[5] :
                      ((selRadioExamList.length > 0 && selCheckboxExamList.length == 0 && selTrueOrFalseExamList.length == 0 && selQuestionExamList.length == 0) || (selRadioExamList.length == 0 && selCheckboxExamList.length > 0 && selTrueOrFalseExamList.length == 0 && selQuestionExamList.length == 0) || (selRadioExamList.length == 0 && selCheckboxExamList.length == 0 && selTrueOrFalseExamList.length > 0 && selQuestionExamList.length == 0) || (selRadioExamList.length == 0 && selCheckboxExamList.length == 0 && selTrueOrFalseExamList.length == 0 && selQuestionExamList.length > 0) ? '二、' + mapExamName[5] :
                        ((selRadioExamList.length > 0 && selCheckboxExamList.length > 0 && selTrueOrFalseExamList.length == 0 && selQuestionExamList.length == 0)
                          || (selRadioExamList.length > 0 && selCheckboxExamList.length == 0 && selTrueOrFalseExamList.length > 0 && selQuestionExamList.length == 0)
                          || (selRadioExamList.length > 0 && selCheckboxExamList.length == 0 && selTrueOrFalseExamList.length == 0 && selQuestionExamList.length > 0)
                          || (selRadioExamList.length == 0 && selCheckboxExamList.length > 0 && selTrueOrFalseExamList.length > 0 && selQuestionExamList.length == 0)
                          || (selRadioExamList.length == 0 && selCheckboxExamList.length > 0 && selTrueOrFalseExamList.length == 0 && selQuestionExamList.length > 0)
                          || (selRadioExamList.length == 0 && selCheckboxExamList.length == 0 && selTrueOrFalseExamList.length > 0 && selQuestionExamList.length > 0)) ? '三、' + mapExamName[5] :
                          ((selRadioExamList.length > 0 && selCheckboxExamList.length > 0 && selTrueOrFalseExamList.length > 0 && selQuestionExamList.length == 0)
                          || (selRadioExamList.length > 0 && selCheckboxExamList.length == 0 && selTrueOrFalseExamList.length > 0 && selQuestionExamList.length > 0)
                          || (selRadioExamList.length > 0 && selCheckboxExamList.length > 0 && selTrueOrFalseExamList.length == 0 && selQuestionExamList.length > 0)
                          || (selRadioExamList.length == 0 && selCheckboxExamList.length > 0 && selTrueOrFalseExamList.length > 0 && selQuestionExamList.length > 0) ? '四、' + mapExamName[5] : '')))
                }</div>
                <List
                  style={{width: '100%'}}
                  dataSource={selBlankExamList}
                  renderItem={(temp4) =>
                    <List.Item style={{width: '100%'}}>
                      {temp4}
                    </List.Item>
                  }>
                </List>
              </div>
            </div>
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

        <ExamListModal examListVisible={examListVisible} getStockInfo={(e) => {this.examListMakeUp(e,getFieldDecorator)}}/>


      </div>
    )
  }
}

const NewPaperManualForm = Form.create({name: 'newPaperAutoForm'})(newPaperManual);

export default connect(state => ({
  ...state.newPaperManual,
  loading: state.loading.models.newPaperManual,
}))(NewPaperManualForm);
