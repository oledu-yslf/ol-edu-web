import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { connect } from 'dva';
import getUserId from '@/utils/getUserId';
const { Option } = Select;
class NewPaperModal extends React.Component {
  handlePaperPlus = e => {
    const { dispatch, form } = this.props;
    const { resetFields } = form;
    const createStaffId = getUserId();
    form.validateFields((err, value) => {
      if (!err) {
        resetFields();
        dispatch({
          type: 'paperList/paperSave',
          payload: {
            ...value,
            createStaffId,
          },
        });
      }
    });
  };
  handleCancel = e => {
    const { dispatch } = this.props;
    dispatch({
      type: 'paperList/save',
      payload: {
        newPaperVisible: false,
      },
    });
  };
  render() {
    const { newPaperVisible, loading, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title="新增试卷"
        visible={newPaperVisible}
        onCancel={this.handleCancel}
        onOk={this.handlePaperPlus}
        confirmLoading={loading}
      >
        <Form layout="vertical">
          <Form.Item label="试卷名称" wrapperCol={{ span: 12 }}>
            {getFieldDecorator('paperName', {
              rules: [{ required: true, message: '请输入试卷名称！' }],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="试卷类型" wrapperCol={{ span: 12 }}>
            {getFieldDecorator('paperType', {
              rules: [{ required: true, message: '请选择试卷类型！' }],
            })(
              <Select placeholder="请选择试卷类型！">
                <Option value={0}>作业</Option>
                <Option value={1}>试卷</Option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="生成类型" wrapperCol={{ span: 12 }}>
            {getFieldDecorator('genType', {
              rules: [{ required: true, message: '请选择生成类型！' }],
            })(
              <Select placeholder="请选择生成类型！">
                <Option value={0}>手动生成</Option>
                <Option value={1}>随机生成</Option>
              </Select>,
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

const NewPaperForm = Form.create({ name: 'newPaperForm' })(NewPaperModal);

export default connect(state => ({
  ...state.paperList,
  loading: state.loading.models.paperList,
}))(NewPaperForm);
