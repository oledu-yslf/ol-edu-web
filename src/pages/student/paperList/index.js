import React from 'react';
import moment from 'moment';
import router from 'umi/router';
import { Tabs, Button, Table, Spin, Form } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
const { TabPane } = Tabs;

class PaperList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onTabClick = e => {
    router.push(e);
  };

  queryPaper = record => {
    router.push(
      `/student/paperDetailForStudent?paperId=${record.paperId}&staffId=${record.staffId}&planDetailId=${record.planDetailId}`,
    );
  };

  PaperReview = record => {
    router.push(
      `/student/examStart?paperId=${record.paperId}&staffId=${record.staffId}&planDetailId=${record.planDetailId}`,
    );
  };

  pageChange = (page, pageSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'paperList/getExamListForStudent',
      payload: {
        page: {
          pageNum: page,
          pageSize: 10,
        },
      },
    });
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'paperList/getExamListForStudent',
      payload: {
        paperList: [],
        total: 10,
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'paperList/save',
      payload: {
        paperList: [],
      },
    });
  }
  render() {
    const { paperList, count, pageNum,pageSize,loading } = this.props;
    console.log(count);
    const columns = [
      {
        key:'index',
        title: '序号',
        width:80,
        render:(text,record,index)=> {
          return(
            `${(pageNum-1)*pageSize+(index+1)}` //当前页数减1乘以每一页页数再加当前页序号+1
          )
        }
      },
      {
        title: '计划名称',
        dataIndex: 'planName',
        key: 'planName',
      },

      {
        title: '试卷名称',
        dataIndex: 'paperName',
        key: 'paperName',
      },

      {
        title: '开始时间',
        dataIndex: 'effDate',
        key: 'effDate',
        render: text => <span>{moment(parseInt(text)).format('YYYY/MM/DD HH:MM:SS')}</span>,
      },

      {
        title: '结束时间',
        dataIndex: 'expDate',
        key: 'expDate',
        render: text => <span>{moment(parseInt(text)).format('YYYY/MM/DD HH:MM:SS')}</span>,
      },

      {
        title: '时长（分钟）',
        dataIndex: 'duration',
        key: 'duration',
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
            {record.state >= 2 && (
              <Button type="link" onClick={e => this.queryPaper(record, e)}>
                查看
              </Button>
            )}
            {record.state < 2 && (
              <Button type="link" onClick={e => this.PaperReview(record, e)}>
                开始
              </Button>
            )}
          </span>
        ),
      },
    ];
    return (
      <div className={styles.box}>
        <Tabs defaultActiveKey="/student/paperList" onTabClick={this.onTabClick}>
          <TabPane tab="基础资料" key="/student"></TabPane>
          <TabPane tab="学习记录" key="/student/recentList"></TabPane>
          <TabPane tab="我的作业" key="/student/homeworkForStudent"></TabPane>
          <TabPane tab="我的考试" key="/student/paperList">
            <Spin spinning={loading}>
              <Table
                rowKey={record => `${record.paperId}-${record.planDetailId}`}
                columns={columns}
                dataSource={paperList}
                pagination={{
                  total:count,
                  pageSize: 10,
                  onChange: (page, pageSize) => {
                    this.pageChange(page, pageSize);
                  },
                }}
              />
            </Spin>

          </TabPane>
          <TabPane tab="我的成绩" key="/student/achievement"></TabPane>
          <TabPane tab="我的收藏" key="/student/favorite"></TabPane>
          <TabPane tab="修改密码" key="/student/changePsw"></TabPane>
        </Tabs>
      </div>
    );
  }
}

export default connect(state => ({
  ...state.paperList,
  loading: state.loading.models.paperList,
}))(PaperList);
