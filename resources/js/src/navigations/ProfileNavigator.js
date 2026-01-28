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
import ProfileList from '../screens/profile/ProfileList';
import ProfileDetails from '../screens/profile/ProfileDetails';
import {ProfileContext, getProfile } from '../screens/profile/profile';
import {getCompany } from '../screens/company/company';
import {getRoles } from '../components/function';

const ProfileNavigator = () => {
  
    const [usr, setusr] = React.useState(null);
    const [cmpny, setcmpny] = React.useState(null);
    const [roles, serRoles] = React.useState(null);
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
      getRoles().then(x => {

        const ddl =  x.map((x,i) =>
        ({
          key: x.rolePK,
          text: x.rolename,
          value: x.rolePK,
        }))
        serRoles(ddl);
      });
      getProfile().then(x => {
        setusr(x);
      })
    };

    bootstrapAsync();

  }, []);

  const profileContext = React.useMemo(
    () => ({usr,cmpny,roles}),
    [usr,cmpny,roles]
);
  return (
    <ProfileContext.Provider value={profileContext}>
            <Switch>
                    <Route exact path={path}>
                        <ProfileList />
                    </Route>
                    <Route path={`${path}/details/:index`}>
                        <ProfileDetails />
                    </Route>
                    
                </Switch>
              </ProfileContext.Provider>
  )
}

export default ProfileNavigator