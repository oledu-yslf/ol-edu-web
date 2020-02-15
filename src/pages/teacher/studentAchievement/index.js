import React from 'react';
import moment from 'moment';
import router from 'umi/router';
import { Button, Table, Spin, Form,AutoComplete, TreeSelect } from 'antd';
import { connect } from 'dva';
import styles from '../../../style/common.less';
const { TreeNode } = TreeSelect;
const { Option } = AutoComplete;

class StudentAchievement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  onTabClick = e => {
    router.push(e);
  };

  handleSearchSubmit = e => {
    e.preventDefault();
    const { dispatch, form,pageSize } = this.props;
    const value = form.getFieldsValue();
    const { paperId, planId, departId } = value;
    dispatch({
      type: 'studentAchievement/listPage',
      payload: {
        paperId,
        planId,
        departId,
        page: {
          pageNum: 1,
          pageSize,
        },

      },
    });
  };

  queryPaper = record =>{
    router.push(
      `/teacher/studentAchieveList?paperId=${record.paperId}&staffId=${record.reviewStaffId}&planId=${record.planId}&departId=${record.departId}`,
    );
  }
  paperZone = record => {
    router.push(
      `/paperZone?planId=${record.planId}&paperId=${record.paperId}&departId=${record.departId}`,
    );
  };

  pageChange = (page,pageSize) => {
    const { dispatch, form } = this.props;
    const value = form.getFieldsValue();
    const { paperId, planId, departId } = value;

    dispatch({
      type: 'studentAchievement/listPage',
      payload: {
        paperId,
        planId,
        departId,
        page: {
          pageNum: page,
          pageSize,
        },
      },
    });
  };
  componentWillMount() {
    const { dispatch, pageSize} = this.props;
    dispatch({
      type: 'studentAchievement/init',
      payload: {
        page: {
          pageNum: 1,
          pageSize,
        },
      },
    });
  }

  render() {
    const { achievementList, total,pageSize, loading, form, treeDepartData, condPlanList,condPaperList} = this.props;
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
        title: '平均分',
        key: 'averageScore',
        dataIndex: 'averageScore',
      },
      {
        title: '最高分',
        key: 'highestScore',
        dataIndex: 'highestScore',
      },
      {
        title: '最低分',
        key: 'minimumScore',
        dataIndex: 'minimumScore',
      },
      {
        title: '拟定参与人数',
        key: 'plannedNum',
        dataIndex: 'plannedNum',
      },
      {
        title: '实际参与人数',
        key: 'totalNum',
        dataIndex: 'totalNum',
      },
      {
        title: '通过人数',
        dataIndex: 'passNum',
        key: 'passNum',
      },
      {
        title: '通过率',
        dataIndex: 'passPercent',
        key: 'passPercent',
        render:(text,record)=>(
          <span>{text+'%'}</span>
        )
      },
      {
        title: '部门',
        dataIndex: 'departName',
        key: 'departName',
      },
      {
        title: '开始时间',
        dataIndex: 'createDate',
        key: 'createDate',
        render: text => <span>{moment(parseInt(text)).format('YYYY/MM/DD HH:MM:SS')}</span>,
      },
      {
        title: '批卷老师',
        dataIndex: 'reviewStaffName',
        key: 'reviewStaffName',
      },
      {
        title: '批卷时间',
        dataIndex: 'effDate',
        key: 'effDate',
        render: text => <span>{moment(parseInt(text)).format('YYYY/MM/DD HH:MM:SS')}</span>,
      },
      {
        title: '操作',
        key: 'action',
        dataIndex: 'action',
        width:110,
        render: (text, record) => (
          <span>
            <a  onClick={e => this.queryPaper(record, e)}>
              详情
            </a>
            <span style={{ marginRight: '5px' }}></span>
            <a  onClick={e => this.paperZone(record, e)}>
              分布图
            </a>
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
    const planNode = condPlanList?condPlanList.map(item => <Option key={item.planId}>{item.planName}</Option>):'';
    const paperNode = condPaperList?condPaperList.map(item => <Option key={item.paperId}>{item.paperName}</Option>):'';
    return (

    <div className={styles.box}>
      <Spin spinning={loading}>
            <Form layout="inline">
              <Form.Item label="考试计划:">
                {getFieldDecorator('planId', {
                })(
                  <AutoComplete
                    filterOption={(inputValue, option) =>
                      option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                  >
                    {planNode}
                  </AutoComplete>,
                )}
              </Form.Item>

              <Form.Item label="试卷名称:">
                {getFieldDecorator('paperId', {
                })(
                  <AutoComplete
                    filterOption={(inputValue, option) =>
                    option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                  >
                    {paperNode}
                  </AutoComplete>,
                )}
              </Form.Item>
              <Form.Item label="发布部门">
                {getFieldDecorator('departId', {
                })(
                  <TreeSelect
                    showSearch
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    style={{ width: '200px' }}
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

              <Table
                rowKey={record => `${record.paperId}-${record.planDetailId}`}
                columns={columns}
                dataSource={achievementList}
                pagination={{
                  total,
                  pageSize,
                  onChange: (page,pageSize) => {
                    this.pageChange(page,pageSize);
                  },
                }}
              />
            </Spin>
      </div>
    );
  }
}

const StudentAchievementForm = Form.create({ name: 'studentAchievementForm' })(
  StudentAchievement,
);

export default connect(state => ({
  ...state.studentAchievement,
  loading: state.loading.models.studentAchievement,
}))(StudentAchievementForm);
