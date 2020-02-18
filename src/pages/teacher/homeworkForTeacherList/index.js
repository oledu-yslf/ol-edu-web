import React from 'react';
import moment from 'moment';
import router from 'umi/router';
import {Tabs, Button, Table, Spin, Form, Input, Select} from 'antd';
import {connect} from 'dva';
import styles from '@/style/common.less';
const {TabPane} = Tabs;
const {Option} = Select;

class HomeworkForTeacherList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onTabClick = e => {
    router.push(e);
  };

  handleSearchSubmit = e => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    const value = form.getFieldsValue();
    const {paperName, planName, state} = value;
    dispatch({
      type: 'homeworkForTeacherList/getHomeworkForTeacher',
      payload: {
        paperName,
        planName,
        state,
      },
    });
  };

  PaperReview = record =>{
    router.push(`/teacher/paperReviewDetail?paperId=${record.paperId}&staffId=${record.staffId}&planDetailId=${record.planDetailId}`);
  }
  queryPaper = record => {
    router.push(`/teacher/studentAchieveDetail?paperId=${record.paperId}&staffId=${record.staffId}&planDetailId=${record.planDetailId}`);
  };

  pageChange = (page, pageSize) => {
    const {dispatch, form} = this.props;
    const value = form.getFieldsValue();
    const {paperName, planName, state} = value;
    dispatch({
      type: 'homeworkForTeacherList/getHomeworkForTeacher',
      payload: {
        paperName,
        planName,
        state,
        page: {
          pageNum: page,
          pageSize: 10,
        },
      },
    });
  };

  componentWillMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'homeworkForTeacherList/getHomeworkForTeacher',
      payload: {
      },
    });
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'homeworkForTeacherList/save',
      payload: {
        paperList: [],
        total: 10,
      },
    });
  }

  render() {
    const {paperList, total, loading, form,pageNum, pageSize} = this.props;
    const {getFieldDecorator} = form;

    const columns = [
      {
        key: 'index',
        title: '序号',
        width: 80,
        render: (text, record, index) => {
          return (
            `${(pageNum - 1) * pageSize + (index + 1)}` //当前页数减1乘以每一页页数再加当前页序号+1
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
        title: '试卷类型',
        dataIndex: 'paperType',
        key: 'paperType',
        render: (text,record) => {
          return <span>{text == 0 ? '作业' : '试卷'}</span>
        }
      },
      //   {
      //     title: '创建时间',
      //     dataIndex: 'createDate',
      //     key: 'createDate',
      //     render: text => <span>{moment(parseInt(text)).format('YYYY-MM-DD')}</span>,
      //   },
      {
        title: '及格分数',
        dataIndex: 'passScore',
        key: 'passScore',
      },

      {
        title: '总分',
        dataIndex: 'totalScore',
        key: 'totalScore',
      },
      {
        title: '得分',
        dataIndex: 'score',
        key: 'score',
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
        render: text => <span>{moment(parseInt(text)).format('YYYY-MM-DD HH:MM:SS')}</span>,
      },
      {
        title: '批卷老师',
        key: 'reviewStaffName',
        dataIndex: 'reviewStaffName',
      },
      {
        title: '批卷时间',
        key: 'reviewDate',
        dataIndex: 'reviewDate',
        render: text => <span>{text ?moment(parseInt(text)).format('YYYY-MM-DD HH:MM:SS') :'-'}</span>,
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
        <Form layout="inline">
          <Form.Item label="试题名称:">
            {getFieldDecorator('paperName', {})(<Input style={{width: '120px'}}/>)}
          </Form.Item>
          <Form.Item label="计划名称:">
            {getFieldDecorator('planName', {})(<Input style={{width: '120px'}}/>)}
          </Form.Item>
          <Form.Item label="状态:">
            {getFieldDecorator('state', {initialValue: ''})(
              <Select style={{width: '80px'}}>
                <Option value={''}>全部</Option>
                <Option value={0}>新建</Option>
                <Option value={1}>进行中</Option>
                <Option value={2}>待审阅</Option>
                <Option value={3}>已审阅</Option>
              </Select>,
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

const HomeworkForTeacherListForm = Form.create({name: 'homeworkForTeacherListForm'})(
  HomeworkForTeacherList,
);

export default connect(state => ({
  ...state.homeworkForTeacherList,
  loading: state.loading.models.homeworkForTeacherList,
}))(HomeworkForTeacherListForm);
