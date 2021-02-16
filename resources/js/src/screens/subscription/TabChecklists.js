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

import {deleteUser, postCopyCklist, SubscriptionContext,getSubcrData } from './subscription';

const renderHTML = (rawHTML) => React.createElement("div", { dangerouslySetInnerHTML: { __html: rawHTML } });

const TabChecklists = ({data,stock,onDataChange,onDelete,id}) => {
//   const {subcr,cmpny} = useContext(SubscriptionContext);
  const [modalOpen, setModalOpen] = React.useState(false);

  const [objid, setID] = React.useState(0);
  const [cklists, selectcklists] = React.useState([]);
  
  const resetForm=()=>{
    selectcklists([]);

  }


  
  const submitForm=()=>{
     const postdata={cklists,cmpnyid:id,action:"modify"};
     console.log(postdata);
      postCopyCklist(postdata).then(onDataChange).catch(e=>console.log(e))
    resetForm();
  }

  const deleteForm=(pk)=>{
    const postdata={id:pk,cmpnyid:id,action:"delete"};
    postCopyCklist(postdata).then(onDataChange).catch(e=>console.log(e))
    resetForm();
  }
 
  const listItems =  Object.keys(data).map((pg) => 
  <List.Item  key={pg}>
  <List.Content className="avatar image">
    <Dropdown  icon="ellipsis vertical"  className='icon' 
    pointing='top left'>
    <Dropdown.Menu className='right'>
      {/* <Dropdown.Item  onClick={()=>editForm(pg)} color='blue' icon='edit outline' text='Edit' /> */}
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
            <Form.Dropdown
               placeholder='Stock Checklist'
               fluid
               multiple
               search
               selection
               value={cklists}
               onChange={(e,data)=>selectcklists(data.value)}
               options={stock}
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

export default TabChecklists