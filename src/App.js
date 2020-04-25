import React from 'react';
import { HashRouter as Router,Route,Switch,Redirect} from 'react-router-dom'
import Home from './pages/home';
import CityList from './pages/CityList';
import Map from './pages/map';
import Undefined from './pages/undefined'



function App() {
  return (
    // 一级路由
    <Router>
      <div className="app">
       <Switch>
         {/* 重定向 */}
       <Redirect exact from="/" to="/home" />
       <Route path="/home" component={Home} />
       <Route path="/cityList" component={CityList} />
       <Route path="/map" component={Map} />
       {/* 配置404页面 */}
       <Route component={Undefined}/>
       </Switch>
      </div>
       
       
    </Router>
  );
}

export default App;
