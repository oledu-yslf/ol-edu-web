import React from 'react';
import { connect } from 'dva';

import { Form, TreeSelect, Upload, Input, Button, Icon, message } from 'antd';
const { TextArea } = Input;
const { TreeNode } = TreeSelect;

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

class PlusCourse extends React.Component {
  state = {
    // treeData: [],
  };

  renderTreeNodes = data => {
    if(data){
      return data.map(item => {
        if (item.courseCategoryVOList) {
          return (
            <TreeNode
              value={item.categoryId}
              title={item.categoryName}
              key={`${item.categoryName}-${item.categoryId}-${item.floor}`}
              c={item}
            >
              {this.renderTreeNodes(item.courseCategoryVOList)}
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

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, courseId } = this.props;
    const roleInfo = JSON.parse(localStorage.getItem('roleInfo'));
    const createStaffId = roleInfo.staffId;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (!courseId) {
          const { courseName, categoryId, introduce } = values;
          const courseLogoUrl = values.file_ID[0].uid;
          dispatch({
            type: 'courseEdit/courseSave',
            payload: {
              courseName,
              categoryId,
              introduce,
              courseLogoUrl,
              state: 1,
              isFree: 1,
              isPutaway: 0,
              totalChapter: 0,
              totalPeriod: 0,
              teacherStaffId:createStaffId,
              createStaffId,

            },
          });
        }else{
          const { courseName, categoryId, introduce } = values;
          const courseLogoUrl = values.file_ID[0].uid;
          dispatch({
            type: 'courseEdit/courseUpdate',
            payload: {
              courseId,
              courseName,
              categoryId,
              introduce,
              courseLogoUrl,
              teacherStaffId: createStaffId,
              modifyStaffId:createStaffId

            },
          });
        }
      }
    });
  };
  treeChange = value => {
    this.setState({ categoryId: value });
  };
  normFile = e => {
    const { dispatch } = this.props;
    if (Array.isArray(e)) {
      return e;
    }
    const fileList = e && e.fileList;
    if(e.file.status==='done'){
      fileList[0].uid =fileList[0].response.data.fileId;
    }
    dispatch({
      type: 'courseEdit/save',
      payload: {
        file_ID: fileList,
      },
    });
    return fileList;
  };

  componentWillReceiveProps(nextprops) {
    this.setState({
      treeData: nextprops.treeData,
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { file_ID, categoryId, courseName, introduce, treeData } = this.props;

    return (
      <Form
        onSubmit={this.handleSubmit}
        wrapperCol={{ span: 12 }}
        labelCol={{ span: 3 }}
        layout={'vertical'}
      >
        <Form.Item label="课程分类">
          {getFieldDecorator('categoryId', {
            initialValue: categoryId,
            rules: [{ required: true, message: '请选择课程分类!' }],
          })(
            <TreeSelect
              showSearch
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择课程分类!"
              allowClear
              onChange={this.treeChange}
            >
              {this.renderTreeNodes(treeData)}
            </TreeSelect>,
          )}
        </Form.Item>
        <Form.Item label="课程名称">
          {getFieldDecorator('courseName', {
            initialValue: courseName,
            rules: [{ required: true, message: '请输入课程名称!' }],
          })(<Input placeholder="请输入课程名称!" />)}
        </Form.Item>
        <Form.Item label="课程logo">
          {getFieldDecorator('file_ID', {
            initialValue: file_ID,
            valuePropName: 'fileList',
            getValueFromEvent: this.normFile,
            rules: [{ required: true, message: '请上传课程logo!' }],
          })(
            <Upload
              action="../api/zuul/fileserver/upLoad"
              beforeUpload={beforeUpload}
              data={{
                fileType: 'other',
                createStaffId: '0001',
              }}
              showUploadList={{
                showDownloadIcon: false,
              }}
            >
              {file_ID.length >= 1 ? null : (
                <Button>
                  <Icon type="upload" /> Upload
                </Button>
              )}
            </Upload>,
          )}
        </Form.Item>
        <Form.Item label="课程简介">
          {getFieldDecorator('introduce', {
            initialValue: introduce,
            rules: [{ required: true, message: '请输入课程简介!' }],
          })(<TextArea rows={4} />)}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            下一步
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default connect(state => ({
  ...state.courseEdit,
  loading: state.loading.models.courseEdit,
}))(
  Form.create({
    name: 'plus-course-form',
  })(PlusCourse),
);
