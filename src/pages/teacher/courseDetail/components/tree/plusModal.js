import React from 'react';
import { Modal, Form, Input } from 'antd';
// import { chapterDetail } from '../../services/courseDetail';
const { TextArea } = Input;
const PlusModal = Form.create({ name: 'plusChapter' })(
  class PlusForm extends React.Component {
    onOk = () => {
      const { onCreate, onEdit,form } = this.props;
      const { resetFields } = form;
      this.props.form.validateFields((err, value) => {
        if (!err) {
          if (this.props.title === '编辑章节') {
            resetFields();
            onEdit(value);
          } else {
            resetFields();
            onCreate(value);
          }
        }
      });
    };
    render() {
      const {
        visible,
        onCancel,
        form,
        confirmLoading,
     
        chapterDetail,
        title,
      } = this.props;


      const { chapterName, chapterDesc, sort } = chapterDetail;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title={title}
          okText="保存"
          cancelText="取消"
          confirmLoading={confirmLoading}
          onCancel={onCancel}
          onOk={this.onOk}
        >
          <Form layout="vertical">
            <Form.Item label="章节名称">
              {getFieldDecorator('chapterName', {
                initialValue: chapterName,
                rules: [{ required: true, message: '请输入章节名称！' }],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="章节排序">
              {getFieldDecorator('sort', {
                initialValue: sort,
                rules: [{ required: true, message: '请输入章节排序！' }],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="章节描述">
              {getFieldDecorator('chapterDesc', {
                initialValue: chapterDesc,
                rules: [{ required: true, message: '请输入章节描述！' }],
              })(<TextArea rows={4} />)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  },
);

export default PlusModal;
