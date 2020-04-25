// 城市列表

import React, { Component } from "react";
import { getCityList, getHotCity } from "../../utils/api/City";
import { getCurCity, setLocal, CURR_CITY } from "../../utils";
import { List, AutoSizer } from "react-virtualized";
import { NavBar, Icon, Toast } from "antd-mobile";
import "./index.scss";

class CityList extends Component {
  state = {
    // 归类的城市数据
    cityList: {},
    // 归类的城市索引
    cityIndex: [],
    // 当前 滚动到的行索引
    activeIndex:0
  };
  componentDidMount() {
    this.getCityList();
  }

  //   格式化列表的title
  formatLetter = (letter,isRight) => {
    switch (letter) {
      case "#":
        return isRight?'当':"当前城市";
      case "hot":
        return isRight?'热':"热门城市";
      default:
        // 处理成大写
        return letter.toUpperCase();
    }
  };
  // 点击切换城市
  changeCity = (item) => {
    console.log(item);
    // 有数据的
    const hasData = ["北京", "上海", "广州", "深圳"];
    // 1. 在rowRenderer方法中给每个城市注册click事件
    // 2. 如果是北上广深，更新本地存储的当前城市数据，并返回首页
    // 3. 如果不是，提示无数据
    // 数组方法hasData.includes() 里面传入一个值，数组内有就返回true没有就返回false
    if (hasData.includes(item.label)) {
      //  更新当前城市
      setLocal(CURR_CITY, JSON.stringify(item));
      // 跳转首页
      this.props.history.push("/");
    } else {
      Toast.info("该城市暂无房源。。");
    }
  };

  rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) => {
    //   获取处理完的状态数据
    const { cityList, cityIndex } = this.state;
    // 对象的键
    let letter = cityIndex[index];
    // console.log(letter)
    let item = cityList[letter];
    // console.log(item)
    return (
      <div key={key} style={style} className="city-item">
        <div className="title">{this.formatLetter(letter)}</div>
        {item.map((item) => (
          // console.log(item)

          <div
            className="name"
            key={item.value}
            onClick={() => this.changeCity(item)}
          >
            {item.label}
          </div>
        ))}
      </div>
    );
  };

  // 获取城市列表的数据
  getCityList = async () => {
    const { status, data } = await getCityList();

    //   console.log(res)
    if (status === 200) {
      // 归类数据按首字母排序
      let { cityIndex, cityList } = this.formatCities(data);
      //   加入热门城市数据
      let res = await getHotCity();
      if (res.status === 200) {
        cityList["hot"] = res.data;
        cityIndex.unshift("hot");
      }
      // console.log(res)
      // 加入当前城市
      const ress = await getCurCity();
      // console.log(ress)
      cityList["#"] = [ress];
      cityIndex.unshift("#");
      //   console.log(cityIndex, cityList);

      // 响应式
      this.setState({
        cityIndex,
        cityList,
      });
    }
  };

  // 动态计算高度
  jiheight = ({ index }) => {
    // 解构
    const { cityIndex, cityList } = this.state;
    // console.log(rowindex)
    // 计算公式：title高度+当前归类的城市数量*36
    // 当前归类的城市数量
    let cityItem = cityIndex[index];
    // console.log(cityList[cityItem])

    return 50 * cityList[cityItem].length + 36;
  };

  // 按城市首字母归类城市数据
  formatCities = (data) => {
    // 归类的数据
    let cityList = {},
      cityIndex;
    // 遍历数据--归类
    data.forEach((item) => {
      // 获取当前城市的首字母
      let first = item.short.slice(0, 1);
      // console.log(first)
      // 排重归类
      // 判断存不存在当前首字母开头的健
      if (!cityList[first]) {
        // 不存在
        cityList[first] = [item];
      } else {
        // 存在
        cityList[first].push(item);
      }
    });
    // console.log('首字母归类完数据 ',cityList)
    // 获取归类的首字母数据索引
    cityIndex = Object.keys(cityList).sort();
    // console.log('获取归类的首字母数据',cityIndex)
    // 遍历列表
    // cityIndex.map((item) => {
    //     console.log(item,cityList[item])
    //     return null
    // })
    return {
      cityIndex,
      cityList,
    };
  };



// 渲染右侧索引
  renderCityIndex = () => {
    const { cityIndex,activeIndex } = this.state;
    return cityIndex.map((item, index) => {
      return (
        <li
          key={item}
          className="city-index-item"
          onClick={()=> {
            // 点击的时候确定定位列表
            //  console.log(this.listRef.scrollToRow)
             this.listRef.scrollToRow(index)
            //  this.setState({
            //    activeIndex:index
            //  })
          }}
        >
          <span className={activeIndex === index ? 'index-active' : ''}>
            {this.formatLetter(item, true)}
          </span>
        </li>
      )
    })
  }
  // 每次滚动完渲染
  onRowsRendered = (index) => {
    if(this.state.activeIndex !== index.startIndex) {
      // console.log(index.startIndex)
        this.setState({
          activeIndex:index.startIndex
        })
    }
        
  }
  render() {
    return (
      <div className="citylist">
        {/* 城市列表 */}
        <NavBar
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={() => this.props.history.goBack()}
        >
          城市选择
        </NavBar>
        <AutoSizer>
          {({ height, width }) => (
            <List
              // 获取原型方法
              ref={(e => this.listRef = e)}
              // 显示置顶
              scrollToAlignment="start"
              // 滚动渲染
              onRowsRendered={this.onRowsRendered}
              width={width}
              height={height}
              rowCount={this.state.cityIndex.length}
              rowHeight={this.jiheight}
              rowRenderer={this.rowRenderer}
            />
          )}
        </AutoSizer>
        {/* 右侧索引列表 */}
        <ul className="city-index">{this.renderCityIndex()}</ul>
      </div>
    );
  }
}

export default CityList;
