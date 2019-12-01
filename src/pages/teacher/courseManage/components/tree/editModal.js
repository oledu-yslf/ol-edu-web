import React from 'react';
import { Modal, Form, Input } from 'antd';

const EditModal = Form.create({
  name: 'editCategory',
  mapPropsToFields(props) {
    return {
      selectedName: Form.createFormField(props.selectedName),
    };
  }
})(
  // eslint-disable-next-line
  class extends React.Component {
    onOk = () => {
      const { onCreate } = this.props;
      this.props.form.validateFields((err, value) => {
        if (!err) {
          onCreate(value);
        }
      });
    };

    render() {
      const { visible, onCancel, form } = this.props;
      // console.log(selectedName);
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="编辑课程分类"
          okText="修改"
          cancelText="取消"
          onCancel={onCancel}
          onOk={this.onOk}
        >
          <Form layout="vertical">
            <Form.Item label="分类名称">
              {getFieldDecorator('categoryName', {
                initialValue: this.props.selectedName,
                rules: [{ required: true, message: '请输入课程分类名称！' }],
              })(<Input />)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  },
);

export default EditModal;
