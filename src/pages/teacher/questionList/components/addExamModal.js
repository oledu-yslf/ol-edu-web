import React from 'react';
import {Modal, Form, Input, Row, Col, Select, Radio, Checkbox, Spin} from 'antd';
import {connect} from 'dva';
import getUserId from '@/utils/getUserId';
import OlBraftEditor from '@/components/olBraftEditor/OlBraftEditor'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import {Editor, EditorState} from 'draft-js'

const {Option} = Select;

const selectAttrList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

class AddExamModal extends React.Component {
  constructor(props) {
    super(props);
  }

  handleChangeExamType = (value) => {
  }

  handleCommit = e => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {dispatch, selectedNodes, form, examDetail} = this.props;

        let payload = {};

        let baseExamAttrVOList = [];

        if (values.examType == '1' || values.examType =='2'){
          selectAttrList.map((item) => {
            if (values[item] instanceof EditorState) {
              baseExamAttrVOList.push(
                {
                  "sort": item,
                  "attrName": values[item].toHTML()
                }
              )
            }
          })
        } else if (values.examType == '3'){
          baseExamAttrVOList.push(
            {
              "sort": 'A',
              "attrName": "是"
            }
          );

          baseExamAttrVOList.push(
            {
              "sort": 'B',
              "attrName": "否"
            }
          )
        }


        payload.examAttrSaveQOList = baseExamAttrVOList;
        payload.categoryId = selectedNodes.categoryId;
        payload.examType = values.examType;
        payload.difficultyLevel = values.difficultyLevel;
        payload.examName = values.examName.toHTML();
        payload.mark = values.mark;
        if (values.examSolution instanceof EditorState) {
          payload.examSolution = values.examSolution.toHTML();
        }

        if (payload.examType == '4' || payload.examType == '5') {
          if (values.result instanceof EditorState) {
            payload.result = values.result.toHTML();
          }
        } else {
          if (values.result != null && values.result.length > 0) {
            payload.result = values.result;
          }
        }

        const staffId = getUserId();
        if (examDetail && examDetail.examId) {
          dispatch({
            type: 'questionList/updateExam',
            payload: {
              ...payload,
              "modifyStaffId": staffId,
              "examId": examDetail.examId
            }
          });
        } else {
          dispatch({
            type: 'questionList/saveExam',
            payload: {
              ...payload,
              "createStaffId": staffId,
            }
          });
        }
      }
    })
  };
  handleCancel = e => {
    const {dispatch} = this.props;
    dispatch({
      type: 'questionList/save',
      payload: {
        addExamVisible: false,
      },
    });
  };

  //渲染单选和多选选项
  initSelectOption = (select, examDetail) => {
    if (examDetail != null && examDetail.baseExamAttrVOList != null) {
      for (let i in examDetail.baseExamAttrVOList) {
        let examAttr = examDetail.baseExamAttrVOList[i];
        if (examAttr.sort.toUpperCase() === select.toUpperCase()) {
          return BraftEditor.createEditorState(examAttr.attrName);
        }
      }
    }

    return '';
  }

  renderExamAttr = (examDetail) => {
    const {getFieldValue} = this.props.form;
    let examType = getFieldValue(`examType`);
    if (examType === 1 || examType === 2) {
      return this.renderSingalMulExamAttr(examDetail);
    } else if (examType === 3) {
      return this.renderJudgeExamAttr(examDetail)
    }
  }
  renderJudgeExamAttr = (examDetail) => {
    return null;
  }
  renderSingalMulExamAttr = (examDetail) => {
    const {getFieldDecorator} = this.props.form;

    return (<Row gutter={[16, 16]}>
      {
        selectAttrList.map((item) => {
          return (
            <Col span={12}>
              <Form.Item label="">
                <span value={item}>{item}</span>
                {getFieldDecorator(item, {initialValue: this.initSelectOption(item, examDetail)})(
                  <OlBraftEditor
                    contentStyle={{height: 150, overflow: 'scroll'}}
                  />
                )}
              </Form.Item>
            </Col>)
        })
      }
    </Row>)
  }

  renderResult = (examDetail) => {
    const {getFieldDecorator, getFieldValue} = this.props.form;
    let examType = getFieldValue(`examType`);


    return (<Form.Item label="正确答案">
      {
        (examType == 4 || examType == 5) ? getFieldDecorator('result', {initialValue: examDetail && examDetail.result ? BraftEditor.createEditorState(examDetail.result) : ''})(
          <OlBraftEditor
            contentStyle={{height: 150, overflow: 'scroll'}}
          />
        ) :
          getFieldDecorator('result', {initialValue: examDetail ? examDetail.result : ''})(
            <input placeholder={examType == 3 ? '请输入：是/否' : ''}/>
          )
      }
    </Form.Item>)
  }

  render() {

    const {addExamVisible, loading, form, selectedNodes, examDetail} = this.props;
    const {getFieldDecorator, getFieldValue} = form;
    const {categoryName} = selectedNodes;

    let values = form.getFieldsValue();

    return (
      <Modal
        title="新增/编辑试题"
        width='90%'
        visible={addExamVisible}
        onCancel={this.handleCancel}
        onOk={this.handleCommit}
        confirmLoading={loading}
        destroyOnClose
      >
        <Spin spinning={loading}>
          <Form layout="vertical">
            <Form.Item label="试题分类" labelCol={{span: 3, offset: 1}}>
              {getFieldDecorator('examTitle',)(
                <span>{categoryName}</span>)}
            </Form.Item>
            <Form.Item label="试题名称" labelCol={{span: 3, offset: 1}}>
              {getFieldDecorator('examName', {
                initialValue: BraftEditor.createEditorState(examDetail ? examDetail.examName : ''),
                rules: [
                  {
                    required: true,
                    validator: (_, value, callback) => {
                      if (value.isEmpty()) {
                        callback('请输入试题名称!')
                      } else {
                        callback()
                      }
                    },

                  }
                ],
              })(<OlBraftEditor
                contentStyle={{height: 150, overflow: 'scroll'}}
              />)}
            </Form.Item>
            <Row>
              <Col span={8}>
                <Form.Item label="试题难度" labelCol={{span: 6, offset: 2}}>
                  {getFieldDecorator(`difficultyLevel`, {
                    initialValue: examDetail ? examDetail.difficultyLevel : '',
                    rules: [
                      {
                        required: true,
                        message: '请选择试题难度!',
                      }
                    ],
                  })(
                    <Select placeholder="请选择试题难度！" style={{width: '80%'}}>

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
                  {getFieldDecorator(`examType`, {
                    initialValue: examDetail ? examDetail.examType : '',
                    rules: [
                      {
                        required: true,
                        message: '请选择试题类型!',
                      }
                    ],
                  })(
                    <Select placeholder="请选择试题类型！" onChange={this.handleChangeExamType} style={{width: '80%'}}>

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
                  {getFieldDecorator(`mark`, {
                    initialValue: examDetail ? examDetail.mark : '',
                    rules: [
                      {
                        required: true,
                        message: '请输入分数!',
                      },
                      {pattern: new RegExp("^[0-9]*$"), message: '请输入数字!'},
                    ],
                  })(
                    <Input style={{width: '80%'}}/>,
                  )}
                </Form.Item>
              </Col>
            </Row>

            {this.renderExamAttr(examDetail)}

            <Row>
              <Col span={24}>
                {this.renderResult(examDetail)}
              </Col>
              <Col span={24}>
                <Form.Item label="试题解析">
                  {getFieldDecorator('examSolution', {initialValue: examDetail && examDetail.examSolution ? BraftEditor.createEditorState(examDetail.examSolution) : ''})(
                    <OlBraftEditor
                      contentStyle={{height: 150, overflow: 'scroll'}}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
    );
  }
}

const AddExamForm = Form.create({name: 'AddExamForm'})(AddExamModal);

export default connect(state => ({
  ...state.questionList,
  loading: state.loading.models.questionList,
}))(AddExamForm);
