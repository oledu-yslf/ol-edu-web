import React from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Form, Input, Icon, Select, Button, TreeSelect, Row, Col } from 'antd';
import getUserId from '@/utils/getUserId';

const { Option } = Select;
const { TreeNode } = TreeSelect;

let id = 1;

class newPaperAuto extends React.Component {
  removeForm = k => {
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

  addForm = () => {
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
  treeChange = e =>{
    const { form } = this.props;
    console.log(form.getFieldValue())
  }
  handleSubmit = e => {
    
    e.preventDefault();
    const {form,paperId,dispatch} = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const { keys, names } = values;
        console.log(
          'Merged values:',
          keys.map(key => names[key]),
        );
        let randExamCateogries= [];
        console.log(names);
        for(let i=0;i<names.length;i++){
          let obj = {};
          obj.randExams = [];
          let objinner = {};
          obj.categoryId = names[i].categoryId || '';
          objinner.difficultyLevel = names[i].difficultyLevel|| '';
          objinner.examType = names[i].examType || '';
          objinner.randNum = names[i].randNum;
          obj.randExams.push(objinner);
          randExamCateogries.push(obj);
        }
        debugger;
        dispatch({
          type:'newPaperAuto/paperExamRand',
          payload:{
            randExamCateogries,createStaffId:getUserId(),paperId
          }
        })
      }
    });
  };
  render() {
    const { form, typeList, loading } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
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
    getFieldDecorator('keys', { initialValue: [0] });
    const keys = getFieldValue('keys');
    const formItem = keys.map((k, index) => {
      return (
        <Row key={k} gutter={24}>
          <Col span={5}>
            <Form.Item label="试题分类">
              {getFieldDecorator(`names[${k}].categoryId`, {
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
          </Col>
          <Col span={5}>
            <Form.Item label="试题类型">
              {getFieldDecorator(`names[${k}].examType`, {
              })(
                <Select placeholder="请选择试题类型！">
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
          <Col span={5}>
            <Form.Item label="试题难度">
              {getFieldDecorator(`names[${k}].difficultyLevel`, {
              })(
                <Select placeholder="请选择试题难度！">
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
          <Col span={5}>
            <Form.Item label={'题数'}>
              {getFieldDecorator(`names[${k}].randNum`, {
                rules: [{ required: true, message: '请输入提数！' }],
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col>
            {keys.length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => this.removeForm(k)}
              />
            ) : null}
          </Col>
        </Row>
      );
    });
    return (
      <div className={styles.box}>
        <Form onSubmit={this.handleSubmit} layout='vertical'>
          {formItem}
          <Form.Item labelCol={{ span: 2 }} wrapperCol={{ span: 4 }}>
            <Button type="dashed" onClick={this.addForm} style={{ width: '60%' }}>
              <Icon type="plus" /> 点击增加
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={loading}>
              生成试卷
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
const NewPaperAutoForm = Form.create({ name: 'newPaperAutoForm' })(newPaperAuto);

export default connect(state => ({
  ...state.newPaperAuto,
  loading: state.loading.models.newPaperAuto,
}))(NewPaperAutoForm);
