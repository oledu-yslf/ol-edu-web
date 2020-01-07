import React from 'react';
import moment from 'moment';
import {  Button, Table, Spin, Form, Input } from 'antd';
import { connect } from 'dva';
import styles from './index.less';

class PlanDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSearchSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const value = form.getFieldsValue();
    const { paperName } = value;
    dispatch({
      type: 'planDetail/listPage',
      payload: {
        paperName,
      },
    });
  };

  pageChange = (page, pageSize) => {
    const { dispatch, form } = this.props;
    const value = form.getFieldsValue();
    const { paperName } = value;
    dispatch({
      type: 'planDetail/listPage',
      payload: {
        paperName,
        page: {
          pageNum: page,
          pageSize: 10,
        },
      },
    });
  };
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'planDetail/save',
      payload: {
        paperList: [],
        total: 10,
      },
    });
  }
  render() {
    const { paperList, total, loading, form } = this.props;
    const { getFieldDecorator } = form;
    const columns = [
      {
        title: '试卷名称',
        dataIndex: 'paperName',
        key: 'paperName',
      },
      {
        title: '试卷类型',
        dataIndex: 'paperType',
        key: 'paperType',
        render: text => <span>{text === 0 ? '作业' : '试卷'}</span>,
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate',
        render: text => <span>{moment(parseInt(text)).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '及格分数',
        dataIndex: 'passScore',
        key: 'passScore',
      },

      {
        title: '分数',
        dataIndex: 'totalScore',
        key: 'totalScore',
      },
      {
        title: '创建人员',
        key: 'createStaffName',
        dataIndex: 'createStaffName',
      },
      {
        title: '考试人员',
        key: 'staffName',
        dataIndex: 'staffName',
      },
      {
        title: '时长（分钟）',
        key: 'duration',
        dataIndex: 'duration',
      },
      {
        title: '开始时间',
        key: 'effDate',
        dataIndex: 'effDate',
        render: text => <span>{moment(parseInt(text)).format('YYYY-MM-DD')}</span>,

      },
      {
        title: '批卷老师',
        key: 'reviewStaffName',
        dataIndex: 'reviewStaffName',
      },
    ];
    return (
      <div className={styles.box}>
        <Form layout="inline">
          <Form.Item label="试卷名称:">
            {getFieldDecorator('paperName', {
            })(<Input style={{ width: '120px' }} />)}
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon="search"
              onClick={this.handleSearchSubmit}
            >
              查询
            </Button>
          </Form.Item>
          
        </Form>
        <Spin spinning={loading}>
          <Table
            rowKey={record => record.planDetailId}
            columns={columns}
            dataSource={paperList}
            pagination={{
              total,
              pageSize: 10,
              onChange: (page, pageSize) => {
                this.pageChange(page, pageSize);
              },
            }}
          />
        </Spin>
      </div>
    );
  }
}

const PlanDetailForm = Form.create({ name: 'PlanDetailForm' })(PlanDetail);

export default connect(state => ({
  ...state.planDetail,
  loading: state.loading.models.planDetail,
}))(PlanDetailForm);
