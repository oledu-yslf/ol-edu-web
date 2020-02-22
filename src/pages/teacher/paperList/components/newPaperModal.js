import React from 'react';
import { Modal, Form, Input, Select ,Button} from 'antd';
import { connect } from 'dva';
import getUserId from '@/utils/getUserId';
import NewPaperAuto from './newPaperAuto';
import NewPaper from './newPaper';

const { Option } = Select;
class NewPaperModal extends React.Component {
  constructor(props) {
    super(props);
  }
  handleCancel = e => {
    const { dispatch } = this.props;
    dispatch({
      type: 'teacherPaperList/save',
      payload: {
        newPaperVisible: false,
      },
    });
  };

  render() {
    const { newPaperStep, loading, form,newPaperVisible } = this.props;

    return (
      <Modal
        title="新增试卷"
        width='650px'
        visible={newPaperVisible}
        onCancel={this.handleCancel}
        confirmLoading={loading}
        footer={null}
      >
        {newPaperStep == 1 ? <NewPaper></NewPaper> : null}
        {newPaperStep == 2 ? <NewPaperAuto></NewPaperAuto> : null}
      </Modal>
    );
  }
}

export default connect(state => ({
  ...state.teacherPaperList,
  loading: state.loading.models.teacherPaperList,
}))(NewPaperModal);
