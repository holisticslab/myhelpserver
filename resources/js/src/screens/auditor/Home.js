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

import {AuditorContext} from './auditor';
import {AuthContext} from '../auth/auth';
import {EditableLabel} from '../../components/simplifyUi';

import { postUser} from '../subscription/subscription';

const renderHTML = (rawHTML) => React.createElement("div", { dangerouslySetInnerHTML: { __html: rawHTML } });

const Home = () => {

  const { profile,cmpny,signOut } = React.useContext(AuthContext);
const { premises,schmlist,subcrData } = React.useContext(AuditorContext);

const [name, setName] = React.useState("");
const [userName, setUsername] = React.useState("");
const [oldPassword, setOldPassword] = React.useState("");
const [password, setPassword] = React.useState("default");
const [password2, setPassword2] = React.useState("default");
 
  let { path, url } = useRouteMatch();

  const { index } = useParams();


  React.useEffect(() => {

    const bootstrapAsync = async () => {
      setName(profile.name);
      setUsername(profile.username);
      console.log(profile);
    };

    bootstrapAsync();
  }, [profile]);
  

  const updateUser=()=>{
    const data={id:profile.id,name,username,password,oldPassword};
    
    postUser(data).then(x=>{
      onDataChange(x,"edit");
    }).catch(e=>console.log(e))
    resetForm();
  }

     return (

      <Transition transitionOnMount={true} animation="fade" duration={1000}>
        <div className="in innerContainer listScroll">
          <Header as='h3' dividing style={{ lineHeight: '2em' }}>
             {cmpny && cmpny.cmpnyName} </Header>
             <Segment.Group>
             <Segment>
                <Header as='h3' dividing>Details</Header>
                <EditableLabel
                  fluid
                  placeholder="Your Name"
                  label='Name'
                  value={name}
                  onSave={()=>{}}
                />
                </Segment>
                <Segment>
                <EditableLabel
                  fluid
                  placeholder="username"
                  label='Username'
                  value={userName}
                  onSave={()=>{}}
                />
               
              </Segment>
              <Segment>
                <EditableLabel
                  fluid
                  placeholder="Password"
                  label='Password'
                  value={"************"}
                  onSave={()=>{}}
                />
               
              </Segment>
             {
               subcrData&&<Segment > 
                <Header sub>Subscription Period</Header>
                <span>{moment(new Date(subcrData.dateStart)).format('Do MMMM YYYY')+' - '+moment(new Date(subcrData.dateEnd)).format('Do MMMM YYYY')}</span>
               
             
            </Segment>
            } 
            
            </Segment.Group>
        
         
        </div>
        
      </Transition>
    )}


export default Home