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
  Form,Dropdown, Dimmer, Loader,
} from 'semantic-ui-react';

import * as moment from 'moment';

import { useParams, Link, useRouteMatch } from "react-router-dom";

import {ClientContext} from './client';
import {AuthContext} from '../auth/auth';

const renderHTML = (rawHTML) => React.createElement("div", { dangerouslySetInnerHTML: { __html: rawHTML } });

const Home = () => {

  const { profile,cmpny,signOut } = React.useContext(AuthContext);
const { users,premises,schmlist,reloadData,active_subcr } = React.useContext(ClientContext);
 
const [subcrData, setSubcrData] = React.useState(null);

  let { path, url } = useRouteMatch();

  const { index } = useParams();


  React.useEffect(() => {

    const bootstrapAsync = async () => {
      setSubcrData(active_subcr)
    };

    bootstrapAsync();
  }, [active_subcr]);
  


     return (

      <Transition transitionOnMount={true} animation="fade" duration={1000}>
        <div className="in innerContainer listScroll">
          <Header as='h3' dividing style={{ lineHeight: '2em' }}>
             {cmpny && cmpny.cmpnyName} </Header>

              {subcrData?<Segment color='green'>
              <Header as='h3' dividing>Usage Summary</Header>
              <Grid textAlign='center'  stackable columns={4} style={{ width: '100%' }}>
                <Grid.Column >
                <Header sub>Subscription Period</Header>
                <span>{moment(new Date(subcrData.dateStart)).format('Do MMMM YYYY')+' - '+moment(new Date(subcrData.dateEnd)).format('Do MMMM YYYY')}</span>
                </Grid.Column>
                <Grid.Column >
                  
              <Header sub>User</Header>
                <span>{`${users.length}/${subcrData.subcrDetails.user}`}</span>
                </Grid.Column>
                <Grid.Column >
              <Header sub>Premise</Header>
                <span>{ `${ premises?Object.keys(premises).length:0}/${subcrData.subcrDetails.premise}`}</span>
                </Grid.Column>
                
                <Grid.Column >
                  <Header sub>Scheme</Header>
                  <span>{`${ schmlist?Object.keys(schmlist).length:0}/${subcrData.subcrDetails.schm}`}</span>
                </Grid.Column>
              </Grid>
             
            </Segment>:
      <Dimmer active>
        <Loader>Loading</Loader>
      </Dimmer>}
        
         
        </div>
        
      </Transition>
    )}


export default Home