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
  Form,Dropdown
} from 'semantic-ui-react';

import * as moment from 'moment';

import { useParams, Link, useRouteMatch } from "react-router-dom";

import {deleteUser, postPremise, SubscriptionContext,getSubcrData } from './subscription';

const renderHTML = (rawHTML) => React.createElement("div", { dangerouslySetInnerHTML: { __html: rawHTML } });

const TabPremises = ({data,onDataChange,onDelete,id}) => {
//   const {subcr,cmpny} = useContext(SubscriptionContext);
  const [modalOpen, setModalOpen] = React.useState(false);

  const [objid, setID] = React.useState(0);
  const [name, setName] = React.useState("");
  const [address, setAddress] = React.useState("");
  
  const resetForm=()=>{
    setName("");
    setAddress("");
    setID(0);

  }

  const editForm=(id)=>{
    setName(data[id].name);
    setID(id);
    setAddress(data[id].address);
    setModalOpen(true);
  }

  
  const submitForm=()=>{
    
    const postdata={id:objid,data:{name,address},cmpnyid:id,action:"modify"};
    
    postPremise(postdata).then(onDataChange).catch(e=>console.log(e))
    resetForm();
  }

  const deleteForm=(pk)=>{
    const postdata={id:pk,cmpnyid:id,action:"delete"};
    postPremise(postdata).then(onDataChange).catch(e=>console.log(e))
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
    {data[pg].address}
  </List.Content>
</List.Item>)
      
  return <React.Fragment>
      <Button onClick={()=>setModalOpen(true)} fluid  basic color='green' > <Icon name='plus' />Add</Button>
      <Divider/>
      <div className="subcrTabPane">
        
  <List  ordered divided>{listItems}</List>
  <Modal style={{position:'relative',height:'auto'}}
              onClose={() =>{ setModalOpen(false),resetForm()}}
              // onOpen={() => setOpen(true)}
              open={modalOpen}
          >
            <Header icon='archive' content='Premise Management' />
            <Modal.Content>
            <Form>
            {/* <Form.Group widths='equal'> */}
            <Form.Input
              fluid
              label='Name'
              onChange={e=>setName(e.target.value)}
              value={name}
            />
            <Form.TextArea
              fluid
              label='Address'
              onChange={e=>setAddress(e.target.value)}
              value={address}
            />
         
            </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button color='red' onClick={() => {setModalOpen(false); resetForm();}}>
                <Icon name='remove' /> No
              </Button>
              <Button color='green' onClick={() => {setModalOpen(false); submitForm();}}>
                <Icon name='checkmark' /> Submit
              </Button>
            </Modal.Actions>
          </Modal>
  </div>
  </React.Fragment>
}

export default TabPremises