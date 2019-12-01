import React from 'react';
import { Form, Input, Button, Row, Col, TreeSelect } from 'antd';
import { connect } from 'dva';

const { TreeNode } = TreeSelect;

class OSearchBar extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    const { onSearch } = this.props;
    const value = this.props.form.getFieldsValue();
    onSearch(value);
  };

  render() {
    const { treeData } = this.props;
    const { getFieldDecorator } = this.props.form;
    const renderTreeNodes = data => {
      return data.map(item => {
        if (item.courseCategoryVOList) {
          return (
            <TreeNode
              value={item.categoryId}
              title={item.categoryName}
              key={`${item.categoryName}-${item.categoryId}-${item.floor}`}
              c={item}
            >
              {renderTreeNodes(item.courseCategoryVOList)}
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
    };
    return (
      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col span={20}>
          <Form layout="inline" onSubmit={this.handleSubmit}>
            <Form.Item label="课程分类">
              {getFieldDecorator('categoryId')(
                <TreeSelect
                  showSearch
                  style={{ width: '200px' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请选择课程分类"
                  allowClear
                  onChange={this.treeChange}
                >
                  {renderTreeNodes(treeData)}
                </TreeSelect>,
              )}
            </Form.Item>
            <Form.Item label="课程名称:">{getFieldDecorator('courseName')(<Input placeholder="请输入课程名称"/>)}</Form.Item>
            <Form.Item label="文件名称:">{getFieldDecorator('attachName')(<Input  placeholder="请输入文件名称"/>)}</Form.Item>
          </Form>
        </Col>
        <Col span={4}>
          <Button type="primary" htmlType="submit" icon="search" onClick={this.handleSubmit}>
            查询
          </Button>
        </Col>
      </Row>
    );
  }
}

export default connect(state => ({ ...state.course, loading: state.loading.models.course }))(
  Form.create({ name: 'OSearchBar' })(OSearchBar),
);
