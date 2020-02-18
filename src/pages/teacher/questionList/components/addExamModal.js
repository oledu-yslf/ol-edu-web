import React from 'react';
import { Modal, Form, Input,Row,Col,Select,Radio,Checkbox } from 'antd';
import { connect } from 'dva';
import getUserId from '@/utils/getUserId';
import OlBraftEditor from '@/components/olBraftEditor/OlBraftEditor'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'

const { Option } = Select;
class AddExamModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editorState: null,
      singleChoiceVisible:false,
      multiChoiceVisible:false,
      trueOrFalseVisible:false,
      fillInBlanksVisible:false,
      questionAndAnswerVisible:false,
    }
  }


  // submitContent = async () => {
  //   // 在编辑器获得焦点时按下ctrl+s会执行此方法
  //   // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
  //   const htmlContent = this.state.editorState.toHTML()
  //   const result = await saveEditorContent(htmlContent)
  // }

  handleEditorChange = (editorState) => {
    // console.log(editorState)
    // this.setState({ editorState })
  }

  handleChangeExamType = (values)=>{
    debugger
    switch (values){
      case 1:
        this.setState({
          singleChoiceVisible:true,
          multiChoiceVisible:false,
          trueOrFalseVisible:false,
          fillInBlanksVisible:false,
          questionAndAnswerVisible:false,
        })
            break
      case 2:
        this.setState({
          singleChoiceVisible:false,
          multiChoiceVisible:true,
          trueOrFalseVisible:false,
          fillInBlanksVisible:false,
          questionAndAnswerVisible:false,
        })
        break
      case 3:
        this.setState({
          singleChoiceVisible:false,
          multiChoiceVisible:false,
          trueOrFalseVisible:true,
          fillInBlanksVisible:false,
          questionAndAnswerVisible:false,
        })
        break
      case 4:
        this.setState({
          singleChoiceVisible:false,
          multiChoiceVisible:false,
          trueOrFalseVisible:false,
          fillInBlanksVisible:false,
          questionAndAnswerVisible:true,
        })
        break
      case 5:
        this.setState({
          singleChoiceVisible:false,
          multiChoiceVisible:false,
          trueOrFalseVisible:false,
          fillInBlanksVisible:true,
          questionAndAnswerVisible:false,
        })
        break

    }
  }
  changeCheckBox = e=>{
    let temp = e.join()
    if(temp){
      this.props.form.setFieldsValue({ 'result': temp.replace(/,/g, "") })
    }

  }
  changeTFRadio = e=>{
    if(e.target.value=='1'){
      this.props.form.setFieldsValue({ 'result': '是' })
    }else{
      this.props.form.setFieldsValue({ 'result': '否' })
    }
  }
  changeRadio = e => {
    switch (parseInt(e.target.value)){
      case 1:
        this.props.form.setFieldsValue({ 'result': 'A' })
        break;
      case 2:
        this.props.form.setFieldsValue({ 'result': 'B' })
        break;
      case 3:
        this.props.form.setFieldsValue({ 'result': 'C' })
        break;
      case 4:
        this.props.form.setFieldsValue({ 'result': 'D' })
        break;
      case 5:
        this.props.form.setFieldsValue({ 'result': 'E' })
        break;
      case 6:
        this.props.form.setFieldsValue({ 'result': 'F' })
        break;
      case 7:
        this.props.form.setFieldsValue({ 'result': 'G' })
        break;
      case 8:
        this.props.form.setFieldsValue({ 'result': 'H' })
        break;
    }
  };


  handleTypeEdit = e => {
    const { dispatch, selectedNodes, form, examDetail } = this.props;
    const { resetFields } = form;

    const getValues = this.props.form.getFieldsValue();

    let baseExamAttrVOList = [];
    // const examName = this.props.form.getFieldsValue().examName;
    if(this.props.form.getFieldsValue().examType=='1'||this.props.form.getFieldsValue().examType=='2'){
      if(this.props.form.getFieldsValue().attrName1){
        baseExamAttrVOList.push(
          {
            "sort": "A",
            "attrName": this.props.form.getFieldsValue().attrName1.toHTML()
          }
        )
      }
      if(this.props.form.getFieldsValue().attrName2){
        baseExamAttrVOList.push(
          {
            "sort": "B",
            "attrName": this.props.form.getFieldsValue().attrName2.toHTML()
          }
        )
      }
      if(this.props.form.getFieldsValue().attrName3){
        baseExamAttrVOList.push(
          {
            "sort": "C",
            "attrName": this.props.form.getFieldsValue().attrName3.toHTML()
          }
        )
      }
      if(this.props.form.getFieldsValue().attrName4){
        baseExamAttrVOList.push(
          {
            "sort": "D",
            "attrName": this.props.form.getFieldsValue().attrName4.toHTML()
          }
        )
      }
      if(this.props.form.getFieldsValue().attrName5){
        baseExamAttrVOList.push(
          {
            "sort": "E",
            "attrName": this.props.form.getFieldsValue().attrName5.toHTML()
          }
        )
      }
      if(this.props.form.getFieldsValue().attrName6){
        baseExamAttrVOList.push(
          {
            "sort": "F",
            "attrName": this.props.form.getFieldsValue().attrName6.toHTML()
          }
        )
      }
      if(this.props.form.getFieldsValue().attrName7){
        baseExamAttrVOList.push(
          {
            "sort": "G",
            "attrName": this.props.form.getFieldsValue().attrName7.toHTML()
          }
        )
      }
      if(this.props.form.getFieldsValue().attrName8){
        baseExamAttrVOList.push(
          {
            "sort": "H",
            "attrName": this.props.form.getFieldsValue().attrName8.toHTML()
          }
        )
      }

      getValues.baseExamAttrVOList = baseExamAttrVOList

    }

    if(this.props.form.getFieldsValue().examType=='4') {
      if(this.props.form.getFieldsValue().result){
        getValues.result = this.props.form.getFieldsValue().result.toHTML()
      }
    }

    if(this.props.form.getFieldsValue().examType=='5'){
       let result =
        (this.props.form.getFieldsValue().attrName1?this.props.form.getFieldsValue().attrName1+'@_@':'')+
        (this.props.form.getFieldsValue().attrName2?this.props.form.getFieldsValue().attrName2+'@_@':'')+
        (this.props.form.getFieldsValue().attrName3?this.props.form.getFieldsValue().attrName3+'@_@':'')+
        (this.props.form.getFieldsValue().attrName4?this.props.form.getFieldsValue().attrName4+'@_@':'')+
        (this.props.form.getFieldsValue().attrName5?this.props.form.getFieldsValue().attrName5+'@_@':'')+
        (this.props.form.getFieldsValue().attrName6?this.props.form.getFieldsValue().attrName6:'')
      getValues.result = result
    }

    if(this.props.form.getFieldsValue().examSolution){
      getValues.examSolution = this.props.form.getFieldsValue().examSolution.toHTML()
    }
    if(this.props.form.getFieldsValue().examName){
      getValues.examName = this.props.form.getFieldsValue().examName.toHTML()
    }

    console.log(getValues)

    const modifyStaffId = getUserId();
    form.validateFields((err, value) => {
      if (!err) {
        debugger
        if(examDetail && examDetail.examId){
          dispatch({
            type: 'questionList/updateExam',
            payload:{
              "categoryId":selectedNodes.categoryId,
              "examType":getValues.examType,
              "difficultyLevel":getValues.difficultyLevel,
              "examName":getValues.examName,
              "mark":getValues.mark,
              "modifyStaffId":modifyStaffId,
              "examSolution":getValues.examSolution,
              "result":getValues.result,
              "examAttrSaveQOList":getValues.baseExamAttrVOList,
              "examId":examDetail.examId
            }
          });
        }else{
          dispatch({
            type: 'questionList/saveExam',
            payload:{
              "categoryId":selectedNodes.categoryId,
              "examType":getValues.examType,
              "difficultyLevel":getValues.difficultyLevel,
              "examName":getValues.examName,
              "mark":getValues.mark,
              "createStaffId":modifyStaffId,
              "examSolution":getValues.examSolution,
              "result":getValues.result,
              "examAttrSaveQOList":getValues.baseExamAttrVOList,
            }
          });
        }
        this.props.form.resetFields();
        this.setState({
          singleChoiceVisible:false,
          multiChoiceVisible:false,
          trueOrFalseVisible:false,
          fillInBlanksVisible:false,
          questionAndAnswerVisible:false,
        })
      }
    });
  };
  handleCancel = e => {
    // addExamVisible
    const { dispatch } = this.props;
    dispatch({
      type: 'questionList/save',
      payload: {
        addExamVisible: false,
      },
    });
  };
  render() {
    const {
      editorState,
      examName,
      attrName1,
      singleChoiceVisible,
      multiChoiceVisible
    } = this.state

    const { addExamVisible, loading, form,selectedNodes,examDetail } = this.props;
    const { getFieldDecorator } = form;
    const { categoryName } = selectedNodes

    // if(examDetail && examDetail.difficultyLevel){
    //
    //   this.handleChangeExamType(examDetail.difficultyLevel)
    // }





    return (
      <Modal
        title="新增/编辑试题"
        width={1000}
        visible={addExamVisible}
        onCancel={this.handleCancel}
        onOk={this.handleTypeEdit}
        confirmLoading={loading}
      >
        <Form layout="vertical">
          <Form.Item label="试题分类" labelCol={{span: 3, offset: 1}}>
            {getFieldDecorator('examTitle',{initialValue:categoryName?categoryName:'' }, {
          })(<span>{categoryName}</span>)}
          </Form.Item>
          <Form.Item label="试题名称" labelCol={{span: 3, offset: 1}}>
            {getFieldDecorator('examName',{initialValue:BraftEditor.createEditorState(examDetail?examDetail.examName:'')},  {
              rules: [
                {
                  required: true,
                  message: '请输入试题名称!',
                }
              ],
            })(<OlBraftEditor
              contentStyle={{height:150,overflow:'scroll'}}
              onChange={this.handleEditorChange}
            />)}
          </Form.Item>
          <Row>
            <Col span={8}>
              <Form.Item label="试题难度" labelCol={{span: 6, offset: 2}}>
                {getFieldDecorator(`difficultyLevel`, {initialValue:examDetail?examDetail.difficultyLevel:'' },{
                  rules: [
                    {
                      required: true,
                      message: '请选择试题难度!',
                    }
                  ],
                })(
                  <Select placeholder="请选择试题难度！" style={{width:'80%'}}>
                    <Option value={''}>全部</Option>
                    <Option value={0}>易</Option>
                    <Option value={1}>较易</Option>
                    <Option value={2}>中等</Option>
                    <Option value={3}>偏难</Option>
                    <Option value={4}>难</Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="试题类型" labelCol={{span: 6, offset: 2}}>
                {getFieldDecorator(`examType`, {initialValue:examDetail?examDetail.examType:'' },{
                  rules: [
                    {
                      required: true,
                      message: '请选择试题类型!',
                    }
                  ],
                })(
                  <Select placeholder="请选择试题类型！" onChange ={this.handleChangeExamType}  style={{width:'80%'}}>
                    <Option value={''}>全部</Option>
                    <Option value={1}>单选题</Option>
                    <Option value={2}>多选题</Option>
                    <Option value={3}>判断题</Option>
                    <Option value={4}>问答题</Option>
                    <Option value={5}>填空题</Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="试题分数" labelCol={{span: 6, offset: 1}}>
                {getFieldDecorator(`mark`,  {initialValue:examDetail?examDetail.mark:'' },{
                  rules: [
                    {
                      required: true,
                      message: '请输入分数!',
                    }
                  ],
                })(
                  <Input  style={{width:'80%'}}/>,
                )}
              </Form.Item>
            </Col>
          </Row>

          {/* 单选题 */}
          {(this.state.singleChoiceVisible||(examDetail&&examDetail.examType=='1'))?
            <Radio.Group name="radiogroup" onChange={this.changeRadio}>
              <Form.Item label="">
                <Radio value={'1'}>A</Radio>
                {getFieldDecorator('attrName1',{initialValue:examDetail&&examDetail.baseExamAttrVOList[0]?BraftEditor.createEditorState(examDetail.baseExamAttrVOList[0].attrName):'' })(
                  <OlBraftEditor
                    contentStyle={{height:150,overflow:'scroll'}}
                    onChange={this.handleEditorChange}
                  />
                )}
              </Form.Item>
              <Form.Item label="">
                <Radio value={'2'}>B</Radio>
                {getFieldDecorator('attrName2',{initialValue:examDetail&&examDetail.baseExamAttrVOList[1]?BraftEditor.createEditorState(examDetail.baseExamAttrVOList[1].attrName):'' })(
                  <OlBraftEditor
                    contentStyle={{height:150,overflow:'scroll'}}
                    onChange={this.handleEditorChange}
                  />
                )}
              </Form.Item>
              <Form.Item label="">
                <Radio value={'3'}>C</Radio>
                {getFieldDecorator('attrName3',{initialValue:examDetail&&examDetail.baseExamAttrVOList[2]?BraftEditor.createEditorState(examDetail.baseExamAttrVOList[2].attrName):'' })(
                  <OlBraftEditor
                    contentStyle={{height:150,overflow:'scroll'}}
                    onChange={this.handleEditorChange}
                  />
                )}
              </Form.Item>
              <Form.Item label="">
                <Radio value={'4'}>D</Radio>
                {getFieldDecorator('attrName4',{initialValue:examDetail&&examDetail.baseExamAttrVOList[3]?BraftEditor.createEditorState(examDetail.baseExamAttrVOList[3].attrName):'' })(
                  <OlBraftEditor
                    contentStyle={{height:150,overflow:'scroll'}}
                    onChange={this.handleEditorChange}
                  />
                )}
              </Form.Item>
              <Form.Item label="">
                <Radio value={'5'}>E</Radio>
                {getFieldDecorator('attrName5',{initialValue:examDetail&&examDetail.baseExamAttrVOList[4]?BraftEditor.createEditorState(examDetail.baseExamAttrVOList[4].attrName):'' })(
                  <OlBraftEditor
                    contentStyle={{height:150,overflow:'scroll'}}
                    onChange={this.handleEditorChange}
                  />
                )}
              </Form.Item>
              <Form.Item label="">
                <Radio value={'6'}>F</Radio>
                {getFieldDecorator('attrName6',{initialValue:examDetail&&examDetail.baseExamAttrVOList[5]?BraftEditor.createEditorState(examDetail.baseExamAttrVOList[5].attrName):'' })(
                  <OlBraftEditor
                    contentStyle={{height:150,overflow:'scroll'}}
                    onChange={this.handleEditorChange}
                  />
                )}
              </Form.Item>
              <Form.Item label="">
                <Radio value={'7'}>G</Radio>
                {getFieldDecorator('attrName7',{initialValue:examDetail&&examDetail.baseExamAttrVOList[6]?BraftEditor.createEditorState(examDetail.baseExamAttrVOList[6].attrName):'' })(
                  <OlBraftEditor
                    contentStyle={{height:150,overflow:'scroll'}}
                    onChange={this.handleEditorChange}
                  />
                )}
              </Form.Item>
              <Form.Item label="">
                <Radio value={'8'}>H</Radio>
                {getFieldDecorator('attrName8',{initialValue:examDetail&&examDetail.baseExamAttrVOList[7]?BraftEditor.createEditorState(examDetail.baseExamAttrVOList[7].attrName):'' })(
                  <OlBraftEditor
                    contentStyle={{height:150,overflow:'scroll'}}
                    onChange={this.handleEditorChange}
                  />
                )}
              </Form.Item>

              <Form.Item label="正确答案">
                {getFieldDecorator('result',{initialValue:examDetail?examDetail.result:''})(
                  <input/>
                )}
              </Form.Item>

              <Form.Item label="试题解析">
                {getFieldDecorator('examSolution',{initialValue:examDetail&&examDetail.examSolution?BraftEditor.createEditorState(examDetail.examSolution):'' })(
                  <OlBraftEditor
                    contentStyle={{height:150,overflow:'scroll'}}
                    onChange={this.handleEditorChange}

                  />
                )}
              </Form.Item>
            </Radio.Group>
            :null}
          {/* 多选题 */}
          {(this.state.multiChoiceVisible||(examDetail&&examDetail.examType=='2'))?
            <div>
            <Checkbox.Group onChange={this.changeCheckBox}>
            <Form.Item label="">
              <Checkbox value={'A'}>A</Checkbox>
              {getFieldDecorator('attrName1',{initialValue:examDetail&&examDetail.baseExamAttrVOList[0]?BraftEditor.createEditorState(examDetail.baseExamAttrVOList[0].attrName):'' })(
                <OlBraftEditor
                  contentStyle={{height:150,overflow:'scroll'}}
                  onChange={this.handleEditorChange}
                />

              )}
            </Form.Item>
            <Form.Item label="">
              <Checkbox value={'B'}>B</Checkbox>
          {getFieldDecorator('attrName2',{initialValue:examDetail&&examDetail.baseExamAttrVOList[1]?BraftEditor.createEditorState(examDetail.baseExamAttrVOList[1].attrName):'' })(
            <OlBraftEditor
            contentStyle={{height:150,overflow:'scroll'}}
            onChange={this.handleEditorChange}
            />
            )}
            </Form.Item>
            <Form.Item label="">
            <Checkbox value={'C'}>C</Checkbox>
          {getFieldDecorator('attrName3',{initialValue:examDetail&&examDetail.baseExamAttrVOList[2]?BraftEditor.createEditorState(examDetail.baseExamAttrVOList[2].attrName):'' })(
            <OlBraftEditor
            contentStyle={{height:150,overflow:'scroll'}}
            onChange={this.handleEditorChange}
            />
            )}
            </Form.Item>
            <Form.Item label="">
            <Checkbox value={'D'}>D</Checkbox>
          {getFieldDecorator('attrName4',{initialValue:examDetail&&examDetail.baseExamAttrVOList[3]?BraftEditor.createEditorState(examDetail.baseExamAttrVOList[3].attrName):'' })(
            <OlBraftEditor
            contentStyle={{height:150,overflow:'scroll'}}
            onChange={this.handleEditorChange}
            />
            )}
            </Form.Item>
            <Form.Item label="">
            <Checkbox value={'E'}>E</Checkbox>
          {getFieldDecorator('attrName5',{initialValue:examDetail&&examDetail.baseExamAttrVOList[4]?BraftEditor.createEditorState(examDetail.baseExamAttrVOList[4].attrName):'' })(
            <OlBraftEditor
            contentStyle={{height:150,overflow:'scroll'}}
            onChange={this.handleEditorChange}
            />
            )}
            </Form.Item>
            <Form.Item label="">
            <Checkbox value={'F'}>F</Checkbox>
          {getFieldDecorator('attrName6',{initialValue:examDetail&&examDetail.baseExamAttrVOList[5]?BraftEditor.createEditorState(examDetail.baseExamAttrVOList[5].attrName):'' })(
            <OlBraftEditor
            contentStyle={{height:150,overflow:'scroll'}}
            onChange={this.handleEditorChange}
            />
            )}
            </Form.Item>
            <Form.Item label="">
            <Checkbox value={'G'}>G</Checkbox>
          {getFieldDecorator('attrName7',{initialValue:examDetail&&examDetail.baseExamAttrVOList[6]?BraftEditor.createEditorState(examDetail.baseExamAttrVOList[6].attrName):'' })(
            <OlBraftEditor
            contentStyle={{height:150,overflow:'scroll'}}
            onChange={this.handleEditorChange}
            />
            )}
            </Form.Item>
            <Form.Item label="">
            <Checkbox value={'H'}>H</Checkbox>
          {getFieldDecorator('attrName8',{initialValue:examDetail&&examDetail.baseExamAttrVOList[7]?BraftEditor.createEditorState(examDetail.baseExamAttrVOList[7].attrName):'' })(
            <OlBraftEditor
            contentStyle={{height:150,overflow:'scroll'}}
            onChange={this.handleEditorChange}
            />
            )}
            </Form.Item>
            </Checkbox.Group>

            <Form.Item label="正确答案">
            {getFieldDecorator('result',{initialValue:examDetail?examDetail.result:''})(
              <input

              />
            )}
            </Form.Item>

            <Form.Item label="试题解析">
            {getFieldDecorator('examSolution',{initialValue:examDetail&&examDetail.examSolution?BraftEditor.createEditorState(examDetail.examSolution):'' })(
              <OlBraftEditor
                contentStyle={{height:150,overflow:'scroll'}}
                onChange={this.handleEditorChange}

              />
            )}
            </Form.Item>
            </div>
            :null}
          {/* 判断题 */}
          {(this.state.trueOrFalseVisible||(examDetail&&examDetail.examType=='3'))?
            <div>
              <Radio.Group name="trueOrfalseGroup" onChange={this.changeTFRadio}>
                <Form.Item label="">
                    <Radio value={'1'}>是</Radio>
                </Form.Item>
                <Form.Item label="">
                    <Radio value={'0'}>否</Radio>
                </Form.Item>
              </Radio.Group>

              <Form.Item label="正确答案">
                {getFieldDecorator('result',{initialValue:examDetail?examDetail.result:''})(
                  <input />
                )}
              </Form.Item>

              <Form.Item label="试题解析">
                {getFieldDecorator('examSolution',{initialValue:examDetail&&examDetail.examSolution?BraftEditor.createEditorState(examDetail.examSolution):'' })(
                  <OlBraftEditor
                    contentStyle={{height:150,overflow:'scroll'}}
                    onChange={this.handleEditorChange}
                  />
                )}
              </Form.Item>
            </div>
            :null}
          {/* 填空题 */}
          {(this.state.fillInBlanksVisible||(examDetail&&examDetail.examType=='5'))?
            <Row>
              <Col span={18} offset={1}>正确答案：</Col>
              <Col span={18} offset={3}>
                <Form.Item label="">
                  {getFieldDecorator('attrName1',{initialValue:(examDetail&&examDetail.result)?(examDetail.result.split("@_@")[0]?examDetail.result.split("@_@")[0]:''):''})(
                    <input style={{width:'100%'}}></input>
                  )}
                </Form.Item>
                <Form.Item label="">
                  {getFieldDecorator('attrName2',{initialValue:(examDetail&&examDetail.result)?(examDetail.result.split("@_@")[0]?examDetail.result.split("@_@")[1]:''):''})(
                    <input style={{width:'100%'}}></input>
                  )}
                </Form.Item>
                <Form.Item label="">
                  {getFieldDecorator('attrName3',{initialValue:(examDetail&&examDetail.result)?(examDetail.result.split("@_@")[0]?examDetail.result.split("@_@")[2]:''):''})(
                    <input style={{width:'100%'}}></input>
                  )}
                </Form.Item>
                <Form.Item label="">
                  {getFieldDecorator('attrName4',{initialValue:(examDetail&&examDetail.result)?(examDetail.result.split("@_@")[0]?examDetail.result.split("@_@")[3]:''):''})(
                    <input style={{width:'100%'}}></input>
                  )}
                </Form.Item>
                <Form.Item label="">
                  {getFieldDecorator('attrName5',{initialValue:(examDetail&&examDetail.result)?(examDetail.result.split("@_@")[0]?examDetail.result.split("@_@")[4]:''):''})(
                    <input style={{width:'100%'}}></input>
                  )}
                </Form.Item>
                <Form.Item label="">
                  {getFieldDecorator('attrName6',{initialValue:(examDetail&&examDetail.result)?(examDetail.result.split("@_@")[0]?examDetail.result.split("@_@")[5]:''):''})(
                    <input style={{width:'100%'}}></input>
                  )}
                </Form.Item>
              </Col>
            </Row>
            :null}
          {/* 问答题 */}
          {(this.state.questionAndAnswerVisible||(examDetail&&examDetail.examType=='4'))?
            <Form.Item label="正确答案">
              {getFieldDecorator('result',{initialValue:examDetail&&examDetail.result?BraftEditor.createEditorState(examDetail.result):'' })(
                <OlBraftEditor
                  contentStyle={{height:150,overflow:'scroll'}}
                  onChange={this.handleEditorChange}
                />
              )}
            </Form.Item>
            :null}

        </Form>
      </Modal>
    );
  }
}

const AddExamForm = Form.create({ name: 'editTypeForm' })(AddExamModal);

export default connect(state => ({
  ...state.questionList,
  loading: state.loading.models.questionList,
}))(AddExamForm);
