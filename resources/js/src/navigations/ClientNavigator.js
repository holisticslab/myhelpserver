import React from 'react'
import { Input, Menu, Segment ,Dropdown,
    Checkbox,
    Grid,
    Header,
    Icon,
    Image,
    Sidebar, Dimmer, Loader,
    
} from 'semantic-ui-react';

import {Switch,Route,Link,useRouteMatch} from "react-router-dom";

import logo from '../assets/img/initialWhite.png'; 

import {AuthContext} from '../screens/auth/auth';
import HomeScreen from '../screens/HomeScreen';
import ClientUser from '../screens/client/ClientUser';
import ClientChecklists from '../screens/client/ClientChecklists';
import ClientCreateChecklist from '../screens/client/ClientCreateChecklist';

import ClientPremises from '../screens/client/ClientPremises';
import ClientSubcription from '../screens/client/ClientSubcription';
import Home from '../screens/client/Home';
import {getData,ClientContext} from '../screens/client/client';
import {isMobile} from 'react-device-detect';
import FlashScreen from '../screens/FlashScreen';


const ClientNavigator = () => {
    const [activeItem, setactiveItem] = React.useState(window.location.pathname.split("/")[1])
    const { profile,cmpny,signOut,changeAccess } = React.useContext(AuthContext);
    const [subcrData, setsubcrData] = React.useState([]);
    const [users, setusers] = React.useState([]);
    const [premises, setpremises] = React.useState([]);
    const [schmlist, setschmlist] = React.useState([]);
    const [activeDraft, setDraft] = React.useState(null);
    const [active_subcr, setactive_subcr] = React.useState(null);
    const [sideBarOpen, openSidebar] = React.useState(false);
    const [loading,setloading] = React.useState(true);
    
    
    let { path, url } = useRouteMatch();
    const sidebarClick=fn=>{
      openSidebar(false);
    }
    const bootstrapAsync = async () => {
      let cklistDraft = localStorage.getItem(cmpny.cmpnyPK + "_cklistDraft");
      if (cklistDraft) {
        cklistDraft = JSON.parse(cklistDraft);
        setDraft(cklistDraft);
      }
      getData().then(x=>{
        setsubcrData(x.data);
        setusers(x.users);
        setpremises(x.premises);
        setschmlist(x.schmlist);
        setactive_subcr(x.active_subcr);
        setloading(false);
      }).catch(e=>{
        console.log(e)
        setloading(false);
      })
    };

  React.useEffect(() => {
    bootstrapAsync();

  }, []);

  const clientContext = React.useMemo(
    () => ({subcrData,users,premises,schmlist,activeDraft,active_subcr,
      reloadData:setschmlist,
      reloadSubcr:setsubcrData,
      reloadPremise:setpremises,
      reloadUser:setusers,
    clearDraft:()=>{localStorage.removeItem(cmpny.cmpnyPK + "_cklistDraft"); setDraft(null);}
    }),
    [subcrData,users,premises,schmlist,activeDraft,active_subcr]
);

const updateUser=(x,type)=>{
  if(users){
  // ]
 
 delete x.password;
 let currentuser = JSON.parse(JSON.stringify(users));

   let index=currentuser.findIndex(obj => {return obj.id === x.id});
   if(index<0){
     currentuser.push(x);
   }
   else{
     if(type==="delete")currentuser.splice(index, 1)
     else currentuser[index]=x;
   }
   setusers(currentuser);

 }
 else{
   setusers([x]);
  
 }
 
}

const updatePremise =(x)=>{
  // const ddl2 =  Object.keys(x).map((id) =>
  // ({
  //   key: id,
  //   text: x[id].name,
  //   value: id,
  // }))
  setpremises(x);
  // setpremisesddl(ddl2);
}

const updateSubscription=(x)=>{
  setsubcrData(x);
}
const updateCklist =(x)=>{
  const ddl2 =  Object.keys(x).map((id) =>
  ({
    key: id,
    text: x[id].name,
    value: id,
  }))
  
  setschmlist(x);
  // setcklistddl(ddl2);

  const ddl3 =  stockCklist.flatMap((x,i) =>{
    const found = ddl2.some(el => el.text === x.cklistName);
    if(!found)
    return({
      key: x.id,
      text: x.cklistName,
      value: x.id,
    })
    else return [];
  })
    // setfilteredCklist(ddl3)
}
  if(loading) return <FlashScreen msg="Loading..." config={cmpny.cmpnyConfig}/>
  else return (
      
    <div style={{height:'100vh',display:'flex', flexDirection:'column' }}>
    <Menu borderless attached='top' inverted size='large' style={{backgroundColor:cmpny.cmpnyConfig && cmpny.cmpnyConfig.headerColor? cmpny.cmpnyConfig.headerColor:""}}>
        <Menu.Item>
          <Image src={cmpny.cmpnyConfig && cmpny.cmpnyConfig.headerLogo? cmpny.cmpnyConfig.headerLogo:logo} size='mini' verticalAlign='middle'/>
        </Menu.Item>

  {!isMobile&&<Menu.Item header  as="h3" style={{color:cmpny.cmpnyConfig && cmpny.cmpnyConfig.headerTextColor? cmpny.cmpnyConfig.headerTextColor:""}}>{cmpny.cmpnyConfig && cmpny.cmpnyConfig.appName? cmpny.cmpnyConfig.appName: cmpny.cmpnyName+" Audit Management System"}</Menu.Item>}
        <Menu.Menu position='right'>
          <Menu.Item>
           {!isMobile &&
             <Dropdown item text={profile.name}>
            <Dropdown.Menu>
              {profile.accesslvl<2&&<Dropdown.Item onClick={()=>changeAccess(profile.accesslvl)}>Change Access</Dropdown.Item>}
              <Dropdown.Item onClick={signOut}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>}
          </Menu.Item>
          {isMobile && <Menu.Item
          name='sidebar'
          onClick={()=>openSidebar(!sideBarOpen)}
        >
          <Icon name='bars' />
        </Menu.Item>}
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
   
   {isMobile?
   <Sidebar
   as={Menu}
   animation="push"
   icon='labeled'
   inverted
   vertical
   direction="left"
   visible={sideBarOpen}
   width='thin'
 >
  <Menu.Item>
         <Header inverted as='h2'>
         {cmpny.cmpnyName}
         <Header.Subheader>
     {cmpny.cmpnyDetails.address}
   </Header.Subheader>
 </Header>
       </Menu.Item>

       <Menu.Item as={Link} onClick={()=>sidebarClick(setactiveItem(''))}
         name='home'
         to="/"
         active={activeItem === ''}
       />
       <Menu.Item as={Link} onClick={()=>sidebarClick(setactiveItem('premises'))}
         name='Premises'
         to="/premises"
         active={activeItem === 'premises'}
       />
       
       <Menu.Item as={Link} onClick={()=>sidebarClick(setactiveItem('cklist'))}
         name='Checklists'
         to="/checklist"
         active={activeItem === 'cklist'}
       />
       
       <Menu.Item as={Link} onClick={()=>sidebarClick(setactiveItem('subcr'))}
         name='Subscription Group'
         to="/subscription"
         active={activeItem === 'subcr'}
       />
       <Menu.Item as={Link} onClick={()=>sidebarClick(setactiveItem('user'))}
         name='Users'
         to="/users"
         active={activeItem === 'user'}
       />
       <Menu.Item onClick={()=>sidebarClick(signOut())} attached="bottom"
         name='Logout'
       />

       
       </Sidebar>
   :
   <Menu  vertical attached="top">
   <Menu.Item>
          <Header as='h2'>
          {cmpny.cmpnyName}
          <Header.Subheader>
      {cmpny.cmpnyDetails.address}
    </Header.Subheader>
  </Header>
        </Menu.Item>

        <Menu.Item as={Link} onClick={()=>setactiveItem('')}
          name='home'
          to="/"
          active={activeItem === ''}
        />

        <Menu.Item as={Link} onClick={()=>setactiveItem('premises')}
          name='Premises'
          to="/premises"
          active={activeItem === 'premises'}
        />
        
        <Menu.Item as={Link} onClick={()=>setactiveItem('cklist')}
          name='Checklists'
          to="/checklist"
          active={activeItem === 'cklist'}
        />
        
        <Menu.Item as={Link} onClick={()=>setactiveItem('subcr')}
          name='Subscription Group'
          to="/subscription"
          active={activeItem === 'subcr'}
        />
        <Menu.Item as={Link} onClick={()=>setactiveItem('user')}
          name='Users'
          to="/users"
          active={activeItem === 'user'}
        />
      </Menu>}
      <ClientContext.Provider value={clientContext}>
            <Segment className="innerContainer flexCol"  basic>
            <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route path="/users">
                        <ClientUser data={users}  onDataChange={updateUser}  id={cmpny.cmpnyPK} accesslvl={profile.accesslvl} />
                    </Route>
                    
                    <Route path="/premises">
                        <ClientPremises data={premises}  onDataChange={updatePremise}  id={cmpny.cmpnyPK} accesslvl={profile.accesslvl} />
                    </Route>
                    
                    <Route path="/checklist/:index">
                        <ClientCreateChecklist onDataChange={updateCklist}  id={cmpny.cmpnyPK} accesslvl={profile.accesslvl} />
                    </Route>
                    <Route path="/checklist">
                        <ClientChecklists data={schmlist}  onDataChange={updateCklist}  id={cmpny.cmpnyPK} accesslvl={profile.accesslvl} />
                    </Route>
                    <Route path="/checklistadd">
                        <ClientCreateChecklist  onDataChange={updateCklist}  id={cmpny.cmpnyPK} accesslvl={profile.accesslvl} />
                    </Route>
                    
                    
                    <Route path="/subscription">
                        <ClientSubcription data={subcrData} id={cmpny.cmpnyPK} accesslvl={profile.accesslvl} />
                    </Route>
                    {/* <Route path="/std">
                        <StandardNavigator />
                    </Route>
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
                    </Route> */}
                    
                </Switch>
            </Segment>
            </ClientContext.Provider>
            </div>
        
  </div>
  )
}

export default ClientNavigator