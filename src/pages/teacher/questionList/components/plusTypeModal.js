import React from 'react';
import { Modal, Form, Input } from 'antd';
import { connect } from 'dva';
import getUserId from '@/utils/getUserId';

class PlusypeModal extends React.Component {
  handleTypePlus = e => {
    const { dispatch, selectedNodes, form } = this.props;
    const { resetFields } = form;
    const createStaffId = getUserId();
    form.validateFields((err, value) => {
      if (!err) {
        resetFields();
        dispatch({
          type: 'questionList/categorySave',
          payload: {
            categoryName: value.categoryName,
            parentId: selectedNodes.categoryId || '',
            createStaffId,
            floor: parseInt(selectedNodes.floor) + 1 || 1,
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
        plusTypeVisible: false,
      },
    });
  };
  render() {
    const { plusTypeVisible, loading, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title="新增分类"
        visible={plusTypeVisible}
        onCancel={this.handleCancel}
        onOk={this.handleTypePlus}
        confirmLoading={loading}
      >
        <Form layout="vertical">
          <Form.Item label="分类名称">
            {getFieldDecorator('categoryName', {
              rules: [{ required: true, message: '请输入试题分类名称！' }],
            })(<Input />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

const PlusTypeForm = Form.create({ name: 'plusTypeForm' })(PlusypeModal);

export default connect(state => ({
  ...state.questionList,
  loading: state.loading.models.questionList,
}))(PlusTypeForm);
