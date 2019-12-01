import { connect } from 'dva';
import styles from './index.less';
function App({student,dispatch}) {
    const { text,list } = student;
    return (
        <div className={styles.normal}>
            <h2>
                {text}
            </h2>
        </div>
    );
}
export default connect(({student})=>({student}))(App);
