import React from 'react';
import { Form, TreeSelect, Select, Input, Button, Icon, Upload } from 'antd';
import 'braft-editor/dist/index.css';
import getUserId from '@/utils/getUserId';
import BraftEditor from 'braft-editor';
import { connect } from 'dva';
import styles from './index.less';

const { TreeNode } = TreeSelect;
const { Option } = Select;
const letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
let id = 0;
let id1 = 0;

class QuestionEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      examType: undefined,
    };
  }

  handleSelectChange = e => {
    this.setState({
      examType: e,
    });
  };
  removeEditor = k => {
    const { form } = this.props;
    // can use data-binding to get
    let keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }
    keys = keys.filter(key => key !== k);

    // can use data-binding to set
    form.setFieldsValue({
      keys,
    });
  };

  addEditor = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };
  removeInput = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys1 = form.getFieldValue('keys1');
    // We need at least one passenger
    if (keys1.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys1: keys1.filter(key => key !== k),
    });
  };

  addInput = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys1 = form.getFieldValue('keys1');
    const nextKeys = keys1.concat(id1++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys1: nextKeys,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, examId } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {
          categoryId,
          difficultyLevel,
          examType,
          mark,
          examName,
          names,
          names1,
          result,
          examSolution,
        } = values;
        let submitData;
        examName = examName.toHTML();
        examSolution = examSolution.toHTML();
        if (examType === 1 || examType === 2) {
          let examAttrSaveQOList = [];
          for (var i in names) {
            let obj = {};
            obj.sort = letter[i];
            obj.attrName = names[i].toHTML();
            examAttrSaveQOList.push(obj);
          }
          submitData = {
            categoryId,
            difficultyLevel,
            examType,
            mark,
            examName,
            result,
            examSolution,
            examAttrSaveQOList,
            // createStaffId: getUserId(),
          };
        }
        if (examType === 3) {
          submitData = {
            categoryId,
            difficultyLevel,
            examType,
            mark,
            examName,
            result,
            examSolution,
            examAttrSaveQOList: [
              {
                sort: 'A',
                attrName: '是',
              },
              {
                sort: 'B',
                attrName: '否',
              },
            ],
            // createStaffId: getUserId(),
          };
        }
        if (examType === 4) {
          submitData = {
            categoryId,
            difficultyLevel,
            examType,
            mark,
            examName,
            result: result.toHTML(),
            examSolution,
            // createStaffId: getUserId(),
          };
        }
        if (examType === 5) {
          submitData = {
            categoryId,
            difficultyLevel,
            examType,
            mark,
            examName,
            result: names1.join('@_@'),
            examSolution,
            // createStaffId: getUserId(),
          };
        }
        if (examId) {
          dispatch({
            type: 'questionEdit/examUpdate',
            payload: Object.assign(submitData, { examId, modifyStaffId: getUserId() }),
          });
        } else {
          dispatch({
            type: 'questionEdit/examSave',
            payload: Object.assign(submitData, { examId, createStaffId: getUserId() }),
          });
        }
      }
    });
  };
  init = () => {
    const { dispatch, examId } = this.props;
    if (examId) {
      dispatch({
        type: 'questionEdit/examDetail',
        payload: {
          examId: examId,
        },
      });
    }
  };
  initEditor = nextProps => {};
  componentWillReceiveProps(nextProps) {
    if (this.props.examDetail !== nextProps.examDetail) {
      this.setState({
        examType: nextProps.examDetail.examType || undefined,
      });
      setTimeout(() => {
        if (nextProps.examDetail.examName) {
          this.props.form.setFieldsValue({
            examName: BraftEditor.createEditorState(nextProps.examDetail.examName),
            examSolution: BraftEditor.createEditorState(nextProps.examDetail.examSolution),
          });
          if (
            nextProps.examDetail.baseExamAttrVOList &&
            nextProps.examDetail.baseExamAttrVOList.length > 0
          ) {
            id = nextProps.examDetail.baseExamAttrVOList.length;
            for (let i in nextProps.examDetail.baseExamAttrVOList) {
              let val = nextProps.examDetail.baseExamAttrVOList[i].attrName;
              let obj = {};
              obj[`names[${i}]`] = BraftEditor.createEditorState(
                nextProps.examDetail.baseExamAttrVOList[i].attrName,
              );
              this.props.form.setFieldsValue(obj);
            }
          }
        }
      }, 0);
    }
  }
  componentDidMount() {
    this.init();
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      examId: '',
      examDetail: {},
      typeList: [],
    });
  }
  render() {
    const { examDetail, typeList, form, loading } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { examType } = this.state;
    let { categoryId, difficultyLevel, mark, result, baseExamAttrVOList } = examDetail;
    let keys = [];
    let names = [];
    let keys1 = [];
    let names1 = [];

    if (baseExamAttrVOList && baseExamAttrVOList.length > 0) {
      for (let i in baseExamAttrVOList) {
        keys.push(i);
        names.push(baseExamAttrVOList[i].attrName);
      }
    }
    if (examType === 5) {
      names1 = result.split('@_@');
      for (let i in names1) {
        keys1.push(i);
      }
    }
    // console.log(names1);
    const renderTreeNodes = data => {
      if (data) {
        return data.map(item => {
          if (item.childExamCategoryList) {
            return (
              <TreeNode
                value={item.categoryId}
                title={item.categoryName}
                key={`${item.categoryName}-${item.categoryId}-${item.floor}`}
                dataRef={item}
              >
                {renderTreeNodes(item.childExamCategoryList)}
              </TreeNode>
            );
          }
          return (
            <TreeNode
              value={item.categoryId}
              title={item.categoryName}
              key={`${item.categoryName}-${item.categoryId}-${item.floor}`}
              dataRef={item}
            />
          );
        });
      }
    };
    getFieldDecorator('keys', { initialValue: keys || [] });
    keys = getFieldValue('keys');
    const formItemEditors = keys.map((k, index) => {
      return (
        <Form.Item
          label={`选项${letter[index]}`}
          required={false}
          key={index}
          wrapperCol={{ span: 22 }}
        >
          {getFieldDecorator(`names[${k}]`)(
            <BraftEditor
              className={styles.editor}
              placeholder="请输入试题选项"
              style={{ border: '1px solid #d9d9d9' }}
            />,
          )}
          {keys.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              onClick={() => this.removeEditor(k)}
            />
          ) : null}
        </Form.Item>
      );
    });

    getFieldDecorator('keys1', { initialValue: keys1 || [] });
    keys1 = getFieldValue('keys1');
    console.log(keys1);
    const formItemInput = keys1.map((k, index) => (
      <Form.Item label={'填空题答案'} required={false} key={k}>
        {getFieldDecorator(`names1[${k}]`, { initialValue: names1[k] })(
          <Input placeholder="填空题答案" style={{ width: '60%', marginRight: 8 }} />,
        )}
        {keys1.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.removeInput(k)}
          />
        ) : null}
      </Form.Item>
    ));
    return (
      <div className={styles.box}>
        <Form onSubmit={this.handleSubmit} labelCol={{ span: 2 }} style={{ marginTop: '20px' }}>
          <Form.Item label="试题分类" wrapperCol={{ span: 4 }}>
            {getFieldDecorator('categoryId', {
              initialValue: categoryId,
              rules: [{ required: true, message: '请选择试题分类!' }],
            })(
              <TreeSelect
                showSearch
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="请选择试题分类!"
                allowClear
                onChange={this.treeChange}
              >
                {renderTreeNodes(typeList)}
              </TreeSelect>,
            )}
          </Form.Item>
          <Form.Item label="试题难度" wrapperCol={{ span: 4 }}>
            {getFieldDecorator('difficultyLevel', {
              initialValue: difficultyLevel,
              rules: [{ required: true, message: '请选择试题难度！' }],
            })(
              <Select placeholder="请选择试题难度！">
                <Option value={0}>易</Option>
                <Option value={1}>较易</Option>
                <Option value={2}>中等</Option>
                <Option value={3}>偏难</Option>
                <Option value={4}>难</Option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="试题类型" wrapperCol={{ span: 4 }}>
            {getFieldDecorator('examType', {
              initialValue: examType,
              rules: [{ required: true, message: '请选择试题类型！' }],
            })(
              <Select placeholder="请选择试题类型！" onChange={this.handleSelectChange}>
                <Option value={1}>单选题</Option>
                <Option value={2}>多选题</Option>
                <Option value={3}>判断题</Option>
                <Option value={4}>问答题</Option>
                <Option value={5}>填空题</Option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="试题分数" wrapperCol={{ span: 4 }}>
            {getFieldDecorator('mark', {
              initialValue: mark,
              rules: [{ required: true, message: '请输入试题分数!' }],
            })(<Input placeholder="请输入试题分数!" />)}
          </Form.Item>
          <Form.Item label="试题名称" wrapperCol={{ span: 22 }}>
            {getFieldDecorator('examName', {
              // initialValue: examName,
              rules: [
                {
                  required: true,
                  validator: (_, value, callback) => {
                    if (value.isEmpty()) {
                      callback('请输入试题名称');
                    } else {
                      callback();
                    }
                  },
                },
              ],
            })(
              <BraftEditor
                className={styles.editor}
                placeholder="请输入试题名称"
                style={{ border: '1px solid #d9d9d9' }}
              />,
            )}
          </Form.Item>
          {examType < 3 ? (
            <div>
              {formItemEditors}
              <Form.Item label="增加选项">
                <Button type="dashed" onClick={this.addEditor} style={{ width: '60%' }}>
                  <Icon type="plus" /> 点击增加
                </Button>
              </Form.Item>
            </div>
          ) : (
            ''
          )}

          {examType < 4 ? (
            <Form.Item label="试题答案:">
              {getFieldDecorator('result', {
                initialValue: result,
              })(<Input style={{ width: '120px' }} />)}
            </Form.Item>
          ) : examType === 4 ? (
            <Form.Item label="试题答案" wrapperCol={{ span: 22 }}>
              {getFieldDecorator('result', {
                // initialValue: result,
                rules: [
                  {
                    required: true,
                    validator: (_, value, callback) => {
                      if (value.isEmpty()) {
                        callback('请输入试题答案');
                      } else {
                        callback();
                      }
                    },
                  },
                ],
              })(
                <BraftEditor
                  className={styles.editor}
                  placeholder="请输入试题答案"
                  style={{ border: '1px solid #d9d9d9' }}
                />,
              )}
            </Form.Item>
          ) : (
            <div>
              {formItemInput}
              <Form.Item label="增加答案">
                <Button type="dashed" onClick={this.addInput} style={{ width: '60%' }}>
                  <Icon type="plus" /> 点击增加
                </Button>
              </Form.Item>
            </div>
          )}

          <Form.Item label="试题讲解" wrapperCol={{ span: 22 }}>
            {getFieldDecorator('examSolution', {
              // initialValue: examSolution,
              rules: [
                {
                  required: true,
                  validator: (_, value, callback) => {
                    if (value.isEmpty()) {
                      callback('请输入试题讲解');
                    } else {
                      callback();
                    }
                  },
                },
              ],
            })(
              <BraftEditor
                className={styles.editor}
                placeholder="请输入试题讲解"
                style={{ border: '1px solid #d9d9d9' }}
              />,
            )}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={loading}>
              下一步
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const QuestionEditForm = Form.create({ name: 'QuestionEditForm' })(QuestionEdit);

export default connect(state => ({
  ...state.questionEdit,
  loading: state.loading.models.questionEdit,
}))(QuestionEditForm);
