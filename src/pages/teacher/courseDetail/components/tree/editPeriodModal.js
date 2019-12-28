import React from 'react';
import { Modal, Form, Input, Upload, Button, Icon } from 'antd';
const { TextArea } = Input;

const EditPeriodModal = Form.create({
  name: 'EditPeriod',
})(
  // eslint-disable-next-line
  class EditPeriod extends React.Component {
    constructor(props) {
      super(props);
      this.state = { attachFileId: [], videoFileId: [], periodName: '', periodDesc: '', sort: '' };
    }
    onOk = () => {
      const { onCreate, onEdit, form } = this.props;
      const { resetFields } = form;

      this.props.form.validateFields((err, value) => {
        if (!err) {
          if (this.props.title === '编辑课时') {
            resetFields();
            onEdit(value);
          } else {
            resetFields();
            debugger;
            onCreate(value);
          }
        }
      });
    };
    onClose = () => {
      const { onCancel, form } = this.props;
      const { resetFields } = form;

      this.setState({
        attachFileId: [],
        videoFileId: [],
      });
      resetFields();

      onCancel();
    };

    normFileVideo = e => {
      if (Array.isArray(e)) {
        return e;
      }
      const fileList = e && e.fileList;
      if (e.file.status === 'done') {
        fileList[0].uid = fileList[0].response.data.fileId;
        this.setState({ videoFileId: fileList, videouploading: false });


      }
      return fileList;
    };
    normFileAttach = e => {
      if (Array.isArray(e)) {
        return e;
      }
      const fileList = e && e.fileList;
      if (e.file.status === 'done') {
        fileList[0].uid = fileList[0].response.data.fileId;
        this.setState({ attachFileId: fileList,fileuploading: false });

      }

      return fileList;
    };
    beforeFileUpload = () => {
      console.log('a');
      this.setState({
        fileuploading: true,
      });
    };
    beforeVideoUpload = () => {
      console.log('a');
      this.setState({
        videouploading: true,
      });
    };
    attachFileRemove = () => {
      this.setState({ attachFileId: [] });
    };
    videoFileRemove = () => {
      this.setState({ videoFileId: [] });
    };
    componentWillReceiveProps(nextprops) {
      if (nextprops.periodDetail !== this.props.periodDetail) {
        const {
          attachFileInfo,
          videoFileInfo,
          periodName,
          periodDesc,
          sort,
        } = nextprops.periodDetail;
        if (attachFileInfo) {
          this.setState({
            attachFileId: [attachFileInfo],
            periodName,
            periodDesc,
            sort,
          });
        } else {
          this.setState({
            attachFileId: [],
            periodName,
            periodDesc,
            sort,
          });
        }
        if (videoFileInfo) {
          this.setState({
            videoFileId: [videoFileInfo],
          });
        } else {
          this.setState({
            videoFileId: [],
          });
        }
      }
    }
    render() {
      const { confirmLoading, visible, form, title } = this.props;
      const { getFieldDecorator } = form;
      const { attachFileId, videoFileId, periodName, periodDesc, sort, fileuploading,videouploading } = this.state;
      return (
        <Modal
          visible={visible}
          title={title}
          okText="保存"
          cancelText="取消"
          onCancel={this.onClose}
          onOk={this.onOk}
          confirmLoading={confirmLoading}
          okButtonProps={{
            disabled:fileuploading || videouploading,
          }}
        >
          <Form layout="vertical">
            <Form.Item label="课时名称">
              {getFieldDecorator('periodName', {
                initialValue: periodName,
                rules: [{ required: true, message: '请输入课时名称！' }],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="课时排序">
              {getFieldDecorator('sort', {
                initialValue: sort,
                rules: [{ required: true, message: '请输入课时排序！' }],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="课时视频">
              {getFieldDecorator('videoFileId', {
                initialValue: this.state.videoFileId,
                valuePropName: 'fileList',
                getValueFromEvent: this.normFileVideo,
                rules: [],
              })(
                <Upload
                  action="../api/zuul/fileserver/upLoad"
                  data={{
                    fileType: 'video',
                    createStaffId: '0001',
                  }}
                  showUploadList={{
                    showDownloadIcon: false,
                  }}
                  onRemove={this.videoFileRemove}
                  beforeUpload={this.beforeVideoUpload}

                >
                  {videoFileId.length >= 1 ? null : (
                    <Button>
                      <Icon type="upload" /> Upload
                    </Button>
                  )}
                </Upload>,
              )}
            </Form.Item>
            <Form.Item label="课时附件">
              {getFieldDecorator('attachFileId', {
                initialValue: attachFileId,
                valuePropName: 'fileList',
                getValueFromEvent: this.normFileAttach,
                rules: [],
              })(
                <Upload
                  action="../api/zuul/fileserver/upLoad"
                  data={{
                    fileType: 'attach',
                    createStaffId: '0001',
                  }}
                  showUploadList={{
                    showDownloadIcon: false,
                  }}
                  onRemove={this.attachFileRemove}
                  beforeUpload={this.beforeFileUpload}
                >
                  {attachFileId.length >= 1 ? null : (
                    <Button>
                      <Icon type="upload" /> Upload
                    </Button>
                  )}
                </Upload>,
              )}
            </Form.Item>
            <Form.Item label="课时描述">
              {getFieldDecorator('periodDesc', {
                initialValue: periodDesc,
                rules: [{ required: true, message: '请输入课时描述！' }],
              })(<TextArea rows={4} />)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  },
);

export default EditPeriodModal;
