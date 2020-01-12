import React from 'react';
import { Descriptions, Button, Icon, Radio } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import { cloneDeep } from 'lodash';
const typesort = [1, 2, 3, 5, 4];
class StartHomeWork extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isStart: false,
      typeIndex: 1,
      index: 0,
      count: undefined,
      mapPaperExamSummary: {},
      paperPlanDetailVO: {},
      sort: 1,
      result: '',
    };
  }
  startWork = (filed, state) => {
    this.setState({
      [filed]: state,
    });
  };

  onResultChange = e => {
    const { cloneDeep } = this.state;

    this.setState({
      result: e.target.value,
    });
  };

  prev = e =>{

  }

  next= e =>{

  }

  commit= e=>{

    e.preventDefault();
    const {dispatch,examList} = this.props;
    const {index,result} = this.state;
    dispatch({
      type:'startHomeWork/commit',
      payload:{
        paperExamId:examList[index].paperExamId,
        examId:examList[index].examId,
        result
      }
    })

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.paperDetail !== this.props.paperDetail) {
      
    }
  }
  render() {
    const { paperDetail ,examList} = this.props;
    const {
      isStart,
      index,
      result,
    } = this.state;
    let { paperName, totalScore ,mapPaperExamSummary,paperPlanDetailVO} = paperDetail;
    let exam = [];
    for (let i in mapPaperExamSummary) {
      exam[i] = mapPaperExamSummary[i].paperExamVOList;
    }

    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    paperPlanDetailVO = paperPlanDetailVO || {};
    return (
      <div className={styles.box}>
        {isStart && (
          <div>
            <div className="clearfix">
              <div className="pullleft" style={{ fontSize: '24px', lineHeight: '80px' }}>
                <span>{paperName}</span>
              </div>

              <div
                className="pullright"
                style={{ fontSize: '16px', lineHeight: '80px', margin: '0 30px' }}
              >
                时长:{paperPlanDetailVO.duration}分钟
              </div>
            </div>
            <div className="clearfix">
              <div className="pullleft" style={{ marginRight: '20px' }}>
                {index+1}. [
                {examList[index].examType === 1
                  ? '单选题'
                  : examList[index].examType === 2
                  ? '多选题'
                  : examList[index].examType === 3
                  ? '判断题'
                  : examList[index].examType === 5
                  ? '填空题'
                  : '问答题'}
                ]
              </div>
              <div
                className="pullleft"
                dangerouslySetInnerHTML={{
                  __html: examList[index].examName,
                }}
              />
            </div>
            <Radio.Group onChange={this.onResultChange} value={result}>
              {examList[index].paperExamAttrVOS &&
                examList[index].paperExamAttrVOS.map(v => (
                  <Radio value={v.sort} style={radioStyle} key={v.examAttrId}>
                    {v.sort}.
                    <div
                      style={{ display: 'inline-block' }}
                      dangerouslySetInnerHTML={{ __html: `${v.attrName}` }}
                    />
                  </Radio>
                ))}
            </Radio.Group>
            <div style={{ margin: '20px' }}>
              <Button style={{ marginLeft: 8 }} onClick={this.prev}>
                上一题
              </Button>
              <Button type="primary" onClick={this.next}>
                下一题
              </Button>
              <Button type="primary" onClick={this.commit}>
                提交
              </Button>
            </div>
          </div>
        )}
        {!isStart && (
          <div>
            <Descriptions
              title={
                <div className="clearfix">
                  <div className="pullleft" style={{ fontSize: '24px', lineHeight: '80px' }}>
                    <span>{paperName}</span>
                  </div>

                  <div
                    className="pullright"
                    style={{ fontSize: '16px', lineHeight: '80px', margin: '0 30px' }}
                  >
                    时长:{paperPlanDetailVO.duration}分钟
                  </div>
                </div>
              }
              bordered
              style={{ marginTop: '20px' }}
              column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
            >
              <Descriptions.Item label="满分">{totalScore}</Descriptions.Item>
              <Descriptions.Item label="单选题">
                {(exam[1] && exam[1].length) || 0}题
              </Descriptions.Item>
              <Descriptions.Item label="多选题">
                {(exam[2] && exam[2].length) || 0}题
              </Descriptions.Item>
              <Descriptions.Item label="判断题">
                {(exam[3] && exam[3].length) || 0}题
              </Descriptions.Item>
              <Descriptions.Item label="填空题">
                {(exam[5] && exam[5].length) || 0}题
              </Descriptions.Item>
              <Descriptions.Item label="问答题">
                {(exam[4] && exam[4].length) || 0}题
              </Descriptions.Item>
            </Descriptions>
            <div className="pullright" style={{ fontSize: '24px', lineHeight: '80px' }}>
              <Button type="primary" size="large" onClick={e => this.startWork('isStart', true)}>
                开始 <Icon type="right" />
              </Button>
            </div>
          </div>
        )}

        {/* {exam[1] && exam[1].length > 0 ? (
          <List
            header={<div>选择题</div>}
            bordered
            dataSource={exam[1]}
            itemLayout="vertical"
            renderItem={(item, index) => (
              <List.Item key={item.examId}>
                <List.Item.Meta
                  title={
                    <div className="clearfix">
                      <div className="pullleft">{index + 1}.</div>
                      <div
                        className="pullleft"
                        dangerouslySetInnerHTML={{ __html: item.examName }}
                      />
                    </div>
                  }
                />
                {item.paperExamAttrVOS.map(v => {
                  return (
                    <div className="clearfix" key={v.examAttrId}>
                      <div className="pullleft">{v.sort}.</div>
                      <div className="pullleft" dangerouslySetInnerHTML={{ __html: v.attrName }} />
                    </div>
                  );
                })}
                <Divider />
                <div className="clearfix">
                  <div className="pullleft">答案：</div>
                  <div className="pullleft" dangerouslySetInnerHTML={{ __html: item.result }} />
                </div>
                <div className="clearfix">
                  <div className="pullleft">分数：{item.mark}</div>
                </div>
              </List.Item>
            )}
          />
        ) : (
          ''
        )}
        {exam[2] && exam[2].length > 0 ? (
          <List
            style={{ marginTop: '20px' }}
            header={<div>多选题</div>}
            bordered
            dataSource={exam[2]}
            itemLayout="vertical"
            renderItem={(item, index) => (
              <List.Item key={item.examId}>
                <List.Item.Meta
                  title={
                    <div className="clearfix">
                      <div className="pullleft">{index + 1}.</div>
                      <div
                        className="pullleft"
                        dangerouslySetInnerHTML={{ __html: item.examName }}
                      />
                    </div>
                  }
                />
                {item.paperExamAttrVOS.map(v => {
                  return (
                    <div className="clearfix" key={v.examAttrId}>
                      <div className="pullleft">{v.sort}.</div>
                      <div className="pullleft" dangerouslySetInnerHTML={{ __html: v.attrName }} />
                    </div>
                  );
                })}
                <Divider />
                <div className="clearfix">
                  <div className="pullleft">答案：</div>
                  <div className="pullleft" dangerouslySetInnerHTML={{ __html: item.result }} />
                </div>
                <div className="clearfix">
                  <div className="pullleft">分数：{item.mark}</div>
                </div>
              </List.Item>
            )}
          />
        ) : (
          ''
        )}
        {exam[3] && exam[3].length > 0 ? (
          <List
            style={{ marginTop: '20px' }}
            header={<div>判断题</div>}
            bordered
            dataSource={exam[3]}
            itemLayout="vertical"
            renderItem={(item, index) => (
              <List.Item key={item.examId}>
                <List.Item.Meta
                  title={
                    <div className="clearfix">
                      <div className="pullleft">{index + 1}.</div>
                      <div
                        className="pullleft"
                        dangerouslySetInnerHTML={{ __html: item.examName }}
                      />
                    </div>
                  }
                />
                {item.paperExamAttrVOS.map(v => {
                  return (
                    <div className="clearfix" key={v.examAttrId}>
                      <div className="pullleft">{v.sort}.</div>
                      <div className="pullleft" dangerouslySetInnerHTML={{ __html: v.attrName }} />
                    </div>
                  );
                })}
                <Divider />
                <div className="clearfix">
                  <div className="pullleft">答案：</div>
                  <div className="pullleft" dangerouslySetInnerHTML={{ __html: item.result }} />
                </div>
                <div className="clearfix">
                  <div className="pullleft">分数：{item.mark}</div>
                </div>
              </List.Item>
            )}
          />
        ) : (
          ''
        )}

        {exam[5] && exam[5].length > 0 ? (
          <List
            style={{ marginTop: '20px' }}
            header={<div>填空题</div>}
            bordered
            dataSource={exam[5]}
            itemLayout="vertical"
            renderItem={(item, index) => (
              <List.Item key={item.examId}>
                <List.Item.Meta
                  style={{ marginBottom: 0 }}
                  title={
                    <div className="clearfix">
                      <div className="pullleft">{index + 1}.</div>
                      <div
                        className="pullleft"
                        dangerouslySetInnerHTML={{ __html: item.examName }}
                      />
                    </div>
                  }
                />

                <Divider />
                <div className="clearfix">
                  <div className="pullleft">答案：</div>
                  <div className="pullleft" dangerouslySetInnerHTML={{ __html: item.result }} />
                </div>
                <div className="clearfix">
                  <div className="pullleft">分数：{item.mark}</div>
                </div>
              </List.Item>
            )}
          />
        ) : (
          ''
        )}
        {exam[4] && exam[4].length > 0 ? (
          <List
            style={{ marginBottom: '20px', marginTop: '20px' }}
            header={<div>问答题</div>}
            bordered
            dataSource={exam[4]}
            itemLayout="vertical"
            renderItem={(item, index) => (
              <List.Item key={item.examId}>
                <List.Item.Meta
                  title={
                    <div className="clearfix">
                      <div className="pullleft">{index + 1}.</div>
                      <div
                        className="pullleft"
                        dangerouslySetInnerHTML={{ __html: item.examName }}
                      />
                    </div>
                  }
                />
                <Divider />
                <div className="clearfix">
                  <div className="pullleft">答案：</div>
                  <div className="pullleft" dangerouslySetInnerHTML={{ __html: item.result }} />
                </div>
                <div className="clearfix">
                  <div className="pullleft">分数：{item.mark}</div>
                </div>
              </List.Item>
            )}
          />
        ) : (
          ''
        )} */}
      </div>
    );
  }
}
export default connect(state => ({
  ...state.startHomeWork,
  loading: state.loading.models.startHomeWork,
}))(StartHomeWork);
