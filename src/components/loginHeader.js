// import { Button } from 'antd';
// import styles from './loginHeader.css';
// import Link  from 'umi/link';
// function OLoginHeader() {
//   return (
//     <div className={styles.box}>
//       <div className={styles.logo}>
//         {/*<img src={imageUrl} alt="avatar" style={{width: '96px', height: '48px'}}/>*/}
//       </div>      <Button type="link" className={styles.right}>
//         <Link to="/">返回首页</Link>
//       </Button>
//     </div>
//   );
// }

import React from 'react';
import { Menu, Button, Avatar } from 'antd';
import styles from './loginHeader.css';
import router from 'umi/router';
import { connect } from 'dva';
import Link  from 'umi/link';

class OLoginHeader  extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      roleInfo: '',
    };
  }
  componentWillMount() {
    let roleInfo = '';
    if (sessionStorage.getItem('roleInfo')) {
      roleInfo = JSON.parse(sessionStorage.getItem('roleInfo'));
    } else {
      roleInfo = '';
    }
    this.setState({
      roleInfo,
    });

    //获取logo信息
    const {dispatch} = this.props;

    dispatch({
      type: 'global/queryLogo',
    });

  }

  render(){
    const { roleInfo } = this.state;
    const {selectedMenu,logoFileInfo} = this.props;

    let imageUrl = '';
    if (logoFileInfo) {
      imageUrl = `/api${logoFileInfo.url}\/${logoFileInfo.fileName}`;
    }

    return (
      <div className={[styles.box, 'clearfix'].join(' ')} style={{width: '1200px', margin: '0 auto',marginTop:'20px'}}>
        <div className={styles.logo}>
          <img src={imageUrl} alt="avatar" className={styles.image}/>
        </div>
          <div className={styles.pullright}>
            <span style={{ marginRight: '5px' }}></span>
            <a href="/" >返回首页</a>
          </div>
      </div>
  );

  }
}
export default connect(state => ({ ...state.global }))(OLoginHeader);

