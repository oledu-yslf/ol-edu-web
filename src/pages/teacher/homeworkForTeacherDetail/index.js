import { connect } from 'dva';
import styles from './index.less';
function App({homeworkForTeacherDetail,dispatch}) {
    const { text,list } = homeworkForTeacherDetail;
    return (
        <div className={styles.normal}>
            <h2>
                {text}
            </h2>
        </div>
    );
}
export default connect(({homeworkForTeacherDetail})=>({homeworkForTeacherDetail}))(App);
