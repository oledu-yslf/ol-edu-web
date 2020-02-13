import React from 'react';
import G2 from '@antv/g2';

class BarChart extends React.Component {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.state={
      data:[],
      x:'',
      y:'',
      aliasx:null,
      aliasy:null,
      height:300,
      tickInterval:null
    }
  }

  componentDidMount() {
    // G2 初始化图形代码
    this.chart = new G2.Chart({
      // this.containerRef.current 即为引用
      container: this.containerRef.current,
      //width: 450,
      forceFit:true,    //宽度，自适应
      height: this.props.height,
      //padding: [ 20, 20, 95, 80 ] // 上，右，下，左
    });

    this.refreshChart();
  }

  //首先，我们现在的逻辑只接收初始化时获取的 data 画图，如果 data 更新图表并不会更新。因而，我们需要监听组件更新事件，更新时重新画图。
  //考虑另外一点，如果当前的 data 没有变化我们图表当然不需要重新绘制。因而，添加一个检查只有 data 更新时才重绘：
  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.refreshChart();
    }
  }


  refreshChart = () => {
    // 接收 data 属性作为数据源
    const {x,y,data} = this.props;
    this.chart.source(data);
    // 此处为硬编码，配置源自 G2 官方示例： https://github.com/antvis/g2
    // 实际开发中需要封装，推荐直接使用 BizCharts。
    //this.chart.interval().position([this.props.x,this.props.y]).color(this.props.x);   //使用内置 颜色
    // 指定度量(或称 列定义）
    if (this.props.aliasx){
      this.chart.scale(x,{alias: this.props.aliasx});
    }

    if (this.props.aliasy){
      this.chart.scale(y,{alias: this.props.aliasy,tickInterval:this.props.tickInterval});
    }

    this.chart.axis(x, {
      title: {
        textStyle: {
          fontSize: 12, // 文本大小
          textAlign: 'center', // 文本对齐方式
          fill: '#999', // 文本颜色
          // ...
        }
      }
    });

    this.chart.axis(y, {
      title: {
        textStyle: {
          fontSize: 12, // 文本大小
          textAlign: 'center', // 文本对齐方式
          fill: '#999', // 文本颜色
          // ...
        }
      }
    });

    this.chart.interval().position([x,y]).color('#C0C0C0');   //使用内置 颜色



    this.chart.render();
  };

  render() {
    return (
      <div ref={this.containerRef} />
    );
  }
}

export default BarChart;
