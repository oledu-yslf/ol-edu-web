import React from 'react';
import {  Modal, Form, Input } from 'antd';

const PlusModal = Form.create({ name: 'plusCategory' })(
  // eslint-disable-next-line
  class extends React.Component {
    onOk = ()=>{
      const { onCreate ,form} = this.props;
      const { resetFields } = form;

      this.props.form.validateFields((err, value) => {
      if (!err) {
        resetFields();
        onCreate(value);
      }
    });
    }
    render() {
      const { visible, onCancel, form,loading,title} = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title={title}
          okText="创建"
          cancelText="取消"
          onCancel={onCancel}
          onOk={this.onOk}
          confirmLoading={loading}
        >
          <Form layout="vertical">
            <Form.Item label="分类名称">
              {getFieldDecorator('categoryName', {
                rules: [{ required: true, message: '请输入课程分类名称！' }],
              })(<Input />)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  },
);

export default PlusModal;