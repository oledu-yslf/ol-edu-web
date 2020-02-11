import React from 'react';
import style from './index.less';
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
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不相同!');
    } else {
      callback();
    }
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
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
          type: 'changepsw/staffUpdate',
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
        <Tabs defaultActiveKey="/teacher/changePsw" onTabClick={this.onTabClick}>
          <TabPane tab="基础资料" key="/teacher"></TabPane>
          <TabPane tab="课程管理" key="/teacher/courseManage"></TabPane>
          <TabPane tab="试题管理" key="/teacher/questionList"></TabPane>
          <TabPane tab="试卷管理" key="/teacher/paperList"></TabPane>
          <TabPane tab="作业审阅" key="/teacher/homeworkForTeacherList"></TabPane>
          <TabPane tab="学生成绩" key="/teacher/resultList"></TabPane>
          <TabPane tab="我的收藏" key="/teacher/favorite"></TabPane>
          <TabPane tab="修改密码" key="/teacher/changePsw"></TabPane>
        </Tabs>
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
                  validator: this.validateToNextPassword,
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
            })(<Input.Password onBlur={this.handleConfirmBlur} />)}
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


const TeacherFrom = Form.create({ name: 'TeacherFrom' })(ChangePsw);

export default connect(state => ({
  ...state.changepsw,
  loading: state.loading.models.changepsw,
}))(TeacherFrom);
