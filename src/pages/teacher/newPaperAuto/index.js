import { connect } from 'dva';
import styles from './index.less';
function App({newPaperAuto,dispatch}) {
    const { text,list } = newPaperAuto;
    return (
        <div className={styles.normal}>
            <h2>
                {text}
            </h2>
        </div>
    );
}
export default connect(({newPaperAuto})=>({newPaperAuto}))(App);
