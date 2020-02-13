import React from 'react';
import {Descriptions, Badge } from 'antd';
import {connect} from 'dva';
import styles from '@/style/common.less';
import BarChart from '@/components/chart/barchart'


class PaperZone extends React.Component {
  componentWillMount() {
    const {dispatch} = this.props;
    const {query} = this.props.location;

    //页面参数为
    /*{
     "planId":"7fb2b156336f4abdb5fe9c8cd93f9dda",
     "paperId":"0e10a9d4d4e5477eafcc0a868cd332c5",
     "departId":"f6132912b5544f479519e147415f5805",
     "staffId":"9d3934efb67d4e2b9f4ab85b6b9a99ab"
     }*/
    dispatch({
      type: 'paperZone/getZone',
      payload: {
        ...query
      }
    });
  }

  render() {
    const {paperPlanZoneVOList,result} = this.props;
    let data = [];
    for (let i in paperPlanZoneVOList) {
      let obj = {
        name: `${paperPlanZoneVOList[i].floor}-${paperPlanZoneVOList[i].top}`,
        value: paperPlanZoneVOList[i].zoneNum
      }
      data[i] = obj;
    }
    return (
      <div className={styles.box}>
        <div >
          <div >
            <BarChart data={data} x='name' y='value' aliasx="成绩区间" aliasy="人数" height={300} tickInterval={5}/>
          </div>

          <Descriptions title="概况" column={3} bordered>
            <Descriptions.Item label="试卷名称" span={2}>{result.paperName}</Descriptions.Item>
            <Descriptions.Item label="班级" span={1}>{result.departName}</Descriptions.Item>


            <Descriptions.Item label="总分">{result.totalScore}</Descriptions.Item>
            <Descriptions.Item label="及格分">{result.passScore}</Descriptions.Item>
            <Descriptions.Item label="我的分数">{result.score}</Descriptions.Item>

            <Descriptions.Item label="平均分">{result.averageScore}</Descriptions.Item>
            <Descriptions.Item label="最高分">{result.highestScore}</Descriptions.Item>
            <Descriptions.Item label="最低分">{result.minimumScore}</Descriptions.Item>
          </Descriptions>,
        </div>
      </div>
    );
  }

}

export default connect(state => (
  {
    ...state.paperZone,
    loading: state.loading.models.paperZone,
  }))(PaperZone);

