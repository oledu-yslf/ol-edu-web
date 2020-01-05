import React from 'react';
import { Form, TreeSelect, Input, Button ,Select} from 'antd';
import getUserId from '@/utils/getUserId';
import { connect } from 'dva';
import styles from './index.less';
const { TreeNode } = TreeSelect;
class NewPlan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handlePlanSubmit = e=>{
    
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'questionEdit/save',
      payload: {
        examId: '',
        examDetail: {},
        typeList: [],
      },
    });
  }
  render() {
    const { planDetail, treeDepartData, form, loading } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { planName, planDepartId } = planDetail;
    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 6 },
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
        <Form {...formItemLayout} onSubmit={this.handlePlanSubmit}>
          <Form.Item label="计划名称">
            {getFieldDecorator('planName', {
              initialValue: planName,
              rules: [{ required: true, message: '请输入计划名称！' }],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="发布部门">
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
          <Form.Item label="试卷列表">
            <Button type="primary">
              选择试卷
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={loading}>
              提交
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const NewPlanForm = Form.create({ name: 'NewPlanForm' })(NewPlan);

export default connect(state => ({
  ...state.newPlan,
  loading: state.loading.models.newPlan,
}))(NewPlanForm);
