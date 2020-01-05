import React from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Form, Input, Icon, Select ,Button} from 'antd';
const { Option } = Select;

let id = 0;

class NewPaperManual extends React.Component {
  remove = k => {
    const { form } = this.props;
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

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };
  render() {
    const { form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;

    getFieldDecorator('keys', { initialValue: [0] });
    const keys = getFieldValue('keys');
    // console.log(keys1);
    const formItem = keys.map((k, index) => (
      <div>
        <Form.Item label="试题类型" wrapperCol={{ span: 4 }}>
          {getFieldDecorator(`names[${k}].examType`, {
            rules: [{ required: true, message: '请选择试题类型！' }],
          })(
            <Select placeholder="请选择试题类型！">
              <Option value={1}>单选题</Option>
              <Option value={2}>多选题</Option>
              <Option value={3}>判断题</Option>
              <Option value={4}>问答题</Option>
              <Option value={5}>填空题</Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="试题难度" wrapperCol={{ span: 4 }}>
          {getFieldDecorator(`names[${k}].difficultyLevel`, {
            rules: [{ required: true, message: '请选择试题难度！' }],
          })(
            <Select placeholder="请选择试题难度！">
              <Option value={0}>易</Option>
              <Option value={1}>较易</Option>
              <Option value={2}>中等</Option>
              <Option value={3}>偏难</Option>
              <Option value={4}>难</Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item label={'题数'} required={false} key={k}>
          {getFieldDecorator(`names[${k}].randNum`)(
            <Input style={{ width: '60%', marginRight: 8 }} />,
          )}
          {/* {keys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.removeInput(k)}
          />
        ) : null} */}
        </Form.Item>
      </div>
    ));
    return (
      <div className={styles.normal}>
        <Form>
          {formItem}
          <Form.Item label="增加答案">
            <Button type="dashed" onClick={this.addInput} style={{ width: '60%' }}>
              <Icon type="plus" /> 点击增加
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
const NewPaperManualForm = Form.create({ name: 'newPaperManualForm' })(NewPaperManual);

export default connect(state => ({
  ...state.newPaperManual,
  loading: state.loading.models.newPaperManual,
}))(NewPaperManualForm);
