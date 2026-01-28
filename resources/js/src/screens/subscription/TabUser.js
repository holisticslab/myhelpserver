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

import {deleteUser, postUser,} from './subscription';

const renderHTML = (rawHTML) => React.createElement("div", { dangerouslySetInnerHTML: { __html: rawHTML } });

const TabUser = ({data,onDataChange,onDelete,id}) => {
//   const {subcr,cmpny} = useContext(SubscriptionContext);
  const [modalOpen, setModalOpen] = React.useState(false);

  const [userid, setuserid] = React.useState(0);
  const [name, setname] = React.useState("");
  const [username, setusername] = React.useState("");
  const [password, setpassword] = React.useState("");
  const [password2, setpassword2] = React.useState("");
  
  
  
  let { path, url } = useRouteMatch();

  
  const resetForm=()=>{
    setname("");
    setusername("");
    setpassword("");
    setpassword2("");
    setuserid(0);

  }

  const editForm=({name,username,id})=>{
    setname(name);
    setuserid(id);
    setusername(username);
    setpassword("default");
    setpassword2("default");
    setModalOpen(true);
  }

  
  const submitForm=()=>{
    
    const data={id:userid,name,username,cmpnyid:id,password};
    // if(userid){
    //   data.id=userid;
    // }
    postUser(data).then(x=>{
      onDataChange(x,"edit");
    }).catch(e=>console.log(e))
    resetForm();
  }

  const deleteUserForm=(pk)=>{
    deleteUser(pk).then(x=>{ 

      onDataChange({id:pk},"delete");
    }).catch(e=>console.log(e))
    resetForm();
  }
 
  const tableItem = data.map((x, i) =>
  <Table.Row key={i}>
  <Table.Cell>{i+1}</Table.Cell>
  <Table.Cell>
  <Dropdown icon="ellipsis vertical"  className='icon' 
  pointing='top left'>
  <Dropdown.Menu className='right'>
    <Dropdown.Item  onClick={()=>editForm(x)} color='blue' icon='edit outline' text='Edit user' />
    <Dropdown.Item  onClick={()=>deleteUserForm(x.id)} icon='trash' text='Remove user' />
  </Dropdown.Menu>
</Dropdown>
  </Table.Cell>
  <Table.Cell><Link to={`${url}/details/${i}`}>{x.name}</Link></Table.Cell>
  <Table.Cell>{x.username}</Table.Cell>
  <Table.Cell>{x.lastLogin}</Table.Cell>
  
  <Table.Cell>
    </Table.Cell>
  </Table.Row>
);
      
  return <React.Fragment>
      <Button onClick={()=>setModalOpen(true)} fluid  basic color='green' > <Icon name='plus' />Add</Button>
      <Divider/>
      <div className="subcrTabPane">
        
  
      <Table>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>No</Table.HeaderCell>
        <Table.HeaderCell></Table.HeaderCell>
        <Table.HeaderCell>Name</Table.HeaderCell>
        <Table.HeaderCell>Login ID</Table.HeaderCell>
        <Table.HeaderCell>Last Login</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      {tableItem}
    </Table.Body>
  </Table>

  <Modal style={{position:'relative',height:'auto'}}
              onClose={() =>{ setModalOpen(false),resetModal()}}
              // onOpen={() => setOpen(true)}
              open={modalOpen}
          >
            <Header icon='archive' content='User Management' />
            <Modal.Content>
            <Form>
            <Form.Group widths='equal'>
            <Form.Input
              fluid
              label='Name'
              onChange={e=>setname(e.target.value)}
              value={name}
            />
            <Form.Input
              fluid
              label='Login ID'
              onChange={e=>setusername(e.target.value)}
              value={username}
            />
          </Form.Group>
              <Form.Group widths='equal'>
            <Form.Input
              fluid
              label='Password'
              type="password"
              onChange={e=>setpassword(e.target.value)}
              value={password}
            />
            <Form.Input
              fluid
              label='Reconfirm Password'
              type="password"
              onChange={e=>setpassword2(e.target.value)}
              value={password2}
            />
          </Form.Group>
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

export default TabUser