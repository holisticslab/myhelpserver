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
import SubscriptionList from '../screens/subscription/SubscriptionList';
import SubscriptionDetails from '../screens/subscription/SubscriptionDetails';
import {SubscriptionContext, getSubscription } from '../screens/subscription/subscription';
import {getCompany } from '../screens/company/company';

const SubscriptionNavigator = () => {
  
    const [subcr, setsubcr] = React.useState(null);
    const [cmpny, setcmpny] = React.useState(null);
    let { path, url } = useRouteMatch();

    
  React.useEffect(() => {

    const bootstrapAsync = async () => {
      getCompany().then(x => {

        const ddl =  x.map((x,i) =>
        ({
          key: x.cmpnyPK,
          text: x.cmpnyName,
          value: x.cmpnyPK,
        }))
        setcmpny(ddl);
      });
      getSubscription().then(x => {
        setsubcr(x);
      })
    };

    bootstrapAsync();

  }, []);

  const subscriptionContext = React.useMemo(
    () => ({subcr,cmpny}),
    [subcr,cmpny]
);
  return (
    <SubscriptionContext.Provider value={subscriptionContext}>
            <Switch>
                    <Route exact path={path}>
                        <SubscriptionList />
                    </Route>
                    <Route path={`${path}/details/:index`}>
                        <SubscriptionDetails />
                    </Route>
                    
                </Switch>
              </SubscriptionContext.Provider>
  )
}

export default SubscriptionNavigator