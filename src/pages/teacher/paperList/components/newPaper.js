import React from 'react';
import { Modal, Form, Input, Select ,Button,Spin} from 'antd';
import { connect } from 'dva';
import getUserId from '@/utils/getUserId';
const { Option } = Select;
class NewPaper extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSubmit = e => {
    const { dispatch, form,pageSize } = this.props;
    const { resetFields } = form;
    const createStaffId = getUserId();

    form.validateFields((err, value) => {
      if (!err) {
        //resetFields();
        dispatch({
          type: 'teacherPaperList/paperSave',
          payload: {
            ...value,
            createStaffId,
          },
        }).then (res => {
          dispatch({
            type: 'teacherPaperList/paperListPage',
            payload: {
              page:{
                pageNum:1,
                pageSize,
              }
            },
          })
        });
      }
    });
  };

  render() {
    const { newPaperVisible, loading, form } = this.props;
    const { getFieldDecorator } = form;


    return (<div>
        <Spin spinning={loading}>
        <Form layout="vertical" >
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

          <Form.Item wrapperCol={{ span: 12 }}>
            <Button type="primary" onClick={this.handleSubmit}>
              下一步
            </Button>
          </Form.Item>
        </Form>
        </Spin>
      </div>
    );
  }
}

const NewPaperForm = Form.create({ name: 'NewPaperForm' })(NewPaper);

export default connect(state => ({
  ...state.teacherPaperList,
  loading: state.loading.models.teacherPaperList,
}))(NewPaperForm);
