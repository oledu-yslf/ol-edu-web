import React from 'react';
import moment from 'moment';
import router from 'umi/router';
import {  Button, Table, Spin, Form, AutoComplete } from 'antd';
import { connect } from 'dva';
import styles from '../../../style/common.less';
const { Option } = AutoComplete;

class StudentAchieveList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onTabClick = e => {
    router.push(e);
  };

  handleSearchSubmit = e => {
    e.preventDefault();
    const { dispatch, form,pageSize } = this.props;
    const value = form.getFieldsValue();
    const { staffId } = value;
    const {query} = this.props.location;
    dispatch({
      type: 'studentAchieveList/listPage',
      payload: {
        staffId,
        paperId:query.paperId,
        planId:query.planId,
        departId:query.departId,
        page: {
          pageNum: 1,
          pageSize,
        },
      },
    });
  };

  queryPaper = record =>{
    router.push(
      `/teacher/studentAchieveDetail?paperId=${record.paperId}&staffId=${record.staffId}&planDetailId=${record.planDetailId}`,
    );
  }

  pageChange = (page, pageSize) => {
    const { dispatch, form } = this.props;
    const value = form.getFieldsValue();
    const { staffId} = value;
    const {query} = this.props.location;
    dispatch({
      type: 'studentAchieveList/listPage',
      payload: {
        staffId,
        paperId:query.paperId,
        planId:query.planId,
        departId:query.departId,
        page: {
          pageNum: page,
          pageSize,
        },
      },
    });
  };

  handleExportAll = e =>{
    e.preventDefault();

/*    dispatch({
      type: 'studentAchieveList/avgDetailExport',
      payload: {
        planId:query.planId,
        paperId:query.paperId,
        departId:query.departId,
      },
    });*/


    const { dispatch} = this.props;
    const {query} = this.props.location;

    const fileName = `${query.departName}_成绩.xlsx`;

    dispatch({
      type: 'studentAchieveList/avgDetailExport',
      payload: {
        planId:query.planId,
        paperId:query.paperId,
        departId:query.departId,
      },
      callback: blob => {
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, fileName);
        } else {
          const link = document.createElement('a');
          const evt = document.createEvent('MouseEvents');
          link.style.display = 'none';
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          document.body.appendChild(link); // 此写法兼容可火狐浏览器
          evt.initEvent('click', false, false);
          link.dispatchEvent(evt);
          document.body.removeChild(link);
        }
      }
    });

  }

  componentWillMount() {
    const { dispatch,pageSize } = this.props;
    const {query} = this.props.location

    dispatch({
      type: 'studentAchieveList/init',
      payload: {
        page:{
          pageNum:1,
          pageSize,
        },
        ...query
      },
    });
  }

  render() {
    const { achieveList, pageSize,total, loading, form,studentList } = this.props;
    const { getFieldDecorator } = form;
    const columns = [
      {
        title: '考试计划',
        dataIndex: 'planName',
      },
      {
        title: '试卷名称',
        dataIndex: 'paperName',
      },
      {
        title: '学生',
        dataIndex: 'staffName',
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
        title: '是否通过',
        dataIndex: 'highestScore',
        render: (text, record) => (
          <span>{record.score>=record.passScore?'是':'否'}</span>
        )
      },
      {
        title: '得分',
        dataIndex: 'score',
      },
      {
        title: '时长(分钟)',
        dataIndex: 'duration',
      },
      {
        title: '部门',
        dataIndex: 'departName',
      },
      {
        title: '开始时间',
        dataIndex: 'effDate',
        render: text => <span>{moment(parseInt(text)).format('YYYY/MM/DD HH:MM:SS')}</span>,
      },
      {
        title: '批卷老师',
        dataIndex: 'reviewStaffName',
        render:(text,record)=>(
          <span>{text+'%'}</span>
        )
      },
      {
        title: '批卷时间',
        dataIndex: 'reviewDate',
        render: text => <span>{moment(parseInt(text)).format('YYYY/MM/DD HH:MM:SS')}</span>,
      },
      {
        title: '操作',
        dataIndex: 'action',
        width:100,
        render: (text, record) => (
          <span>
            <Button type="link" onClick={e => this.queryPaper(record, e)}>
              详情
            </Button>
          </span>
        ),
      },

    ];

    const studentNode = studentList ? studentList.map(item => {
        if (item.staffId && item.staffName) {
          return <Option key={item.staffId}>{item.staffName}</Option>
        }
      }
    ) : '';

    return (
      <div className={styles.box}>
        <Form layout="inline">
          <Form.Item label="学生名字:">
            {getFieldDecorator('staffId', {
            })(
              <AutoComplete
                filterOption={(inputValue, option) =>
                  option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
              >
                {studentNode}
              </AutoComplete>,
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
            <Button
              type="default"
              htmlType="submit"
              onClick={this.handleExportAll}
              style={{marginLeft:'15px' }}
            >
              导出全部
            </Button>
          </Form.Item>
        </Form>
        <Spin spinning={loading}>
          <Table
            rowKey={record => `${record.paperId}-${record.planDetailId}`}
            columns={columns}
            dataSource={achieveList}
            pagination={{
              total,
              pageSize,
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

const StudentAchievListForm = Form.create({ name: 'studentAchievListForm' })(
  StudentAchieveList,
);

export default connect(state => ({
  ...state.studentAchieveList,
  loading: state.loading.models.studentAchieveList,
}))(StudentAchievListForm);
