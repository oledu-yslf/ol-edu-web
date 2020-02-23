import React from 'react';
import {Modal, Transfer, Table, Select, Form, Button, Input } from 'antd';
import difference from 'lodash/difference';
import { connect } from 'dva';
import * as Util from '@/utils/util';
import moment from 'moment';
const { Option } = Select;

const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
  <Transfer {...restProps} showSelectAll={false}>
    {({
        direction,
        filteredItems,
        onItemSelectAll,
        onItemSelect,
        selectedKeys: listSelectedKeys,
        disabled: listDisabled,
      }) => {
      const columns = direction === 'left' ? leftColumns : rightColumns;

      const rowSelection = {
        getCheckboxProps: item => ({ disabled: listDisabled || item.disabled }),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter(item => !item.disabled)
            .map(({ key }) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, listSelectedKeys)
            : difference(listSelectedKeys, treeSelectedKeys);
          onItemSelectAll(diffKeys, selected);
        },
        onSelect(item, selected) {
          console.log(item)
          onItemSelect(item.key, selected);
        },
        selectedRowKeys: listSelectedKeys,
      };

      return (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredItems}
          size="small"
          style={{ pointerEvents: listDisabled ? 'none' : null }}
          onRow={({ item, disabled: itemDisabled }) => ({
            onClick: () => {
              if (itemDisabled || listDisabled) return;
              onItemSelect(item, !listSelectedKeys.includes(item.key));
            },
          })}
        />
      );
    }}
  </Transfer>
);


const leftTableColumns = [
  {
    title: '序号',
    dataIndex: '',
    render: (text,record,index) => {
      return <span>{Number(index)+1}</span>
    }

  },
  {
    title: '试卷名称',
    dataIndex: 'paperName',
  },
  {
    title: '试卷类型',
    dataIndex: 'paperType',
    render: (text,record) => {
      return <span>{text == 0 ? '作业' : '试卷'}</span>
    }
  },

  {
    title: '创建时间',
    dataIndex: 'createDate',
    render: text => <span>{text ?moment(parseInt(text)).format('YYYY-MM-DD HH:MM:ss') :'-'}</span>,
  },
  {
    title: '及格分数',
    dataIndex: 'passScore',
  },
  {
    title: '分数',
    dataIndex: 'totalScore',
  },
  {
    title: '创建人员',
    dataIndex: 'createStaffName',
  },
];
const rightTableColumns = [
  {
    title: '试卷名称',
    dataIndex: 'paperName',
  },
];

class ExamListModal extends React.Component {
  state = {
    targetKeys: [],
    disabled: false,
    showSearch: false,
  };

  onOk = () => {
    const {dispatch, examList} = this.props;
    const { targetKeys } = this.state;

    let selList = []


     examList.forEach((item,index)=>{
      debugger
      if(targetKeys.includes(item.paperId)){
        selList.push(item)
      }
    })


    console.log("targetKeys",targetKeys)
    console.log("examList",examList)
    console.log("selList",selList)

    this.props.getStockInfo(selList)
    dispatch({
      type:'paperPlan/save',
      payload:{
        examListVisible:false
      }
    })
  };

  onClose = () => {
    const {dispatch} = this.props;
    dispatch({
      type:'paperPlan/save',
      payload:{
        examListVisible:false
      }
    })
  };

  queryExamList = e =>{
    const { dispatch, form } = this.props;
    const value = form.getFieldsValue();
    dispatch({
      type: 'paperPlan/examList',
      payload: {
        paperType:value.paperType,
        paperName:value.paperName,
        page: {
          pageNum: 1,
          pageSize: 10000,
        },
        createStaffId: Util.getStaffId(),
      },
    });
  }

  onChange = nextTargetKeys => {
    console.log(nextTargetKeys)

    this.setState({ targetKeys: nextTargetKeys });
  };

  render() {
    const { confirmLoading, examList,examListVisible, form} = this.props;
    const { targetKeys, disabled, showSearch } = this.state;
    const { getFieldDecorator } = form;

    // console.log(examList.map(item => item.paperId))
    return (
      <Modal
        visible={examListVisible}
        title={'试卷列表'}
        okText="保存"
        cancelText="取消"
        onCancel={this.onClose}
        onOk={this.onOk}
        confirmLoading={confirmLoading}
        width='80%'
      >
        {/*<Form layout="inline">*/}
          {/*<Form.Item label="试题名称:">*/}
            {/*{getFieldDecorator('paperType')(<Input style={{ width: '120px' }} />)}*/}
          {/*</Form.Item>*/}
          {/*<Form.Item label="试题类型:">*/}
            {/*{getFieldDecorator('paperName')*/}
            {/*(<Select style={{ width: '120px' }}>*/}
              {/*<Option value={''}>全部</Option>*/}
              {/*<Option value={0}>作业</Option>*/}
              {/*<Option value={1}>试卷</Option>*/}
            {/*</Select>)}*/}
          {/*</Form.Item>*/}
          {/*<Form.Item>*/}
            {/*<Button*/}
              {/*type="primary"*/}
              {/*htmlType="submit"*/}
              {/*icon="search"*/}
              {/*onClick={this.queryExamList}*/}
            {/*>*/}
              {/*查询*/}
            {/*</Button>*/}
          {/*</Form.Item>*/}
        {/*</Form>*/}
        <TableTransfer
          dataSource={examList}
          targetKeys={targetKeys}
          disabled={disabled}
          showSearch={showSearch}
          onChange={this.onChange}
          filterOption={(inputValue, item) =>
            item.paperId.indexOf(inputValue) !== -1
          }
          leftColumns={leftTableColumns}
          rightColumns={rightTableColumns}
        />
      </Modal>
    );
  }
}


const ExamListModalForm = Form.create({ name: 'examListModalForm' })(ExamListModal);

export default connect(state => ({
  ...state.paperPlan,
  loading: state.loading.models.paperPlan,
}))(ExamListModalForm);
