import React,{useContext } from 'react'
import { Input, Menu, Segment ,Dropdown,
    Checkbox,
    Grid,
    Header,
    Icon,
    Image,
    Sidebar,
    
} from 'semantic-ui-react';

import {Switch,Route,Link,useRouteMatch} from "react-router-dom";
import StandardList from '../screens/standard/StandardList';
import StandardDetails from '../screens/standard/StandardDetails';
import SchemeVersion from '../screens/scheme/SchemeVersion';
import {StandardContext, getStandard,saveStandard } from '../screens/standard/standard';

import ContentLoader from '../components/ContentLoader';

const StandardNavigator = () => {
  
    const [std, setstd] = React.useState(null);
    let { path, url } = useRouteMatch();
    const [isLoading, setLoading] = React.useState(true)

    
  React.useEffect(() => {

    const bootstrapAsync = async () => {
      getStandard().then(x => {
        setstd(x);
        setLoading(false);  
        console.log(`${path}std/details/:index`);
      })
    };

    bootstrapAsync();

  }, []);

  const standardContext = React.useMemo(
    () => ({
      std,
      saveStd:(i,data)=>{
        // console.log(data);
        let stdDraft = JSON.parse(JSON.stringify(std));
        stdDraft[i]=data;
        setstd(stdDraft);
        saveStandard(data).then(x=>console.log(x)).catch(e=>console.log(e))
      }
    }),
    [std]
);
  return (
    
      <StandardContext.Provider value={standardContext}>
        <ContentLoader open={isLoading}/>
            <Switch>
                <Route exact path={path}>
                    <StandardList />
                </Route>
                <Route path={`${path}/details/:index`}>
                    <StandardDetails />
                </Route>
                
            </Switch>
          </StandardContext.Provider>
  )
}

export default StandardNavigator