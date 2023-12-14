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
  Modal,Divider,
  Form,Dropdown,Message
} from 'semantic-ui-react';

import * as moment from 'moment';

import { useParams, Link, useRouteMatch } from "react-router-dom";

import {deleteUser, postSubcr, SubscriptionContext,getSubcrData } from './subscription';

const renderHTML = (rawHTML) => React.createElement("div", { dangerouslySetInnerHTML: { __html: rawHTML } });

const TabSubscription = ({data,onDataChange,onDelete,id,ddl}) => {
//   const {subcr,cmpny} = useContext(SubscriptionContext);
  const [modalOpen, setModalOpen] = React.useState(false);

  const [objid, setID] = React.useState(0);
  const [name, setName] = React.useState("");
  const [cklists, selectcklists] = React.useState([]);
  const [premises, selectpremise] = React.useState([]);
  const [users, selectuser] = React.useState([]);

  const {premisesddl,cklistddl,userddl}=ddl;
  
  const resetForm=()=>{
    setName("");
    selectcklists([]);
    selectuser([]);
    selectpremise([]);
    setID(0);

  }

  const editForm=(id)=>{
    setName(data[id].name);
    setID(id);
    selectcklists(data[id].cklists);
    selectpremise(data[id].premises);
    selectuser(data[id].users);
    setModalOpen(true);
  }

  
  const submitForm=()=>{
    
    const postdata={id:objid,data:{name,cklists,premises,users},cmpnyid:id,action:"modify"};
    
    postSubcr(postdata).then(onDataChange).catch(e=>console.log(e))
    resetForm();
  }

  const deleteForm=(pk)=>{
    const postdata={id:pk,cmpnyid:id,action:"delete"};
    postSubcr(postdata).then(onDataChange).catch(e=>console.log(e))
    resetForm();
  }
 
  const listItems =  Object.keys(data).map((pg) => 
  <List.Item  key={pg}>
  <List.Content className="avatar image">
    <Dropdown  icon="ellipsis vertical"  className='icon' 
    pointing='top left'>
    <Dropdown.Menu className='right'>
      <Dropdown.Item  onClick={()=>editForm(pg)} color='blue' icon='edit outline' text='Edit' />
      <Dropdown.Item  onClick={()=>deleteForm(pg)} icon='trash' text='Remove' />
    </Dropdown.Menu>
  </Dropdown>
  </List.Content>
  <List.Content>
    <List.Header> {data[pg].name}</List.Header>
    {/* {data[pg].address} */}
  </List.Content>
</List.Item>)
      
  return <React.Fragment>
      <Button onClick={()=>setModalOpen(true)} fluid  basic color='green' disabled={cklistddl.lenght>0 && premisesddl.lenght>0 && userddl.lenght>0}> <Icon name='plus' />Add</Button>
      <Divider/>
     {cklistddl.length>0 && premisesddl.length>0 && userddl.length>0? <div className="subcrTabPane">
        
        <List  ordered divided>{listItems}</List>
        <Modal style={{position:'relative',height:'auto'}}
                    onClose={() =>{ setModalOpen(false),resetForm()}}
                    // onOpen={() => setOpen(true)}
                    open={modalOpen}
                >
                  <Header icon='archive' content='Subscription Group' />
                  <Modal.Content>
                  <Form  id="subcrform" onSubmit={(e)=>{setModalOpen(false); submitForm();e.preventDefault()}}>
                  {/* <Form.Group widths='equal'> */}
                  <Form.Input
                    fluid
                    label='Group Name'
                    onChange={e=>setName(e.target.value)}
                    value={name}
                  />
                  <Form.Dropdown
                    placeholder='Checklist'
                    fluid
                    multiple
                    search
                    selection
                    value={cklists}
                    onChange={(e,data)=>selectcklists(data.value)}
                    options={cklistddl}
                  />
                  <Form.Dropdown
                    placeholder='Premise'
                    fluid
                    multiple
                    search
                    selection
                    value={premises}
                    onChange={(e,data)=>selectpremise(data.value)}
                    options={premisesddl}
                  />
                  <Form.Dropdown
                    placeholder='User'
                    fluid
                    multiple
                    search
                    selection
                    value={users}
                    onChange={(e,data)=>selectuser(data.value)}
                    options={userddl}
                  />
              
                  </Form>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button color='red' onClick={() => {setModalOpen(false); resetForm();}}>
                      <Icon name='remove' /> No
                    </Button>
                    <Button color='green' type="submit" form="subcrform" >
                      <Icon name='checkmark' /> Submit
                    </Button>
                  </Modal.Actions>
                </Modal>
        </div>:
        <Message negative>
        <Message.Header>Not enough data to create new subscription</Message.Header>
        <p>Please fill atleast 1 item per each tab.</p>
      </Message>
        }
  </React.Fragment>
}

export default TabSubscription