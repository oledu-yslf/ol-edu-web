import React from 'react';
import { Modal, Form, Input } from 'antd';
import { connect } from 'dva';
import getUserId from '@/utils/getUserId';

class EditTypeModal extends React.Component {
  handleTypeEdit = e => {
    const { dispatch, selectedNodes, form } = this.props;
    const { resetFields } = form;
    const modifyStaffId = getUserId();
    form.validateFields((err, value) => {
      if (!err) {
        resetFields();
        dispatch({
          type: 'questionList/categoryUpdate',
          payload: {
            categoryId: selectedNodes.categoryId,
            categoryName: value.categoryName,
            modifyStaffId,
          },
        });
      }
    });
  };
  handleCancel = e => {
    const { dispatch } = this.props;
    dispatch({
      type: 'questionList/save',
      payload: {
        editTypeVisible: false,
      },
    });
  };
  render() {
    const { editTypeVisible, loading, form,selectedNodes } = this.props;
    const { getFieldDecorator } = form;
    const { categoryName } = selectedNodes
    return (
      <Modal
        title="编辑分类"
        visible={editTypeVisible}
        onCancel={this.handleCancel}
        onOk={this.handleTypeEdit}
        confirmLoading={loading}
      >
        <Form layout="vertical">
          <Form.Item label="分类名称">
            {getFieldDecorator('categoryName', {
              initialValue: categoryName,
              rules: [{ required: true, message: '请输入试题分类名称！' }],
            })(<Input />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

const EditTypeForm = Form.create({ name: 'editTypeForm' })(EditTypeModal);

export default connect(state => ({
  ...state.questionList,
  loading: state.loading.models.questionList,
}))(EditTypeForm);
