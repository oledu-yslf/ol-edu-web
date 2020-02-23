import React from 'react';
import { Modal, Form, Table, Row, Col,Divider,Input, Select,Button,Spin,TreeSelect } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import getUserId from '@/utils/getUserId';
import style from '../index.less'
import { cloneDeep } from 'lodash';

const { Option } = Select;
const {TreeNode} = TreeSelect;

class ExamListModal extends React.Component {

  constructor(props) {
    super(props);
  }
  pageChange = (page, pageSize) => {
    const { dispatch } = this.props;
    let result = this.props.form.getFieldsValue();
    dispatch({
      type: 'newPaperManual/listPageExam',
      payload: {
        categoryId:result.examCategory,
        examType:result.examType,
        difficultyLevel:result.difficultyLevel,
        examName:result.examName,

        page: {
          pageNum: page,
          pageSize: pageSize,
        },
      },
    });
  };

  handleCancel = e => {
    const { dispatch } = this.props;
    dispatch({
      type: 'newPaperManual/save',
      payload: {
        examListVisible: false,
      },
    });
  };

  componentWillMount() {
    const { dispatch,pageNum,pageSize } = this.props;
    dispatch({
      type: 'newPaperManual/initExamModal',
      payload: {
        page:{
          pageNum,
          pageSize,
        }
      },
    });
  }


  handleSearchSubmit = e =>{
    const { dispatch } = this.props;
    let result = this.props.form.getFieldsValue();
    dispatch({
      type: 'newPaperManual/listPageExam',
      payload: {
        categoryId:result.examCategory,
        examType:result.examType,
        difficultyLevel:result.difficultyLevel,
        examName:result.examName,
      },
    });
  }

  initChecked = (record) => {
    const { paperExamSummery } = this.props;
    for (let i in paperExamSummery){
      const {paperExamVOList} = paperExamSummery[i];
      for(let j in paperExamVOList){
        if (paperExamVOList[j].examId == record.examId){
          return true;
        }
      }
    }

    return false;
  }
  addExamToPaper = (record) => {
    const { paperExamSummery,dispatch} = this.props;
    //////////////////////////////
    if(paperExamSummery[record.examType] == null){
      //构造试题对象
      let obj = {};
      obj.count = 1;
      obj.totalScore = record.mark;
      obj.examType = record.examType;

      let paperExamVOList = [];
      //试题的选项数组数据需要转化为试卷试题的数组。

      record.paperExamAttrVOS = cloneDeep(record.baseExamAttrVOList);
      paperExamVOList.push(record);
      obj.paperExamVOList = paperExamVOList;

      paperExamSummery[record.examType] = obj;

    } else {
      //判断下试题是否存在，
      for (let i in paperExamSummery[record.examType].paperExamVOList){
        if(paperExamSummery[record.examType].paperExamVOList[i].examId == record.examId){
          //会提已经存在数组中直接返回成功。
          return ;
        }
      }

      paperExamSummery[record.examType].count = paperExamSummery[record.examType].count + 1;
      paperExamSummery[record.examType].totalScore = paperExamSummery[record.examType].totalScore + record.mark;

      record.paperExamAttrVOS = cloneDeep(record.baseExamAttrVOList);

      paperExamSummery[record.examType].paperExamVOList.push(record);
    }

    let newPaperExamSummery = [];
    paperExamSummery.map((item,k) => {
      newPaperExamSummery[k] = cloneDeep(item);
    })

    dispatch({
      type: 'newPaperManual/save',
      payload: {
        paperExamSummery:newPaperExamSummery
      },
    });

  }
  removeExamToPaper = (record) => {
    const { paperExamSummery,dispatch} = this.props;
    //////////////////////////////
    if(paperExamSummery[record.examType] == null){
      return ;
    } else {
      paperExamSummery[record.examType].count = paperExamSummery[record.examType].count - 1;
      paperExamSummery[record.examType].totalScore = paperExamSummery[record.examType].totalScore - record.mark;

      let paperExamVOList = paperExamSummery[record.examType].paperExamVOList;

      for (let i in paperExamVOList){
        if (paperExamVOList[i].examId == record.examId){
          paperExamVOList.splice(i,1);
          break;
        }
      }

      let newPaperExamSummery = [];
      paperExamSummery.map((item,k) => {
        if (item.paperExamVOList.length != 0){
          newPaperExamSummery[k] = cloneDeep(item);
        }

      })

      dispatch({
        type: 'newPaperManual/save',
        payload: {
          paperExamSummery:newPaperExamSummery
        },
      });
    }
  }
  selectAll = (selected,changeRows) => {
    if (selected == true){
      for (let i in changeRows){
        this.addExamToPaper(changeRows[i]);
      }
    } else {
      for (let i in changeRows){
        this.removeExamToPaper(changeRows[i]);
      }
    }
  }
  render() {
    const {  examList, total, examListVisible, loading, form,categoryTree,pageSize, paperExamSummery,dispatch} = this.props;
    const { getFieldDecorator } = form;
    const columns = [
      {
        title: '试题名称',
        dataIndex: 'examName',
        key: 'examName',
        width: 200,
        render: text =>(
          <div dangerouslySetInnerHTML={{ __html: text }} />
        )
      },
      {
        title: '试题类型',
        dataIndex: 'examType',
        key: 'examType',
        render: text => (
          <span>
            {text === 1
              ? '单选题'
              : text === 2
                ? '多选题'
                : text === 3
                  ? '判断题'
                  : text === 4
                    ? '问答题'
                    : text === 5
                    ? '填空题'
                      :'未知'}
          </span>
        ),
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate',
        render: text => <span>{moment(parseInt(text)).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '难度',
        dataIndex: 'difficultyLevel',
        key: 'difficultyLevel',
        render: text => (
          <span>
            {text === 0
              ? '易'
              : text === 1
                ? '较易'
                : text === 2
                  ? '中等'
                  : text === 3
                    ? '偏难'
                    : '难'}
          </span>
        ),
      },

      {
        title: '分数',
        dataIndex: 'mark',
        key: 'mark',
        // render: text => <span>{moment(parseInt(text)).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '上传人员',
        key: 'createStaffName',
        dataIndex: 'createStaffName',
      },
    ];

    // rowSelection object indicates the need for row selection
    const rowSelection = {
      onSelect:(record, selected, selectedRows, nativeEvent) => {
        if (selected == true){
          this.addExamToPaper(record)
        } else {
          this.removeExamToPaper(record)
        }

      },
      onSelectAll:(selected, selectedRows, changeRows) => {
        this.selectAll(selected,changeRows);
      },

      getCheckboxProps: record => ({
        /*disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,*/

        defaultChecked:this.initChecked(record),    //设置默认选中项
      }),
    };

    const renderTreeNodes = data => {
      if (data) {
        return data.map(item => {
          if (item.childExamCategoryList) {
            return (
              <TreeNode
                value={item.categoryId}
                title={item.categoryName}
                key={`${item.categoryName}-${item.categoryId}-${item.floor}`}
                dataRef={item}
              >
                {renderTreeNodes(item.childExamCategoryList)}
              </TreeNode>
            );
          }
          return (
            <TreeNode
              value={item.categoryId}
              title={item.categoryName}
              key={`${item.categoryName}-${item.categoryId}-${item.floor}`}
              dataRef={item}
            />
          );
        });
      }
    };

    return (
      <Modal
        class={style.box}
        title="新增试卷"
        visible={examListVisible}
        onCancel={this.handleCancel}
        onOk={this.handleCancel}
        confirmLoading={loading}
        width={1000}
        destroyOnClose
      >
        <Spin spinning={loading}>
        <Row>
        <Col span={24}>
          <Form layout="inline">
            <Form.Item label="试题分类:">
              {getFieldDecorator('examCategory', {

              })(
                <TreeSelect
                  showSearch
                  style={{ width: '120px' }}
                  dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                  placeholder="请选择试题分类!"
                  allowClear
                  onChange={this.treeChange}
                >
                  {renderTreeNodes(categoryTree)}
                </TreeSelect>,
              )}
            </Form.Item>

            <Form.Item label="试题类型:">
              {getFieldDecorator('examType', {
                initialValue: '',
              })(
                <Select style={{ width: '120px' }}>
                  <Option value={''}>全部</Option>
                  <Option value={1}>单选题</Option>
                  <Option value={2}>多选题</Option>
                  <Option value={3}>判断题</Option>
                  <Option value={4}>问答题</Option>
                  <Option value={5}>填空题</Option>
                </Select>,
              )}
            </Form.Item>
            <Form.Item label="难度等级:">
              {getFieldDecorator('difficultyLevel', {
                initialValue: '',
              })(
                <Select style={{ width: '120px' }}>
                  <Option value={''}>全部</Option>
                  <Option value={0}>易</Option>
                  <Option value={1}>较易</Option>
                  <Option value={2}>中等</Option>
                  <Option value={3}>偏难</Option>
                  <Option value={4}>难</Option>
                </Select>,
              )}
            </Form.Item>
            <Form.Item label="试题名称:">
              {getFieldDecorator('examName', {
                initialValue: '',
              })(<Input style={{ width: '120px' }} />)}
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                icon="search"
                onClick={this.handleSearchSubmit}
              >
                查询
              </Button>
            </Form.Item>
          </Form>

          <Table
            rowSelection={rowSelection}
            rowKey={record => record.examId}
            columns={columns}
            dataSource={examList}
            pagination={{
              total,
              pageSize,
              onChange: (page, pageSize) => {
                this.pageChange(page, pageSize);
              },
            }}
          />

        </Col>
        </Row>
      </Spin>
      </Modal>
    );
  }
}

const ExamListForm = Form.create({ name: 'newPaperForm' })(ExamListModal);

export default connect(state => ({
  ...state.newPaperManual,
  loading: state.loading.models.newPaperManual,
}))(ExamListForm);
