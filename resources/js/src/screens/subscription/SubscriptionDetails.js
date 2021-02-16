import React, { useContext } from 'react'
import {
  Input, Menu, Segment,
  Checkbox,
  Grid,
  Header,
  Icon,
  Image,
  Sidebar,
  Transition,
  List,
  Button,
  Table,
  Tab,
  Modal,
  Form,Dropdown
} from 'semantic-ui-react';

import * as moment from 'moment';

import { useParams, Link, useRouteMatch } from "react-router-dom";

import {deleteUser, postUser, SubscriptionContext,getSubcrData } from './subscription';
import TabPremises from './TabPremises';
import TabChecklists from './TabChecklists';
import TabUser from './TabUser';
import TabSubcription from './TabSubcription';

const renderHTML = (rawHTML) => React.createElement("div", { dangerouslySetInnerHTML: { __html: rawHTML } });

const SubscriptionDetails = () => {

  const {subcr,cmpny} = useContext(SubscriptionContext);
  const [subdata, setData] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [userddl, setUserddl] = React.useState([]);
  
  const [premises, setpremises] = React.useState([]);
  const [premisesddl, setpremisesddl] = React.useState([]);
  const [stockCklist, setstockCklist] = React.useState([]);
  const [filteredCklist, setfilteredCklist] = React.useState([]);
  
  const [cklist, setcklist] = React.useState([]);
  const [cklistddl, setcklistddl] = React.useState([]);

  
  let { path, url } = useRouteMatch();

  const { index } = useParams();


  React.useEffect(() => {

    const bootstrapAsync = async () => {
      if (subcr)
   {
      getSubcrData(subcr[index].id).then(x=>{
        console.log(x);
        if(typeof x.data!=="undefined") setData(x.data);

        
        if(typeof x.users!=="undefined") {
        const ddl =  x.users.map((x,i) =>
        ({
          key: x.id,
          text: x.name,
          value: x.id,
        }))

        setUserddl(ddl);
        setUsers(x.users);}

        if(typeof x.premises!=="undefined"){
        const ddl2 =  Object.keys(x.premises).map((id) =>
        ({
          key: id,
          text: x.premises[id].name,
          value: id,
        }))
        
        setpremises(x.premises);
        setpremisesddl([
          {
          key: '*',
          text: "All",
          value: "*",
        },...ddl2]);
        }
        
        
        if(typeof x.schmlist!=="undefined"){
        const ddlcklist =  Object.keys(x.schmlist).map((id) =>
        ({
          key: id,
          text: x.schmlist[id].name,
          value: id,
        }))

        
        setcklist(x.schmlist);
        setcklistddl(ddlcklist);
      
        const ddl3 =  x.stockCkList.flatMap((x,i) =>{
          const found = ddlcklist.some(el => el.text === x.cklistName);
          if(!found)
          return({
            key: x.id,
            text: x.cklistName,
            value: x.id,
          })
          else return [];
        })
          setfilteredCklist(ddl3)
      }
      else{
        const ddl3 =  x.stockCkList.flatMap((x,i) =>{
          return({
            key: x.id,
            text: x.cklistName,
            value: x.id,
          })
        })
          setfilteredCklist(ddl3)
      }
        
        setstockCklist(x.stockCkList);
      

      }).catch(e=>{
          console.log(e)
        });
      }
    };

    bootstrapAsync();

  }, [subcr]);
  

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
        setUsers(currentuser);

        let ddl = JSON.parse(JSON.stringify(userddl));
        let index2=ddl.findIndex(obj => {return obj.key === x.id});
        if(index2<0){

        ddl.push({
            key: x.id,
            text: x.name,
            value: x.id,
          });
        }
        else{
          if(type==="delete") ddl.splice(index2, 1)
          else ddl[index2]={
                  key: x.id,
                  text: x.name,
                  value: x.id,
                };
        }
        setUserddl(ddl);
      }
      else{
        setUsers([x]);
        setUserddl([{
          key: x.id,
          text: x.name,
          value: x.id,
        }]);
      }
      
  }
  const updatePremise =(x)=>{
    const ddl2 =  Object.keys(x).map((id) =>
    ({
      key: id,
      text: x[id].name,
      value: id,
    }))
    
    setpremises(x);
    setpremisesddl(ddl2);
  }

 const updateSubscription=(x)=>{
    setData(x);
  }
  const updateCklist =(x)=>{
    console.log(x);
    const ddl2 =  Object.keys(x).map((id) =>
    ({
      key: id,
      text: x[id].name,
      value: id,
    }))
    
    setcklist(x);
    setcklistddl(ddl2);

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
      setfilteredCklist(ddl3)
  }
  
  const panes = [
    {
      menuItem: { key: 'users', icon: 'users', content: 'Users' },
      render: () => <Tab.Pane>
                      <TabUser data={users} id={subcr[index].cmpnyFK} onDataChange={updateUser}  id={subcr[index].cmpnyFK} />
                    </Tab.Pane>,
    },
    {
      menuItem: { key: 'prms', icon: 'building', content: 'Premises' },
      render: () => <Tab.Pane>
                      <TabPremises data={premises} id={subcr[index].cmpnyFK} onDataChange={updatePremise}/>
                    </Tab.Pane>,
    },
    {
      menuItem: { key: 'cklist', icon: 'clipboard list', content: 'Checklists' },
      render: () => <Tab.Pane>
                     <TabChecklists data={cklist} stock={filteredCklist} id={subcr[index].cmpnyFK} onDataChange={updateCklist}/>
                    </Tab.Pane>,
    },
    {
      menuItem: { key: 'subcr', icon: 'briefcase', content: 'Subscription' },
      render: () => <Tab.Pane>
                      <TabSubcription data={subdata} ddl={{premisesddl,cklistddl,userddl}} id={subcr[index].cmpnyFK} onDataChange={updateSubscription}/>
                    
                    </Tab.Pane>,
    },
  ]
  if (subcr)
   {
     const detail=subcr[index];
     return (

      <Transition transitionOnMount={true} animation="fade" duration={1000}>
        <div className="in innerContainer listScroll">
          <Header as='h3' dividing style={{ lineHeight: '2em' }}>
            <Button size='medium' circular icon='angle left' basic color='green' as={Link} to={`${url.split("/details").shift()}`} />
              Subscription :{cmpny.find(obj => {return obj.value === detail.cmpnyFK}).text} </Header>

              <Segment color='green'>
              <Header as='h3' dividing>Subscription Package</Header>
              <Grid textAlign='center'  stackable columns={4} style={{ width: '100%' }}>
                <Grid.Column >
                <Header sub>Subscription Period</Header>
                <span>{detail.dateStart+' - '+detail.dateEnd}</span>
                </Grid.Column>
                <Grid.Column >
                  
              <Header sub>Max User</Header>
                <span>{detail.subcrDetails.user}</span>
                </Grid.Column>
                <Grid.Column >
              <Header sub>Max Premise</Header>
                <span>{detail.subcrDetails.premise}</span>
                </Grid.Column>
                
                <Grid.Column >
                  <Header sub>Max Scheme</Header>
                  <span>{detail.subcrDetails.schm}</span>
                </Grid.Column>
              </Grid>
             
            </Segment>
            <Tab panes={panes} onTabChange={(e,d)=>{console.log(d)}}/>
        
         
        </div>
        
      </Transition>
    )}
  else
    return (<Header as='h3' >Loading....</Header>)
}

export default SubscriptionDetails