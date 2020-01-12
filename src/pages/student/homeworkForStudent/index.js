import React from 'react';
import moment from 'moment';
import router from 'umi/router';
import { Tabs, Button, Table, Spin, Form } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
const { TabPane } = Tabs;

class HomeworkForStudent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onTabClick = e => {
    router.push(e);
  };

  queryPaper = record => {
    router.push(`/student/homeworkForStudentDetail?paperId=${record.paperId}&staffId=${record.staffId}&planDetailId=${record.planDetailId}`);
  };

  pageChange = (page, pageSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'homeworkForStudent/listPage',
      payload: {
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
      type: 'homeworkForStudent/save',
      payload: {
        paperList: [],
        total: 10,
      },
    });
  }
  render() {
    const { paperList, total, loading } = this.props;
    const columns = [
      {
        title: '作业名称',
        dataIndex: 'paperName',
        key: 'paperName',
        width:100
      },
  
      {
        title: '创建时间',
        dataIndex: 'effDate',
        key: 'effDate',
        render: text => <span>{moment(parseInt(text)).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        render: text => (
          <span>
            {text === 0 ? '新建' : text === 1 ? '进行中' : text === 2 ? '待审阅' : '已审阅'}
          </span>
        ),
      },
 
      {
        title: '得分',
        dataIndex: 'score',
        key: 'score',
      },
     
      {
        title: '批卷老师',
        key: 'reviewStaffName',
        dataIndex: 'reviewStaffName',
      },
     
      {
        title: '操作',
        key: 'action',
        dataIndex: 'action',
        render: (text, record) => (
          <span>
            <Button type="link" onClick={e => this.queryPaper(record, e)}>
              查看
            </Button>
            {record.state === 2 && (
              <Button type="link" onClick={e => this.PaperReview(record, e)}>
                审阅
              </Button>
            )}
          </span>
        ),
      },
    ];
    return (
      <div className={styles.box}>
        <Tabs defaultActiveKey="/student/homeworkForStudent" onTabClick={this.onTabClick}>
          <TabPane tab="基础资料" key="/student"></TabPane>
          <TabPane tab="课程管理" key="/student/recentList"></TabPane>
          <TabPane tab="作业审阅" key="/student/homeworkForStudent">
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
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

const HomeworkForStudentForm = Form.create({ name: 'homeworkForStudentForm' })(
  HomeworkForStudent,
);

export default connect(state => ({
  ...state.homeworkForStudent,
  loading: state.loading.models.homeworkForStudent,
}))(HomeworkForStudentForm);
