import React from 'react';
import { connect } from 'dva';
import moment from 'moment';

import { Tabs, Descriptions, Spin, Button, Modal, Form, Input, Radio,DatePicker } from 'antd';
import router from 'umi/router';
import styles from './index.less';

const { TabPane } = Tabs;

class Teacher extends React.Component {
  onTabClick = e => {
    if (e === '基础资料') {
      router.push('/teacher');
    } else if (e === '课程管理') {
      router.push('/teacher/courseManage');
    }
  };
  handleInfoEdit = e => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch({
      type: 'teacher/save',
      payload: {
        editInfoVisible: true,
      },
    });
  };
  handleEditOk = e => {
    e.preventDefault();
    const { form, dispatch, staffDetail } = this.props;
    const { resetFields } = form;
    this.props.form.validateFields((err, values) => {
      const { effDate, expDate, staffId,roleId } = staffDetail;
      const {
        staffName,
        sex,
        birthdayTime,
        contactTel,
        email,
        address,
      } = values;
      const birthday = birthdayTime.valueOf();

      if (!err) {
        resetFields();
        dispatch({
          type: 'teacher/staffUpdate',
          payload: {
            staffId,
            staffName,
            sex,
            birthday,
            contactTel,
            email,
            address,
            expDate,
            effDate,
            updateStaffId: staffId,
            roleId,
          },
        });
      }
    });
  };
  handleCancel = e => {
    const { dispatch } = this.props;
    dispatch({
      type: 'teacher/save',
      payload: {
        editInfoVisible: false,
      },
    });
  };
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'teacher/save',
      payload: {},
    });
  }
  render() {
    const { staffDetail, loading, editInfoVisible, form } = this.props;
    const { getFieldDecorator } = form;

    const { staffNo, staffName, sex, contactTel, birthday, address, departId, email } = staffDetail;
    let birthdayTime = moment(birthday);

    const UserInfoTitle = () => {
      return (
        <div className="clearfix">
          <div className="pullleft">
            <span>用户信息</span>
          </div>
          <div className="pullright">
            <Button type="primary" onClick={this.handleInfoEdit}>
              编辑
            </Button>
          </div>
        </div>
      );
    };
    return (
      <div className={styles.box}>
        <Tabs defaultActiveKey="基础资料" onTabClick={this.onTabClick}>
          <TabPane tab="基础资料" key="基础资料">
            <Spin tip="Loading..." spinning={loading || false}>
              <Descriptions title={<UserInfoTitle />}>
                <Descriptions.Item label="学号">{staffNo}</Descriptions.Item>
                <Descriptions.Item label="姓名">{staffName}</Descriptions.Item>
                <Descriptions.Item label="性别">{sex === '1' ? '男' : '女'}</Descriptions.Item>
                <Descriptions.Item label="电话">{contactTel}</Descriptions.Item>
                <Descriptions.Item label="出生日期">
                  {moment(parseInt(birthday)).format('YYYY-MM-DD')}
                </Descriptions.Item>
                <Descriptions.Item label="地址">{address || '-'}</Descriptions.Item>
                <Descriptions.Item label="院系">{departId}</Descriptions.Item>
                <Descriptions.Item label="邮箱">{email || '-'}</Descriptions.Item>
              </Descriptions>
            </Spin>
          </TabPane>
          <TabPane tab="课程管理" key="课程管理"></TabPane>
        </Tabs>

        <Modal
          visible={editInfoVisible}
          title={'用户信息编辑'}
          okText="保存"
          cancelText="取消"
          confirmLoading={loading}
          onCancel={this.handleCancel}
          onOk={this.handleEditOk}
        >
          <Form layout="vertical">
            <Form.Item label="员工姓名">
              {getFieldDecorator('staffName', {
                initialValue: staffName,
                rules: [{ required: true, message: '请输入员工姓名！' }],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="性别">
              {getFieldDecorator('sex', {
                initialValue: sex,
              })(
                <Radio.Group>
                  <Radio value={'1'}>男</Radio>
                  <Radio value={'0'}>女</Radio>
                </Radio.Group>,
              )}
            </Form.Item>

            <Form.Item label="联系电话">
              {getFieldDecorator('contactTel', {
                initialValue: contactTel,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="邮箱">
              {getFieldDecorator('email', {
                initialValue: email,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="地址">
              {getFieldDecorator('address', {
                initialValue: address,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="生日">
              {getFieldDecorator('birthdayTime', {
                initialValue: birthdayTime,
              })(<DatePicker />)}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

const TeacherFrom = Form.create({ name: 'TeacherFrom' })(Teacher);

export default connect(state => ({
  ...state.teacher,
  loading: state.loading.models.teacher,
}))(TeacherFrom);
