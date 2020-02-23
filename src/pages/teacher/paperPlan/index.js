import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Button, Table, Spin, Form, Input, Divider, Radio, Tabs } from 'antd';
import styles from './index.less';
import NewPlanModal from './components/newPlanModal'

const { TabPane } = Tabs;

class PaperPlan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onTabClick = e => {
    router.push(e);
  };
  handleRouterChange = e => {
    console.log(e);
    router.push(e.target.value);
  };
  newPaperPlan = e => {
    const { dispatch } = this.props;
    // this.setState({
    //   paperPlanListVOList:[]
    // })
    dispatch({
      type: 'paperPlan/save',
      payload: {
        newPlanVisible: true,
        planId:'',
        paperPlanListVOList:[],
        planDetail:{}
      },
    });

  };

  queryPlan = record => {
    router.push(`/teacher/planDetail?planId=${record.planId}`);
  };
  editPlan = record => {
    // router.push(`/teacher/newPlan?planId=${record.planId}`);
    const { dispatch } = this.props;
    dispatch({
      type: 'paperPlan/listDetailPage',
      payload: {
        planId:record.planId,
        newPlanVisible: true,
      },
    });
    dispatch({
      type: 'paperPlan/save',
      payload: {
        newPlanVisible: true,
      },
    });
  };
  deletePlan = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'paperPlan/paperPlanUpdate',
      payload: {
        planId: record.planId,
      },
    });
  };

  componentWillMount() {
    const { dispatch, pageSize} = this.props;
    dispatch({
      type: 'paperPlan/init',
      payload: {
        page: {
          pageNum: 1,
          pageSize,
        },
      },
    });
  }

  handleSearchSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const value = form.getFieldsValue();
    const { planName } = value;

    dispatch({
      type: 'paperPlan/listPage',
      payload: {
        planName,
      },
    });
  };

  pageChange = (page, pageSize) => {
    const { dispatch, form } = this.props;
    const value = form.getFieldsValue();
    const { planName } = value;
    dispatch({
      type: 'paperPlan/listPage',
      payload: {
        planName,
        page: {
          pageNum: page,
          pageSize: 10,
        },
      },
    });
  };

  render() {
    const { planList, total, loading, form, newPlanVisible,planId } = this.props;
    const { getFieldDecorator } = form;

    const columns = [
      {
        title: '计划名称',
        dataIndex: 'planName',
        key: 'planName',
        width: 200,
      },
      {
        title: '部门',
        dataIndex: 'departName',
        key: 'departName',
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate',
        render: text => <span>{moment(parseInt(text)).format('YYYY-MM-DD')}</span>,
      },

      {
        title: '上传人员',
        key: 'createStaffName',
        dataIndex: 'createStaffName',
      },
      {
        title: '操作',
        key: 'action',
        dataIndex: 'action',
        width:'140px',
        render: (text, record) => (
          <span>
            <a type="link" onClick={e => this.editPlan(record, e)}>
              编辑
            </a>
            <span style={{ marginRight: '5px' }}></span>
            <a type="link" onClick={e => this.queryPlan(record, e)}>
              查看
            </a>
            <span style={{ marginRight: '5px' }}></span>
            <a type="link" onClick={e => this.deletePlan(record, e)}>
              删除
            </a>
          </span>
        ),
      },
    ];

    return (
      <div className={styles.box} style={{marginTop:'20px'}}>
            <Radio.Group
              defaultValue="/teacher/paperPlan"
              onChange={this.handleRouterChange}
              style={{ marginBottom: '20px' }}
            >
              <Radio.Button value="/teacher/paperList">试卷添加</Radio.Button>
              <Radio.Button value="/teacher/paperPlan">试卷发布</Radio.Button>
            </Radio.Group>
            <Form layout="inline" onSubmit={this.handleSubmit}>
              <Form.Item label="发布计划名称:">
                {getFieldDecorator('planName', {})(<Input />)}
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
              <Form.Item>
                <Button type="primary" htmlType="submit" onClick={this.newPaperPlan}>
                  新增
                </Button>
              </Form.Item>
            </Form>
            <Spin spinning={loading}>
              <Table
                rowKey={record => record.planId}
                columns={columns}
                dataSource={planList}
                pagination={{
                  total,
                  pageSize: 10,
                  onChange: (page, pageSize) => {
                    this.pageChange(page, pageSize);
                  },
                }}
              />
            </Spin>

        <NewPlanModal newPlanVisible={newPlanVisible} planId={planId}></NewPlanModal>
      </div>
    );
  }
}
const PaperPlanForm = Form.create({ name: 'PaperPlanForm' })(PaperPlan);

export default connect(state => ({
  ...state.paperPlan,
  loading: state.loading.models.paperPlan,
}))(PaperPlanForm);
