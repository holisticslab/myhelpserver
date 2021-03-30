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
import SchemeEditor from '../screens/scheme/SchemeEditor';
import {SchemeContext, getScheme } from '../screens/scheme/scheme';

const SchemeNavigator = () => {
  
    const [schmes, setScheme] = React.useState(null);
    const [activeDraft, setDraft] = React.useState(null);
    let { path, url } = useRouteMatch();

    
    const bootstrapAsync = async () => {
      getScheme().then(x => {
        setScheme(x);
      });

      let cklistDraft = localStorage.getItem("general_cklistDraft");
      if (cklistDraft) {
        cklistDraft = JSON.parse(cklistDraft);
        setDraft(cklistDraft);
      }
    };
    
  React.useEffect(() => {

    bootstrapAsync();

  }, []);

  const schemeContext = React.useMemo(
    () => ({
      schmes,activeDraft,
      reloadData:setScheme,
      clearDraft:()=>{localStorage.removeItem("general_cklistDraft"); setDraft(null);}
    }),
    [schmes,activeDraft]
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
                    
                    <Route path={`${path}/details/:index/editor/:vid`}>
                        <SchemeEditor />
                    </Route>
                    <Route path={`${path}/details/:index`}>
                        <SchemeDetails />
                    </Route>
                    
                </Switch>
              </SchemeContext.Provider>
  )
}

export default SchemeNavigator