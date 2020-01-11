import React from 'react';
import moment from 'moment';
import router from 'umi/router';
import { Tabs, Button, Table, Spin, Form, Input, Select, AutoComplete, TreeSelect } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
const { TabPane } = Tabs;
const { TreeNode } = TreeSelect;
const { Option } = AutoComplete;

class ResultList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortedInfo: [],
    };
  }
  onTabClick = e => {
    router.push(e);
  };

  handleSearchSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const value = form.getFieldsValue();
    const { paperId, planId, departId } = value;
    dispatch({
      type: 'resultList/listPage',
      payload: {
        paperId,
        planId,
        departId,
      },
    });
  };

  queryPaper = record => {
    router.push(`/teacher/resultDetail?planId=${record.paperId}&paperId=${record.paperId}&departId=${record.departId}`);
  };
  onPlanSearch = searchText => {
    const { dispatch } = this.props;
    dispatch({
      type: 'resultList/planListPage',
      payload: {
        planName: searchText,
      },
    });
  };
  onPaperSearch = searchText => {
    const { dispatch } = this.props;
    dispatch({
      type: 'resultList/paperListPage',
      payload: {
        paperName: searchText,
      },
    });
  };
  // pageChange = (page, pageSize) => {
  //   const { dispatch, form } = this.props;
  //   const value = form.getFieldsValue();
  //   const { planId, paperId, departId } = value;
  //   dispatch({
  //     type: 'resultList/listPage',
  //     payload: {
  //       planId,
  //       paperId,
  //       departId,
  //       page: {
  //         pageNum: page,
  //         pageSize: 10,
  //       },
  //     },
  //   });
  // };
  handleTableChange = (pagination, filters, sorter) => {
    const { dispatch, form } = this.props;
    const value = form.getFieldsValue();
    const { planId, paperId, departId } = value;
    let orderBy = ''
    if(sorter.field === 'passScore'){
      if(sorter.order === 'ascend'){
        orderBy='pass_num asc'
      }else{
        orderBy='pass_num desc'
      }
    }

    if(sorter.field === 'averageScore'){
      if(sorter.order === 'ascend'){
        orderBy='average_score asc'
      }else{
        orderBy='average_score desc'
      }
    }

    if(sorter.field === 'highestScore'){
      if(sorter.order === 'ascend'){
        orderBy='highest_score asc'
      }else{
        orderBy='highest_score desc'
      }
    }

    if(sorter.field === 'minimumScore'){
      if(sorter.order === 'ascend'){
        orderBy='minimum_score asc'
      }else{
        orderBy='minimum_score desc'
      }
    }

    if(sorter.field === 'passPercent'){
      if(sorter.order === 'ascend'){
        orderBy='pass_percent asc'
      }else{
        orderBy='pass_percent desc'
      }
    }

    // if(sorter.field === 'minimumScore'){
    //   if(sorter.order === 'ascend'){
    //     orderBy='minimum_score asc'
    //   }else{
    //     orderBy='minimum_score desc'
    //   }
    // }
    dispatch({
      type: 'resultList/listPage',
      payload: {
        planId,
        paperId,
        departId,
        orderBy,
        page: {
          pageNum: pagination.current,
          pageSize: 10,
        },
      },
    });
  
  };
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'resultList/save',
      payload: {
        paperList: [],
        total: 10,
      },
    });
  }
  render() {
    const { resultList, total, loading, form, treeDepartData, planList, paperList } = this.props;
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
        title: '及格分数',
        dataIndex: 'passScore',
        key: 'passScore',
        width: 140,
        sorter: true,
      },

      {
        title: '分数',
        dataIndex: 'totalScore',
        key: 'totalScore',
        width: 120,
      },
      {
        title: '平均分',
        dataIndex: 'averageScore',
        key: 'averageScore',
        width: 120,
        sorter: true,

      },
      {
        title: '最高分',
        dataIndex: 'highestScore',
        key: 'highestScore',
        width: 120,
        sorter: true,
      },
      {
        title: '最低分',
        dataIndex: 'minimumScore',
        key: 'minimumScore',
        width: 120,
        sorter: true,
      },
      {
        title: '拟定参与人数',
        dataIndex: 'plannedNum',
        key: 'plannedNum',
        width: 150,
      },
      {
        title: '实际参与人数',
        dataIndex: 'totalNum',
        key: 'totalNum',
        width: 150,
      },
      {
        title: '通过人数',
        dataIndex: 'passNum',
        key: 'passNum',
        width: 120,
        sorter: true,
      },
      {
        title: '通过率',
        dataIndex: 'passPercent',
        key: 'passPercent',
        width: 120,
        sorter: true,
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
        sorter: true,
      },
      {
        title: '批卷老师',
        key: 'reviewStaffName',
        dataIndex: 'reviewStaffName',
        width: 120,
      },
      {
        title: '批卷时间',
        dataIndex: 'createDate',
        key: 'createDate',
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
              查看
            </Button>
          </span>
        ),
      },
    ];
    const renderDepartTreeNodes = data => {
      if (data) {
        return data.map(item => {
          if (item.childDepartVOList) {
            return (
              <TreeNode
                value={item.departId}
                title={item.departName}
                key={item.departId}
                dataRef={item}
              >
                {renderDepartTreeNodes(item.childDepartVOList)}
              </TreeNode>
            );
          }
          return (
            <TreeNode
              value={item.departId}
              title={item.departName}
              key={item.departId}
              dataRef={item}
            />
          );
        });
      }
    };
    const planNode = planList.map(item => <Option key={item.planId}>{item.planName}</Option>);
    const paperNode = paperList.map(item => <Option key={item.paperId}>{item.paperName}</Option>);
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
                    dataSource={planList}
                    onSearch={this.onPlanSearch}
                    placeholder="input here"
                  >
                    {planNode}
                  </AutoComplete>,
                )}
              </Form.Item>

              <Form.Item label="试卷名称:">
                {getFieldDecorator('paperId', {
                  rules: [{ required: true, message: '请输入试卷名称！' }],
                })(
                  <AutoComplete
                    dataSource={paperList}
                    onSearch={this.onPaperSearch}
                    placeholder="input here"
                  >
                    {paperNode}
                  </AutoComplete>,
                )}
              </Form.Item>
              <Form.Item label="发布部门">
                {getFieldDecorator('departId', {
                  rules: [{ required: true, message: '请选择发布部门！' }],
                })(
                  <TreeSelect
                    showSearch
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    style={{ width: '200px' }}
                    placeholder="请选择发布部门"
                    allowClear
                    onChange={this.treeChange}
                  >
                    {renderDepartTreeNodes(treeDepartData)}
                  </TreeSelect>,
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
                rowKey={record => `${record.resultId}`}
                columns={columns}
                dataSource={resultList}
                pagination={{
                  total,
                  pageSize: 10,
                  // onChange: (page, pageSize) => {
                  //   this.pageChange(page, pageSize);
                  // },
                }}
                onChange={this.handleTableChange}
                scroll={{ x: 1890 }}
              />
            </Spin>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

const ResultListForm = Form.create({ name: 'resultListForm' })(ResultList);

export default connect(state => ({
  ...state.resultList,
  loading: state.loading.models.resultList,
}))(ResultListForm);
