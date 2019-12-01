import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import request from '@/utils/request';
// import axios from 'axios';


import { Form, Icon, Input, Button, Row, Col } from 'antd';
import styles from './index.css';

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class NormalLoginForm extends React.Component {
  componentDidMount() {
    this.props.form.validateFields();
  }
  handleSubmit = e => {
    const { dispatch, form, prerouter } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'login/token',
          payload: {
            ...values,
          },
        }).then(res => {
          if (prerouter) {
            router.push(prerouter);
          } else {
            router.push('/');
          }
        });
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const usernameError = isFieldTouched('username') && getFieldError('username');
    const passwordError = isFieldTouched('password') && getFieldError('password');
    return (
      <div className={styles.box}>
        <Row>
          <Col offset={9} span={6}>
            <Form onSubmit={this.handleSubmit} className={styles['login-form']}>
              <Form.Item validateStatus={usernameError ? 'error' : ''} help={usernameError || ''}>
                {getFieldDecorator('username', {
                  rules: [{ required: true, message: '请输入你的用户名' }],
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="用户名"
                  />,
                )}
              </Form.Item>
              <Form.Item validateStatus={passwordError ? 'error' : ''} help={passwordError || ''}>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入你的密码!' }],
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="密码"
                  />,
                )}
              </Form.Item>
              {/* <Form.Item   validateStatus={captchaError ? 'error' : ''} help={captchaError || ''}>
          <Row gutter={8}>
            <Col span={12}>
              {getFieldDecorator('captcha', {
                rules: [{ required: true, message: '请输入验证码!' }],
              })(<Input style={{ color: 'rgba(0,0,0,.25)' }} placeholder="验证码"/>)}
            </Col>
            <Col span={12}>
              <Button>Get captcha</Button>
            </Col>
          </Row>
        </Form.Item> */}
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className={styles['login-form-button']}
                  disabled={hasErrors(getFieldsError())}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);
export default connect(state => ({ ...state.login, loading: state.loading.models.login }))(
  WrappedNormalLoginForm,
);
