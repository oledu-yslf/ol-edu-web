// import { connect } from 'dva';
import React from 'react';
import { Card, Button, Switch } from 'antd';
import moment from 'moment';
import styles from './index.css';

const { Meta } = Card;
class OCell extends React.Component {
  handleClick = (courseId)=>{
    window.open(`/course/coursePlay?courseId=${courseId}`);
  }
  handleEditClick = () => {
    const {handleEdit,courseId} = this.props;
    handleEdit(courseId);
  };
  handleDeleteClick = () => {
    const {handleDelete,courseName, courseId} = this.props;
    handleDelete(courseName, courseId);
  };
  handleSwitch = () => {
    const {handleSwitchClick,courseName,courseId,isPutaway} = this.props;

    handleSwitchClick(courseName,courseId,isPutaway?0:1)
  };
  render(){
    const {
      totalChapter,
      totalPeriod,
      isPutaway,
      translateTeacherStaffId,
      modifyDate,
      createDate,
      logoFile,
      courseName,courseId
    } = this.props;
    let date = modifyDate ? new Date(modifyDate) : new Date(createDate);
    let putaway = Boolean(isPutaway);
    return (
      <div className='clearfix' style={{width:'100%'}}>
        <Card
          className={styles.pullleft}
          hoverable
          onClick={e=>this.handleClick(courseId,e)}
          cover={
            logoFile ? (
              <img
                alt=""
                src={`/api${logoFile.url}/${logoFile.fileName}`}
                style={{ width: '280px', height: '160px' }}
              />
            ) : (
              <img
                alt=""
                src="//img1.mukewang.com/szimg/5da13cab09466e9105400306-360-202.png"
                style={{ width: '280px', height: '160px' }}
              />
            )
          }
        >
          <Meta title={courseName} />
        </Card>
        <div className={[styles['cell-center'],styles.pullleft].join(' ')}>
          <p>章节数量:{totalChapter}</p>
          <p>课时数量:{totalPeriod}</p>
          <p>讲师:{translateTeacherStaffId}</p>
          <p>修改时间:{moment(date).format('YYYY-MM-DD') || '-'}</p>
        </div>
        <div className={styles.pullright}>
          <Button type="primary" onClick={this.handleEditClick}>
            编辑
          </Button>
          <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <Button type="danger" onClick={this.handleDeleteClick}>
              删除
            </Button>
          </div>
          <div>
            <Switch checkedChildren="上架" unCheckedChildren="下架" checked={putaway} onClick={this.handleSwitch}/>
          </div>
        </div>
      </div>
    );
  }
  
}

export default OCell;
