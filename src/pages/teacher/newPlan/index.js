import React from 'react';
import moment from 'moment';
import router from 'umi/router';
import { Button, Table, Spin, Form,AutoComplete, TreeSelect,Input } from 'antd';
import { connect } from 'dva';
import styles from '../../../style/common.less';
import ExmaListModal from './components/examListModal'
import * as Util from '@/utils/util';
const { TreeNode } = TreeSelect;
const { Option } = AutoComplete;


class NewPlan extends React.Component {
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
      type: 'newPlan/listPage',
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


  handleChange = (pager,filters,sorter) => {

    const { dispatch, form } = this.props;
    const value = form.getFieldsValue();
    const { paperId, planId, departId } = value;

    let orderBy = "";

    if (sorter.order){
      if (sorter.order === 'ascend'){
        orderBy = `${sorter.column.sortField} asc`;
      } else if (sorter.order === 'descend'){
        orderBy = `${sorter.column.sortField} desc`;
      }
    }

    dispatch({
      type: 'newPlan/listPage',
      payload: {
        paperId,
        planId,
        departId,
        orderBy,
        page: {
          pageNum: pager.current,
          pageSize:pager.pageSize
        },
      },
    });
  };
  componentWillMount() {
    const { dispatch} = this.props;
    const { query } = this.props.location
    dispatch({
      type: 'newPlan/init',
      payload: {
        planId:query.planId
      },
    });
  }
  selExam= e =>{
    const { dispatch} = this.props;
    dispatch({
      type: 'newPlan/save',
      payload: {
        examListVisible:true,
      },
    })

  }

  examListMakeUp = (value) => {

    console.log("examListMakeUp",value)
    const { dispatch,paperPlanListVOList} = this.props;


    dispatch({
      type: 'save',
      payload: {
        paperPlanListVOList:paperPlanListVOList.push(value[0])
      },
    });

  }

  render() {
    const { paperPlanListVOList, loading, form, treeDepartData,examListVisible} = this.props;
    const { getFieldDecorator } = form;
    const columns = [
      {
        title: '试卷名称',
        dataIndex: 'paperVO.paperName',
      },
      {
        title: '试卷类型',
        dataIndex: 'paperVO.paperType',
        render: (text,record) => {
          return <span>{text == 0 ? '作业' : '试卷'}</span>
        }
      },

      {
        title: '创建时间',
        dataIndex: 'createDate',
        render: text => <span>{text ?moment(parseInt(text)).format('YYYY-MM-DD HH:MM:SS') :'-'}</span>,
      },
      {
        title: '分数',
        dataIndex: 'paperVO.totalScore',
      },
      {
        title: '创建人员',
        dataIndex: 'paperVO.createStaffName',
        sortField:'paperVO.createStaffName',
      },
      {
        title: '时长',
        dataIndex: 'duration',
      },
      {
        title: '开始时间',
        dataIndex: 'effDate',
        render: text => <span>{text ?moment(parseInt(text)).format('YYYY-MM-DD HH:MM:SS') :'-'}</span>,
      },
      {
        title: '批卷老师',
        dataIndex: 'reviewStaffName',
      },
      {
        title: '操作',
        dataIndex: 'action',
        width:110,
        render: (text, record) => (
          <span>
            <a  onClick={e => this.delete(record, e)}>
              移除
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


    return (

      <div className={styles.box}>
        <Spin spinning={loading}>
          <Form layout="inline">
            <Form.Item label="计划名称:">
              {getFieldDecorator('planId', {
              })(
                <Input/>
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
            <span className={styles.chooseExam} onClick={this.selExam}>试卷选择</span>
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
            dataSource={paperPlanListVOList}
            pagination={false}
          />
        </Spin>

        <ExmaListModal examListVisible={examListVisible} getStockInfo={(e) => {this.examListMakeUp(e)}}></ExmaListModal>



      </div>
    );
  }
}


const NewPlanForm = Form.create({ name: 'newPlanForm' })(
  NewPlan,
);

export default connect(state => ({
  ...state.newPlan,
  loading: state.loading.models.newPlan,
}))(NewPlanForm);
