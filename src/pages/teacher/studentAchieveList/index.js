import React from 'react';
import moment from 'moment';
import router from 'umi/router';
import {  Button, Table, Spin, Form, AutoComplete } from 'antd';
import { connect } from 'dva';
import styles from '../../../style/common.less';
const { Option } = AutoComplete;

class StudentAchieveList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onTabClick = e => {
    router.push(e);
  };

  handleSearchSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const value = form.getFieldsValue();
    const { staffId } = value;
    const {query} = this.props.location;
    dispatch({
      type: 'studentAchieveList/listPage',
      payload: {
        staffId,
        paperId:query.paperId,
        planId:query.planId,
        departId:query.departId,
      },
    });
  };

  queryPaper = record =>{
    router.push(
      `/teacher/studentAchieveDetail?paperId=${record.paperId}&staffId=${record.staffId}&planDetailId=${record.planDetailId}`,
    );
  }

  pageChange = (page, pageSize) => {
    const { dispatch, form } = this.props;
    const value = form.getFieldsValue();
    const { paperId, planId, departId } = value;
    dispatch({
      type: 'studentAchieveList/listPage',
      payload: {
        paperId,
        planId,
        departId,
        page: {
          pageNum: page,
          pageSize: 10,
        },
      },
    });
  };

  handleExportAll =e=>{
    const { dispatch } = this.props;
    const {query} = this.props.location
    dispatch({
      type: 'studentAchieveList/avgDetailExport',
      payload: {
        planId:query.planId,
        paperId:query.paperId,
        departId:query.departId,
      },
    });

  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'studentAchieveList/save',
      payload: {
        paperList: [],
        total: 10,
      },
    });
  }
  render() {
    const { paperList, total, loading, form,planList } = this.props;
    const { getFieldDecorator } = form;
    const columns = [
      {
        title: '考试计划',
        dataIndex: 'planName',
        key: 'planName',
      },
      {
        title: '试卷名称',
        dataIndex: 'paperName',
        key: 'paperName',
      },
      {
        title: '学生',
        dataIndex: 'staffName',
        key: 'staffName',
      },

      {
        title: '及格分数',
        dataIndex: 'passScore',
        key: 'passScore',
      },
      {
        title: '分数',
        key: 'totalScore',
        dataIndex: 'totalScore',
      },
      {
        title: '是否通过',
        key: 'highestScore',
        dataIndex: 'highestScore',
        render: (text, record) => (
          <span>{record.score>=record.passScore?'是':'否'}</span>
        )
      },
      {
        title: '得分',
        key: 'score',
        dataIndex: 'score',
      },
      {
        title: '时长(分钟)',
        key: 'duration',
        dataIndex: 'duration',
      },
      {
        title: '部门',
        key: 'departName',
        dataIndex: 'departName',
      },
      {
        title: '开始时间',
        dataIndex: 'effDate',
        key: 'effDate',
        render: text => <span>{moment(parseInt(text)).format('YYYY/MM/DD HH:MM:SS')}</span>,
      },
      {
        title: '批卷老师',
        dataIndex: 'reviewStaffName',
        key: 'reviewStaffName',
        render:(text,record)=>(
          <span>{text+'%'}</span>
        )
      },
      {
        title: '批卷时间',
        dataIndex: 'reviewDate',
        key: 'reviewDate',
        render: text => <span>{moment(parseInt(text)).format('YYYY/MM/DD HH:MM:SS')}</span>,
      },
      {
        title: '操作',
        key: 'action',
        dataIndex: 'action',
        width:100,
        render: (text, record) => (
          <span>
            <Button type="link" onClick={e => this.queryPaper(record, e)}>
              详情
            </Button>
          </span>
        ),
      },

    ];

    const planNode = paperList?paperList.map(item => <Option key={item.staffId}>{item.staffName}</Option>):'';

    return (
      <div className={styles.box}>
        <Form layout="inline">
          <Form.Item label="学生名字:">
            {getFieldDecorator('staffId', {
              rules: [{ required: true, message: '请输入考试计划！' }],
            })(
              <AutoComplete
                dataSource={planList}
                onSearch={this.onPlanSearch}
              >
                {planNode}
              </AutoComplete>,
            )}
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
            <Button
              type="default"
              htmlType="submit"
              onClick={this.handleExportAll}
              style={{marginLeft:'15px' }}
            >
              导出全部
            </Button>
          </Form.Item>
        </Form>
        <Spin spinning={loading}>
          <Table
            rowKey={record => `${record.paperId}-${record.planDetailId}`}
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

const StudentAchievListForm = Form.create({ name: 'studentAchievListForm' })(
  StudentAchieveList,
);

export default connect(state => ({
  ...state.studentAchieveList,
  loading: state.loading.models.studentAchieveList,
}))(StudentAchievListForm);
