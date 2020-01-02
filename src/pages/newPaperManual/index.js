import { connect } from 'dva';
import styles from './index.less';
function App({newPaperManual,dispatch}) {
    const { text,list } = newPaperManual;
    return (
        <div className={styles.normal}>
            <h2>
                {text}
            </h2>
        </div>
    );
}
export default connect(({newPaperManual})=>({newPaperManual}))(App);
