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
import CompanyList from '../screens/company/CompanyList';
import CompanyDetails from '../screens/company/CompanyDetails';
import {CompanyContext, getCompany } from '../screens/company/company';

const CompanyNavigator = () => {
  
    const [cmpny, setcmpny] = React.useState(null);
    let { path, url } = useRouteMatch();

    
  React.useEffect(() => {

    const bootstrapAsync = async () => {
      getCompany().then(x => {
        setcmpny(x);
      })
    };

    bootstrapAsync();

  }, []);

  const companyContext = React.useMemo(
    () => cmpny,
    [cmpny]
);
  return (
    <CompanyContext.Provider value={companyContext}>
            <Switch>
                    <Route exact path={path}>
                        <CompanyList />
                    </Route>
                    <Route path={`${path}/details/:index`}>
                        <CompanyDetails />
                    </Route>
                    
                </Switch>
              </CompanyContext.Provider>
  )
}

export default CompanyNavigator