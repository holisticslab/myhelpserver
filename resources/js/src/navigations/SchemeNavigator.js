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
import SchemeList from '../screens/scheme/SchemeList';
import SchemeDetails from '../screens/scheme/SchemeDetails';
import SchemeVersion from '../screens/scheme/SchemeVersion';
import {SchemeContext, getScheme } from '../screens/scheme/scheme';

const SchemeNavigator = () => {
  
    const [schmes, setScheme] = React.useState(null);
    let { path, url } = useRouteMatch();

    
  React.useEffect(() => {

    const bootstrapAsync = async () => {
      getScheme().then(x => {
        setScheme(x);
      })
    };

    bootstrapAsync();

  }, []);

  const schemeContext = React.useMemo(
    () => schmes,
    [schmes]
);
  return (
    <SchemeContext.Provider value={schemeContext}>
            <Switch>
                    <Route exact path={path}>
                        <SchemeList />
                    </Route>
                    <Route path={`${path}/details/:index/version/:version`}>
                        <SchemeVersion />
                    </Route>
                    <Route path={`${path}/details/:index`}>
                        <SchemeDetails />
                    </Route>
                    
                </Switch>
              </SchemeContext.Provider>
  )
}

export default SchemeNavigator