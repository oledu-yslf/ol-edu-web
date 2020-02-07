/**
 * Created by linzhang on 2020/2/6.
 */
import React from 'react';
import {message} from 'antd';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import MaxLength from 'braft-extensions/dist/max-length'


const options = {
  defaultValue: 16777215, // 指定默认限制数，如不指定则为Infinity(无限),16M
  //defaultValue: 10,
};
BraftEditor.use(MaxLength(options));

class OlBraftEditor extends React.Component{
  constructor(props) {
    super(props);

    const value = props.value || {};
    console.log(value.toHTML())
    // this.state = {
    //   value
    // }
  }



  handleMaxLength = () => {
    message.info('最多只能输入' + 16777215 + '个字符');
  };

  handleChange = editorState => {

    const { onChange } = this.props;
    //this.setState({ value });

    if (onChange) {
      onChange(
        editorState   //设置value为editorState
      );
    }
  };

  render () {

    const excludeControls = [
      'emoji','link'
    ]

    const {maxLength,contentStyle} = this.props;

    console.log(this.props.value.toHTML())

    return  (<BraftEditor
      onChange={this.handleChange}
      value={this.props.value}

      contentStyle={contentStyle}
      placeholder="请输入"
      onReachMaxLength={this.handleMaxLength}
      excludeControls = {excludeControls}
    />)
  }

}

export default OlBraftEditor;
