import React from 'react';
import {connect} from 'dva';
import styles from '@/style/common.less';
import {Form, Input, Icon, Select, Button, TreeSelect, Row, Col, Card, Table,Spin} from 'antd';
import getUserId from '@/utils/getUserId';

const {Option} = Select;
const {TreeNode} = TreeSelect;

let id = 1;

class NewPaperAuto extends React.Component {
  removeForm = k => {
    const {form} = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  addForm = () => {
    const {form} = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes

    form.setFieldsValue({
      keys: nextKeys,
    });
  };
  treeChange = e => {
    const {form} = this.props;
    console.log(form.getFieldValue())
  }
  handleSubmit = e => {

    e.preventDefault();
    const {form, paperId, dispatch} = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const {keys, names} = values;
        console.log(
          'Merged values:',
          keys.map(key => names[key]),
        );
        let randExamCateogries = [];


        names.map((item) => {
          let obj = {};
          obj.randExams = [];
          let objinner = {};
          obj.categoryId = item.categoryId || '';
          objinner.difficultyLevel = item.difficultyLevel || '';
          objinner.examType = item.examType || '';
          objinner.randNum = item.randNum;
          obj.randExams.push(objinner);
          randExamCateogries.push(obj);
        })

        dispatch({
          type: 'teacherPaperList/paperExamRand',
          payload: {
            randExamCateogries,
            createStaffId: getUserId(),
            paperId
          }
        })
      }
    });
  };

  componentWillMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'teacherPaperList/listAllExamCategory',
    });
  }

  render() {
    const {form, categoryTree, loading} = this.props;
    const {getFieldDecorator, getFieldValue} = form;

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
    getFieldDecorator('keys', {initialValue: [0]});
    const keys = getFieldValue('keys');

    const columns = [
      {
        title: '试题分类',
        dataIndex: 'examCategory',
        width: '40px',
        render: (text, record) => (
          <Form.Item >
            {getFieldDecorator(`names[${record}].categoryId`, {
              rules: [{required: true, message: '请选择试题分类！'}],
            })(
              <TreeSelect
                showSearch
                style={{width: '100%'}}
                dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                placeholder="请选择试题分类!"
                allowClear
                onChange={this.treeChange}
              >
                {renderTreeNodes(categoryTree)}
              </TreeSelect>,
            )}
          </Form.Item>
        ),

      },
      {
        title: '试题类型',
        dataIndex: 'examType',
        width: '40px',
        render: (text, record) => (
          <Form.Item>
            {getFieldDecorator(`names[${record}].examType`, {})(
              <Select placeholder="请选择试题类型！">
                <Option value={''}>全部</Option>
                <Option value={1}>单选题</Option>
                <Option value={2}>多选题</Option>
                <Option value={3}>判断题</Option>
                <Option value={4}>问答题</Option>
                <Option value={5}>填空题</Option>
              </Select>,
            )}
          </Form.Item>
        ),
      },
      {
        title: '试题难度',
        dataIndex: 'difficultyLevel',
        width: '40px',
        render: (text, record) => (
          <Form.Item>
            {getFieldDecorator(`names[${record}].difficultyLevel`, {})(
              <Select placeholder="请选择试题难度！">
                <Option value={''}>全部</Option>
                <Option value={0}>易</Option>
                <Option value={1}>较易</Option>
                <Option value={2}>中等</Option>
                <Option value={3}>偏难</Option>
                <Option value={4}>难</Option>
              </Select>,
            )}
          </Form.Item>
        ),
      },
      {
        title: '随机个数',
        dataIndex: 'randNum',
        width: '40px',
        render: (text, record) => (
          <Form.Item >
            {getFieldDecorator(`names[${record}].randNum`, {
              rules: [{required: true, message: '请输入题目数量！'}],
            })(<Input />)}
          </Form.Item>
        ),
      },
      {
        title: '移除',
        dataIndex: 'removeAction',
        width: '20px',
        render: (text, record) => (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.removeForm(record)}
          />
        )
      },
    ];
    return (
      <div className={styles.box}>
          <Form >

            <Table
              style={{width: '600px'}}
              bordered
              dataSource={keys}
              columns={columns}
              pagination={false}
              size="small"
              loading={loading}
            />
            {/*{formItem}*/}
            <Form.Item labelCol={{span: 2}} wrapperCol={{span: 4}}>
              <Button type="dashed" onClick={this.addForm} style={{width: '60%'}}>
                <Icon type="plus"/> 点击增加
              </Button>
            </Form.Item>
            <Form.Item wrapperCol={{span: 4}}>
              <Button type="primary"  onClick={this.handleSubmit}>
                生成试卷
              </Button>
            </Form.Item>

          </Form>
      </div>
    );
  }
}
const NewPaperAutoForm = Form.create({name: 'NewPaperAutoForm'})(NewPaperAuto);

export default connect(state => ({
  ...state.teacherPaperList,
  loading: state.loading.models.teacherPaperList,
}))(NewPaperAutoForm);
