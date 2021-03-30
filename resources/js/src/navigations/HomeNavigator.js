import React from 'react'
import { Input, Menu, Segment ,Dropdown,
    Checkbox,
    Grid,
    Header,
    Icon,
    Image,
    Sidebar,
    
} from 'semantic-ui-react';

import {Switch,Route,Link,useRouteMatch} from "react-router-dom";

import logo from '../assets/img/initialWhite.png'; 

import {AuthContext} from '../screens/auth/auth';
import HomeScreen from '../screens/HomeScreen';
import SchemeNavigator from './SchemeNavigator';
import StandardNavigator from './StandardNavigator';
import CompanyNavigator from './CompanyNavigator';
import SubscriptionNavigator from './SubscriptionNavigator';
import ProfileNavigator from './ProfileNavigator';


const HomeNavigator = () => {
    const [activeItem, setactiveItem] = React.useState(window.location.pathname.split("/")[1])
    const { profile,signOut,changeAccess } = React.useContext(AuthContext);
    let { path, url } = useRouteMatch();
console.log(profile);
    
  return (
      
    <div style={{height:'100vh',display:'flex', flexDirection:'column' }}>
    <Menu borderless stackable attached='top' inverted size='large'>
        <Menu.Item>
          <img src={logo} />
        </Menu.Item>

        <Menu.Item header>Audit Management System</Menu.Item>
        <Menu.Menu position='right'>
          <Menu.Item
          >
           
           <Dropdown item text={profile.name}>
            <Dropdown.Menu>
              <Dropdown.Item onClick={()=>changeAccess(2)}>Client Access</Dropdown.Item>
              <Dropdown.Item onClick={()=>changeAccess(4)}>Auditor Access</Dropdown.Item>
              <Dropdown.Item onClick={signOut}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          </Menu.Item>
{/* 
          <Menu.Item
            name='help'
            active={activeItem === 'help'}
          >
            Help
          </Menu.Item> */}
        </Menu.Menu>
      </Menu>
   <div  style={{display:'flex', flexDirection:'row',flex:1, overflow:'hidden' }}>
   <Menu  vertical attached="top">
              <Menu.Item as={Link} onClick={()=>setactiveItem('')}
          name='Standards'
          to="/"
          active={activeItem === ''}
        />
        {/* <Menu.Item as={Link} onClick={()=>setactiveItem('std')}
          name='Standards'
          to="/std"
          active={activeItem === 'std'}
        /> */}
        <Menu.Item as={Link} onClick={()=>setactiveItem('scheme')}
          name='Schemes'
          to="/scheme"
          active={activeItem === 'scheme'}
        />
        <Menu.Item as={Link} onClick={()=>setactiveItem('company')}
          name='Company'
          to="/company"
          active={activeItem === 'company'}
        />
        <Menu.Item as={Link} onClick={()=>setactiveItem('subcr')}
          name='Subscription'
          to="/subcr"
          active={activeItem === 'subcr'}
        />
        <Menu.Item as={Link} onClick={()=>setactiveItem('user')}
          name='Users'
          to="/profile"
          active={activeItem === 'user'}
        />
          </Menu>
          <Segment className="innerContainer flexCol"  basic>
            <Switch>
                    <Route exact path="/">
                        <StandardNavigator />
                    </Route>
                    {/* <Route path="/std">
                        <StandardNavigator />
                    </Route> */}
                    <Route path="/scheme">
                        <SchemeNavigator />
                    </Route>
                    <Route path="/company">
                        <CompanyNavigator />
                    </Route>
                    <Route path="/subcr">
                        <SubscriptionNavigator />
                    </Route>
                    <Route path="/profile">
                        <ProfileNavigator />
                    </Route>
                    
                </Switch>
            </Segment>

            
            </div>
        
  </div>
  )
}

export default HomeNavigator