import React from 'react';
import style from '@/style/common.less';
import { Form, Button,  Input,Tabs} from 'antd';
import { connect } from 'dva';
import router from 'umi/router';

class ChangePsw extends React.Component {
  onTabClick = e => {
    router.push(e);
  };
  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    // if (value) {
    //   form.validateFields(['confirm'], { force: true });
    // }
    callback();
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { dispatch, form } = this.props;
    let pwd1 = form.getFieldValue('password')
    let pwd2 = form.getFieldValue('confirm')

    console.log(pwd1)
    console.log(pwd2)
    if ((pwd2 && pwd1)  && pwd1 !== pwd2) {
      callback('两次输入的密码不相同!');
    } else {
      callback();
    }
  };


  handleSubmit = e => {
    const { dispatch } = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const roleInfo = sessionStorage.getItem('roleInfo')
          ? JSON.parse(sessionStorage.getItem('roleInfo'))
          : '';
        const staffId = roleInfo ? roleInfo.staffId : '';
        console.log('Received values of form: ', values);
        dispatch({
          type: 'changePsw/staffUpdate',
          payload: {
            staffId,
            oldStaffPwd:values.oldPassword,
            newStaffPwd:values.password,
          },
        });

      }
    });
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    const { TabPane } = Tabs;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 10,
        },
      },
    };

    return (
      <div className={style.box}>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="旧密码" hasFeedback labelCol={{span: 3, offset: 1}}>
            {getFieldDecorator('oldPassword', {
              rules: [
                {
                  required: true,
                  message: '请输入旧密码!',
                },
                {
                  validator: this.validateToNextPassword,
                },
              ],
            })(<Input.Password />)}
          </Form.Item>
          <Form.Item label="新密码" hasFeedback labelCol={{span: 3, offset: 1}}>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: '请输入新密码!',
                },
                {
                  validator: this.compareToFirstPassword,
                },
              ],
            })(<Input.Password />)}
          </Form.Item>
          <Form.Item label="确认密码" hasFeedback labelCol={{span: 3, offset: 1}}>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: '请输入确认密码!',
                },
                {
                  validator: this.compareToFirstPassword,
                },
              ],
            })(<Input.Password />)}
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}


const ChangePswFrom = Form.create({ name: 'ChangePswFrom' })(ChangePsw);

export default connect(state => ({
  ...state.changePsw,
  loading: state.loading.models.changePsw,
}))(ChangePswFrom);
