import React from 'react';
import { Divider, List } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
class HomeworkForTeacherDetail extends React.Component {
  render() {
    const { paperDetail } = this.props;
    const { paperName, totalScore, mapPaperExamSummary } = paperDetail;
    let exam = [];
    for (let i in mapPaperExamSummary) {
      exam[i] = mapPaperExamSummary[i].paperExamVOList;
    }
    return (
      <div className={styles.box}>
        <div className="clearfix">
          <div className="pullleft" style={{ fontSize: '24px', lineHeight: '80px' }}>
            <span>{paperName}</span>
          </div>
          <div className="pullright" style={{ fontSize: '24px', lineHeight: '80px' }}>
            <span>总分：{totalScore}</span>
          </div>
        </div>
        <Divider />
        {exam[1] && exam[1].length > 0 ? (
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
                <div className="clearfix">
                  <div className="pullleft">讲解：</div>
                  <div className="pullleft" dangerouslySetInnerHTML={{ __html: item.examSolution }} />

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
                <div className="clearfix">
                  <div className="pullleft">讲解：</div>
                  <div className="pullleft" dangerouslySetInnerHTML={{ __html: item.examSolution }} />

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
                <div className="clearfix">
                  <div className="pullleft">讲解：</div>
                  <div className="pullleft" dangerouslySetInnerHTML={{ __html: item.examSolution }} />

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
                  style={{marginBottom:0}}
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
                <div className="clearfix">
                  <div className="pullleft">讲解：</div>
                  <div className="pullleft" dangerouslySetInnerHTML={{ __html: item.examSolution }} />

                </div>
              </List.Item>
            )}
          />
        ) : (
          ''
        )}
        {exam[4] && exam[4].length > 0 ? (
          <List
            style={{marginBottom:'20px',marginTop:'20px'}}
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
                <div className="clearfix">
                  <div className="pullleft">讲解：</div>
                  <div className="pullleft" dangerouslySetInnerHTML={{ __html: item.examSolution }} />

                </div>
              </List.Item>
            )}
          />
        ) : (
          ''
        )}
      </div>
    );
  }
}
export default connect(state => ({
  ...state.homeworkForTeacherDetail,
  loading: state.loading.models.homeworkForTeacherDetail,
}))(HomeworkForTeacherDetail);
