import React from 'react';
import { Form, TreeSelect, Input, Button, AutoComplete, Table ,DatePicker} from 'antd';
import getUserId from '@/utils/getUserId';
import { connect } from 'dva';
import moment from 'moment';
import PaperListModal from './components/PaperListModal';
import styles from './index.less';
const { TreeNode } = TreeSelect;
const { Option } = AutoComplete;

class NewPlan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handlePaperModalShow = e => {
    const { dispatch } = this.props;
    dispatch({
      type: 'newPlan/save',
      payload: {
        paperListModalVisbile: true,
      },
    });
  };

  handlePlanSubmit = e => {
    e.preventDefault();
    const { form, planId, dispatch } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const { name, planName,planDepartId } = values;
        const paperPlanListSaves = [];
        console.log(name);
        Object.keys(name).forEach((key, i) => {
          let obj = {};
          obj.duration = name[key].duration;
          obj.paperId = key;
          obj.reviewStaffId = name[key].reviewStaffId;
          obj.effDate = name[key].effDate.valueOf();
          paperPlanListSaves.push(obj);
        });
        
        dispatch({
          type:'newPlan/paperPlanSave',
          payload:{
            planName,planDepartId,createStaffId:getUserId(),paperPlanListSaves
          }
        })
      }
    });
  };
  onTeacherSearch = searchText => {
    const {dispatch} = this.props;
    dispatch({
      type:'newPlan/staffList',
      payload:{
        staffName:searchText
      }
    })
    this.setState({
      dataSource: !searchText ? [] : [searchText, searchText.repeat(2), searchText.repeat(3)],
    });
  };
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'newPlan/save',
      payload: {
        examId: '',
        examDetail: {},
        typeList: [],
      },
    });
  }
  render() {
    const {
      planDetail,
      treeDepartData,
      selectedPapers,
      form,
      loading,
      paperListModalVisbile,
      staffList
    } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { planName, planDepartId } = planDetail;
    const staffNode = staffList.map(item => <Option key={item.staffId}>{item.staffName}</Option>);

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
        title: '时长',
        key: 'duration',
        dataIndex: 'duration',
        render: (text, record) => (
          <Form.Item>
            {getFieldDecorator(`name[${record.paperId}][duration]`, {
              initialValue: text,
              rules: [{ required: true, message: '请输入计划名称！' }],
            })(<Input />)}
          </Form.Item>
        ),
        width:160
      },
      {
        title: '开始时间',
        key: 'effDate',
        dataIndex: 'effDate',
        render: (text, record) => (
          <Form.Item>
            {getFieldDecorator(`name[${record.paperId}][effDate]`, {
              initialValue: text,
              rules: [{ required: true, message: '请输入开始时间！' }],
            })(<DatePicker />)}
          </Form.Item>
        ),
        width:180
      },
      {
        title: '批卷老师',
        key: 'reviewStaffId',
        dataIndex: 'reviewStaffId',
        render: (text, record) => (
          <Form.Item>
            {getFieldDecorator(`name[${record.paperId}][reviewStaffId]`, {
              initialValue: text,
              rules: [{ required: true, message: '请输入批卷老师！' }],
            })(<AutoComplete
              dataSource={staffList}
              onSearch={this.onTeacherSearch}
              placeholder="input here"
            >
              {staffNode}
            </AutoComplete>)}
          </Form.Item>
        ),
        width:160
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <a>移除</a>
          </span>
        ),        
        width:100
      },
    ];
    const formItemLayout = {
      labelCol: {
        xs: { span: 2 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 8 },
        sm: { span: 8 },
      },
    };
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
    return (
      <div className={styles.box}>
        <Form  onSubmit={this.handlePlanSubmit}>
          <Form.Item label="计划名称" {...formItemLayout}>
            {getFieldDecorator('planName', {
              initialValue: planName,
              rules: [{ required: true, message: '请输入计划名称！' }],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="发布部门" {...formItemLayout}>
            {getFieldDecorator('planDepartId', {
              initialValue: planDepartId,
              rules: [{ required: true, message: '请选择发布部门！' }],
            })(
              <TreeSelect
                showSearch
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="请选择发布部门"
                allowClear
                onChange={this.treeChange}
              >
                {renderDepartTreeNodes(treeDepartData)}
              </TreeSelect>,
            )}
          </Form.Item>
          <Form.Item label="试卷列表" {...formItemLayout}>
            <Button type="primary" onClick={this.handlePaperModalShow}>
              选择试卷
            </Button>
          </Form.Item>
          <Table rowKey={record => record.paperId} columns={columns} dataSource={selectedPapers} />
          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={loading}>
              提交
            </Button>
          </Form.Item>
        </Form>
        <PaperListModal paperListModalVisbile={paperListModalVisbile} />
      </div>
    );
  }
}

const NewPlanForm = Form.create({ name: 'NewPlanForm' })(NewPlan);

export default connect(state => ({
  ...state.newPlan,
  loading: state.loading.models.newPlan,
}))(NewPlanForm);
