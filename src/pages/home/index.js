// 导航栏组件
import { TabBar } from "antd-mobile";

import React, { Component } from "react";
import { Route} from "react-router-dom";
import Index from "../index";
import House from "../House";
import Profile from "../Profile";

import './index.css' 

import TabBarList from '../../utils/tabBarList'
class Home extends Component {
  state = {
    // 选中状态
    selectedTab: this.props.location.pathname,
  };

  componentDidMount () {
    // 监听路由变化  不能用PureComponent 做性能优化
    this.unlisten = this.props.history.listen( (location) => {
     
      if(location.pathname !== this.state.selectedTab) {
        // console.log(111)
        this.setState({
        selectedTab: location.pathname,
      });
      }
      
    })
  }

  // 销毁路由监听事件
  componentWillUnmount () {
    this.unlisten()
  }
   
  renderTabBar = () => {
      return (
        <TabBar
        unselectedTintColor="#949494"
        tintColor="#33A3F4"
        barTintColor="white"
      >
       {
           TabBarList.map( (item) => <TabBar.Item
           title={item.title}
           key={item.title}
           icon={<i className={`iconfont ${item.icon}`} />}
           selectedIcon={<i className={`iconfont ${item.icon}`} />}
           selected={this.state.selectedTab === item.path}
         //   点击切换路由
           onPress={() => {
            //  this.setState({
            //    selectedTab: item.path,
            //  });
             this.props.history.push(item.path)
           }}
         />)
       }
        
      </TabBar>
      )
  }

  render() {
    return (
      <div className="home">
        {/* 二级路由 */}
        <Route exact path="/home" component={Index} />
        <Route path="/home/house" component={House} />
        <Route path="/home/profile" component={Profile} />

        {/* TabBar组件 */}
        <div className="tabBar">
         {
             this.renderTabBar()
         }
        </div>
      </div>
    );
  }
}

export default Home;
