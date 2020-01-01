import React from 'react';
import { Form, TreeSelect, Select, Input, Button, Icon,Upload } from 'antd';
import 'braft-editor/dist/index.css';
import getUserId from '@/utils/getUserId'
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
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
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
    const {dispatch} = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let { categoryId,difficultyLevel, examType,mark,examName,names,names1,result,examSolution } = values;
        let submitData;
        examName = examName.toHTML();
        examSolution = examSolution.toHTML()
        if(examType === 1 || examType === 2){
          let examAttrSaveQOList = []
          for(var i in names){
            let obj = {};
            obj.sort = letter[i];
            obj.attrName = names[i].toHTML();
            examAttrSaveQOList.push(obj);
          }
          submitData = {
            categoryId,difficultyLevel, examType,mark,
            examName,result,examSolution,examAttrSaveQOList,createStaffId:getUserId()
          }
        }
        if(examType === 3){
          submitData = {
            categoryId,difficultyLevel, examType,mark,
            examName,result,examSolution,examAttrSaveQOList:[{
              sort:'A',
              attrName:'是'
            },{
              sort:'B',
              attrName:'否'
            }]
            ,createStaffId:getUserId()
          }
        }
        if(examType === 4){
          submitData = {
            categoryId,difficultyLevel, examType,mark,
            examName,result:result.toHTML(),examSolution
            ,createStaffId:getUserId()
          }
        }
        if(examType === 5){
          submitData = {
            categoryId,difficultyLevel, examType,mark,
            examName,result:names1.join('@_@'),examSolution
            ,createStaffId:getUserId()
          }
        }
        dispatch({
          type:'questionEdit/examSave',
          payload:submitData
        })
      }
    });
  };
  componentWillReceiveProps(nextProps) {
    if (this.props.examDetail !== nextProps.examDetail) {
      this.setState({
        examType: nextProps.examDetail.examType || undefined,
      });
    }
  }
  componentDidMount () {

    // 异步设置编辑器内容
    setTimeout(() => {
      this.props.form.setFieldsValue({
        examName: BraftEditor.createEditorState('<p></p>')
      })
    }, 1000)

  }
  render() {
    const { examDetail, typeList, form, loading } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { examType } = this.state;
    const { categoryId, examName, difficultyLevel, mark, result, examSolution } = examDetail;

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
    const extendControls = [
      {
        key: 'antd-uploader',
        type: 'component',
        component: (
          <Upload
            accept="image/*"
            showUploadList={false}
            customRequest={this.uploadHandler}
          >
            {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
            <button type="button" className="control-item button upload-button" data-title="插入图片">
              <Icon type="picture" theme="filled" />
            </button>
          </Upload>
        )
      }
    ]
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItemEditors = keys.map((k, index) => (
      <Form.Item label={`选项${letter[index]}`} required={false} key={k} wrapperCol={{ span: 22 }}>
        {getFieldDecorator(`names[${k}]`, {
          rules: [
            {
              required: true,
              validator: (_, value, callback) => {
                if (value.isEmpty()) {
                  callback('请输入选项内容');
                } else {
                  callback();
                }
              },
            },
          ],
        })(
          <BraftEditor
            className={styles.editor}
            placeholder="请输入试题选项"
            extendControls={extendControls}
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
    ));

    getFieldDecorator('keys1', { initialValue: [] });
    const keys1 = getFieldValue('keys1');
    const formItemInput = keys1.map((k, index) => (
      <Form.Item label={'填空题答案'} required={false} key={k}>
        {getFieldDecorator(`names1[${k}]`, {
          rules: [
            {
              required: true,
              whitespace: true,
              message: "Please input passenger's name or delete this field.",
            },
          ],
        })(<Input placeholder="填空题答案" style={{ width: '60%', marginRight: 8 }} />)}
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
        <Form onSubmit={this.handleSubmit} labelCol={{ span: 2 }} style={{marginTop:'20px'}}>
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
              initialValue: examName,
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
              extendControls={extendControls}
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
                initialValue: result,
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
                extendControls={extendControls}
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
              initialValue: examSolution,
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
              extendControls={extendControls}

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
