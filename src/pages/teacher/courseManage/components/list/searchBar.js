import React from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import Link from 'umi/link';
import router from 'umi/router';

class OSearchBar extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    const { onSearch } = this.props;
    const value = this.props.form.getFieldsValue();
    onSearch(value);
  };

  handlePlusClick = e =>{
    router.push('/teacher/courseEdit');
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Row gutter={16}>
        <Col span={15}>
          <Form layout="inline" onSubmit={this.handleSubmit}>
            <Form.Item label="课程名称:">{getFieldDecorator('courseName')(<Input />)}</Form.Item>
            <Form.Item label="文件名称:">{getFieldDecorator('attachName')(<Input />)}</Form.Item>
          </Form>
        </Col>
        <Col span={3}>
          <Button type="primary" htmlType="submit" icon="search" onClick	={this.handleSubmit}>
            查询
          </Button>
        </Col>
        <Col span={3}>
          <Button type="primary" icon="edit" onClick={this.handlePlusClick}>
            <Link to="/teacher/courseEdit" style={{color:'#fff'}}>添加</Link>
          </Button>
        </Col>
        <Col span={3}>
          <Button type="primary" icon="upload">
            导入
          </Button>
        </Col>
      </Row>
    );
  }
}

export default Form.create({ name: 'OSearchBar' })(OSearchBar);
