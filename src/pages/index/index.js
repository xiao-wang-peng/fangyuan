import React, { Component } from "react";
import { Carousel, Flex, Grid,WingBlank ,SearchBar} from "antd-mobile";
import { BASE_URL } from "../../utils/axios";
import { getSwiper, getGroup, getNews } from "../../utils/api/Home";
import "./index.scss";
import navs from "../../utils/navConfig";

class Index extends Component {
  state = {
    // 轮播图的数据
    swiper: [],
    // 设置轮播图的默认高度
    imgHeight: 176,
    // 是否自动播放
    isPlay: false,
    // 租房小组的数据
    groups: [],
    // 资讯列表的数据
    news: [],
    // 头部搜索的关键词
    keyword:''
  };
  componentDidMount() {
    
    this.getAllDatas()
  }

  // 获取首页所有接口数据
  getAllDatas = async () => {
    try {
      let [swiper,groups,news] = await Promise.all([getSwiper(),getGroup(),getNews()])
    // console.log(res) 
    if(swiper.status === 200 && groups.status === 200 && news.status === 200) {
      this.setState({
        swiper:swiper.data,
        news:news.data,
        groups:groups.data
      },() => {
        this.setState({
          isPlay:true
        })
      })
    }
    } catch(error) {
          console.log(error)
    }
    
  }

 // 渲染顶部导航
 renderTopNav = () => {
  return (
    <Flex justify="around" className="topNav">
      <div className="searchBox">
        <div className="city" onClick={ () =>{
          this.props.history.push('/cityList')
        }
        }>
          北京<i className="iconfont icon-arrow" />
        </div>
        <SearchBar
          value={this.state.keyword}
          onChange={(v) => this.setState({ keyword: v })}
          placeholder="请输入小区或地址"
        />
      </div>
      <div className="map" onClick={ () => {
         this.props.history.push('/map')
      }
       
      }>
        <i key="0" className="iconfont icon-map" />
      </div>
    </Flex>
  )
}

  // 渲染轮播图
  renderSwiper = () => {
    return (
      <Carousel
        // 自动播放
        autoplay={this.state.isPlay}
        autoplayInterval={2000}
        infinite
      >
        {this.state.swiper.map((val) => (
          <a
            key={val.id}
            href="http://www.itheima.com"
            style={{
              display: "inline-block",
              width: "100%",
              height: this.state.imgHeight,
            }}
          >
            <img
              src={`${BASE_URL}${val.imgSrc}`}
              alt=""
              style={{ width: "100%", verticalAlign: "top" }}
              onLoad={() => {
                // fire window resize event to change height
                //   窗口大小改变的时候=》 自适应
                window.dispatchEvent(new Event("resize"));
                this.setState({ imgHeight: "auto" });
              }}
            />
          </a>
        ))}
      </Carousel>
    );
  };

  // 渲染栏目导航
  renderNavs = () => {
    return (
      <Flex className="nav">
        {navs.map((item) => (
          <Flex.Item
            onClick={() => {
              this.props.history.push(item.path);
            }}
            key={item.id}
          >
            <img src={item.img} alt="" />
            <p>{item.title}</p>
          </Flex.Item>
        ))}
      </Flex>
    );
  };

  // 渲染租房小组
  renderGroups = () => {
    return (
      <div className="group">
        <Flex className="group-title" justify="between">
          <h3>租房小组</h3>
          <span>更多</span>
        </Flex>
        {/* 宫格布局 */}
        <Grid
          data={this.state.groups}
          // 显示为几列
          columnNum={2}
          // 是否有边框
          hasLine={false}
          // 每个格子是否固定为正方形
          square={false}
          renderItem={(item) => (
            <Flex key={item.id} className="grid-item" justify="between">
              <div className="desc">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
              <img src={`${BASE_URL}${item.imgSrc}`} alt="" />
            </Flex>
          )}
        />
      </div>
    );
  };

   // 渲染最新资讯
   renderNews() {
    return this.state.news.map(item => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img
            className="img"
            src={`${BASE_URL}${item.imgSrc}`}
            alt=""
          />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ))
  }
  render() {
    return (
      <div className="index">
        {/* 头部导航 */}
        {this.renderTopNav()}
        {/* 轮播图 */}
        {this.renderSwiper()}
        {/* 栏目导航 */}
        {this.renderNavs()}
        {/* 租房小组 */}
        {this.renderGroups()}
        {/* 最新资讯 */}
        <div className="news">
          <h3 className="group-title">最新资讯</h3>
          <WingBlank size="md">{this.renderNews()}</WingBlank>
        </div>
      </div>
    );
  }
}

export default Index;
