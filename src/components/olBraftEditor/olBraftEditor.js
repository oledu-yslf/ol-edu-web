/**
 * Created by linzhang on 2020/2/6.
 */
import React from 'react';
import {message} from 'antd';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import MaxLength from 'braft-extensions/dist/max-length'
import * as service from '@/services/index';
import * as Util from '@/utils/util';

const options = {
  defaultValue: 16777215, // 指定默认限制数，如不指定则为Infinity(无限),16M
  //defaultValue: 10,
};
BraftEditor.use(MaxLength(options));

class OlBraftEditor extends React.Component {
  constructor(props) {
    super(props);

    const value = props.value || {};
    // this.state = {
    //   value
    // }
  }


  handleMaxLength = () => {
    message.info('最多只能输入' + 16777215 + '个字符');
  };

  handleChange = editorState => {

    const {onChange} = this.props;
    //this.setState({ value });

    if (onChange) {
      onChange(
        editorState   //设置value为editorState
      );
    }
  };

  uploadFile = (param) => {
    const fd = new FormData();
    fd.append('file', param.file);
    fd.append('fileType', 'other');
    fd.append('createStaffId', Util.getStaffId());

    service.upLoadFile(fd,progressFn).then(res => {
      if(res.code == 200){
        let data = res.data;
        param.success({
          url: `/api${data.url}/${data.fileName}`,
          meta: {
            id: data.fileId,
            title: data.fileName,
            //alt: 'xxx',
            //loop: false, // 指定音视频是否循环播放
            //autoPlay: false, // 指定音视频是否自动播放
            //controls: false, // 指定音视频是否显示控制栏
            //poster: 'http://xxx/xx.png', // 指定视频播放器的封面
          }
        })
      }else {
        param.error({
          msg: res.msg
        })
      }
    });

    const progressFn = (event) => {
      // 上传进度发生变化时调用param.progress
      param.progress(event.loaded / event.total * 100)
    }


  }

  render() {

    const excludeControls = [
      'emoji', 'link'
    ]

    const {maxLength, contentStyle} = this.props;

    return (<BraftEditor
      onChange={this.handleChange}
      value={this.props.value}

      contentStyle={contentStyle}
      placeholder="请输入"
      onReachMaxLength={this.handleMaxLength}
      excludeControls={excludeControls}
      media={
        {
          accepts: {
            image: true,
            video: false,
            audio: false,
          },
          externals: {
            image: false,
            video: false,
            audio: false,
            embed: false,
          },
          //uploadFn: this.uploadFile,
        }
      }
    />)
  }

}

export default OlBraftEditor;
