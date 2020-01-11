import React from 'react';
import moment from 'moment';
import router from 'umi/router';
import { Tabs, Button, Table, Spin, Form, AutoComplete } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
const { TabPane } = Tabs;
const { Option } = AutoComplete;

class ResultDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  handleSearchSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const value = form.getFieldsValue();
    const { staffId } = value;
    dispatch({
      type: 'resultDetail/listPage',
      payload: {
        staffId
      },
    });
  };

  queryPaper = record => {
    router.push(`/teacher/resultDetail?planId=${record.paperId}&paperId=${record.paperId}&departId=${record.departId}&staffId=${record.staffId}`);
  };
  onStaffSearch = searchText => {
    const {dispatch} = this.props;
    dispatch({
      type:'newPlan/staffList',
      payload:{
        staffName:searchText
      }
    })
  };
  
  pageChange = (page, pageSize) => {
    const { dispatch, form } = this.props;
    const value = form.getFieldsValue();
    const { planId, paperId, departId } = value;
    dispatch({
      type: 'resultDetail/listPage',
      payload: {
        planId,
        paperId,
        departId,
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
      type: 'resultDetail/save',
      payload: {
        paperList: [],
        total: 10,
      },
    });
  }
  render() {
    const { resultDetail, total, loading, form, staffList } = this.props;
    const { getFieldDecorator } = form;
    const columns = [
      {
        title: '考试计划',
        dataIndex: 'planName',
        key: 'planName',
        width: 200,
        fixed: true,
      },
      {
        title: '试卷名称',
        dataIndex: 'paperName',
        key: 'paperName',
        width: 200,
        fixed: true,
      },
      {
        title: '学生',
        dataIndex: 'staffName',
        key: 'staffName',
        width: 200,
        fixed: true,
      },
      {
        title: '分数',
        dataIndex: 'totalScore',
        key: 'totalScore',
        width: 120,
      },
      {
        title: '是否通过',
        dataIndex: 'ispass',
        key: 'ispass',
        width: 120,
        render:(text,record)=>(
            <div>
                {record.score<record.passScore?'不通过':'通过'}
            </div>
        )
      },
      {
        title: '得分',
        dataIndex: 'score',
        key: 'score',
        width: 120,

      },
      {
        title: '时长（分钟）',
        dataIndex: 'duration',
        key: 'duration',
        width: 120,
      },
      {
        title: '部门',
        dataIndex: 'departName',
        key: 'departName',
        width: 160,
      },

      {
        title: '开始时间',
        key: 'effDate',
        dataIndex: 'effDate',
        render: text => <span>{moment(parseInt(text)).format('YYYY-MM-DD')}</span>,
        width: 120,
      },
     
      {
        title: '批卷老师',
        key: 'reviewStaffName',
        dataIndex: 'reviewStaffName',
        width: 120,
      },
      {
        title: '批卷时间',
        dataIndex: 'reviewDate',
        key: 'reviewDate',
        render: text => <span>{moment(parseInt(text)).format('YYYY-MM-DD')}</span>,
        width: 120,
      },
      {
        title: '操作',
        key: 'action',
        dataIndex: 'action',
        width: 120,

        render: (text, record) => (
          <span>
            <Button type="link" onClick={e => this.queryPaper(record, e)}>
              查看明细
            </Button>
          </span>
        ),
      },
    ];
    
    const staffNode = staffList.map(item => <Option key={item.staffId}>{item.staffName}</Option>);
    return (
      <div className={styles.box}>
        <Tabs defaultActiveKey="/teacher/resultList" onTabClick={this.onTabClick}>
          <TabPane tab="基础资料" key="/teacher"></TabPane>
          <TabPane tab="课程管理" key="/teacher/courseManage"></TabPane>
          <TabPane tab="考试管理" key="/teacher/questionList"></TabPane>
          <TabPane tab="考试管理" key="/teacher/paperList"></TabPane>
          <TabPane tab="作业审阅" key="/teacher/homeworkForTeacherList"></TabPane>
          <TabPane tab="学生成绩" key="/teacher/resultList">
            <Form layout="inline">
              <Form.Item label="考试计划:">
                {getFieldDecorator('planId', {
                  rules: [{ required: true, message: '请输入考试计划！' }],
                })(
                  <AutoComplete
                    dataSource={staffList}
                    onSearch={this.onStaffSearch}
                    placeholder="input here"
                  >
                    {staffNode}
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
              </Form.Item>
            </Form>
            <Spin spinning={loading}>
              <Table
                rowKey={record => `${record.staffId}`}
                columns={columns}
                dataSource={resultDetail}
                pagination={{
                  total,
                  pageSize: 10,
                  onChange: (page, pageSize) => {
                    this.pageChange(page, pageSize);
                  },
                }}
                scroll={{ x: 1800 }}
              />
            </Spin>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

const ResultDetailForm = Form.create({ name: 'resultDetailForm' })(ResultDetail);

export default connect(state => ({
  ...state.resultDetail,
  loading: state.loading.models.resultDetail,
}))(ResultDetailForm);
