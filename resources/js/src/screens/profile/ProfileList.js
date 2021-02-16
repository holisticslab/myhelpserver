import React,{useContext } from 'react'
import {
  Input, Menu, Segment,Form,
  Checkbox,
  Grid,
  Header,
  Icon,
  Image,
  Sidebar,
  Transition,Divider,
  List,
  Button,Modal,Dropdown,Table,Pagination

} from 'semantic-ui-react';

import {Switch,Route,Link,useRouteMatch} from "react-router-dom";

import { deleteProfile,ProfileContext,createProfile ,postUser} from './profile';

const ProfileList = () => {

  const {usr,cmpny,roles} = useContext(ProfileContext);
  let { path, url } = useRouteMatch();
  const [open, setOpen] = React.useState(false)
  const [userlist, setuserlist] = React.useState(usr);
  const [userFilter, setuserFilter] = React.useState(usr);
  
  
  
  const [modalOpen, setModalOpen] = React.useState(false);
  const [userid, setuserid] = React.useState(0);
  const [name, setname] = React.useState("");
  const [username, setusername] = React.useState("");
  const [role, setrole] = React.useState(0);
  const [password, setpassword] = React.useState("");
  const [password2, setpassword2] = React.useState("");
  const [company, setcompany] = React.useState(null);

  const [activePage, setActivePage] = React.useState(1);
  const [itemperpage, setitemperpage] = React.useState(10);


  
  React.useEffect(() => {

    const bootstrapAsync = async () => {
      setuserlist(usr);
      setuserFilter(usr)
    };

    bootstrapAsync();

  }, [usr]);

  const RenderProfile = props => {
    const data = props.data;
    let pageItem=[];
    let i,j,temparray;
    for (i=0,j=data.length; i<j; i+=itemperpage) {
      temparray = data.slice(i,i+itemperpage);
      pageItem.push(temparray);
        // do whatever
    }
    const tableItem = pageItem[activePage-1].map((x, i) =>
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
  <Table.Cell>{x.cmpnyName}</Table.Cell>
  <Table.Cell>{x.rolename}</Table.Cell>
  <Table.Cell>{x.lastLogin}</Table.Cell>
  
  <Table.Cell>
    </Table.Cell>
  </Table.Row>
);

  return  <Table>
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell>No</Table.HeaderCell>
      <Table.HeaderCell></Table.HeaderCell>
      <Table.HeaderCell>Name</Table.HeaderCell>
      <Table.HeaderCell>Login ID</Table.HeaderCell>
      <Table.HeaderCell>Company</Table.HeaderCell>
      <Table.HeaderCell>System Role</Table.HeaderCell>
      <Table.HeaderCell>Last Login</Table.HeaderCell>
    </Table.Row>
  </Table.Header>

  <Table.Body>
    {tableItem}
  </Table.Body>
  <Table.Footer>
      <Table.Row>
        <Table.HeaderCell textAlign="center" colSpan='7'>
          <Pagination siblingRange={2} activePage={activePage}   totalPages={pageItem.length} onPageChange={(e,d)=>setActivePage(d.activePage)}/>
        </Table.HeaderCell>
      </Table.Row>
    </Table.Footer>
</Table>
  }

  
  const resetForm=()=>{
    setname("");
    setusername("");
    setpassword("");
    setpassword2("");
    setuserid(0);

  }

  const editForm=({name,username,id,cmpnyID,roleFK})=>{
    setname(name);
    setuserid(id);
    setrole(roleFK);
    setusername(username);
    setpassword("default");
    setpassword2("default");
    setcompany(cmpnyID)
    setModalOpen(true);
  }


  const submitForm=()=>{
    
    
    const data={id:userid,name,username,cmpnyid:company,password,role};
    postUser(data).then(x=>{
      if(userlist){
        // ]
       
       delete x.password;
       let currentuser = JSON.parse(JSON.stringify(userlist));

       let cmpnyindex=cmpny.findIndex(obj => {return obj.key === x.cmpnyFK});
       let roleindex=roles.findIndex(obj => {return obj.key === x.roleFK});
       x.cmpnyName=cmpny[cmpnyindex].text;
       x.rolename=roles[roleindex].text;
         let index=currentuser.findIndex(obj => {return obj.id === x.id});
         if(index<0){
           currentuser.push(x);
         }
         else{currentuser[index]=x;
         }
         setuserlist(currentuser);
         setuserFilter(currentuser);
 
       }
       else{
        setuserlist([x]);
        setuserFilter([x]);
       }
       
    }).catch(e=>console.log(e))
    resetForm();
    
  }

  return (

    <Transition transitionOnMount={true} animation="fade" duration={1000}>
      <div className="in innerContainer">
        <Header as='h6' fluid floated='right'>
           <Input
                icon={{ name: 'search', link: true }}
                onChange={e=>{
                  let filter=e.target.value.toLowerCase()
                  const filterData = userlist.filter(({ name, username,cmpnyName,rolename }) =>
                  name.toLowerCase().indexOf(filter) > -1 || username.toLowerCase().indexOf(filter) > -1
                  || cmpnyName.toLowerCase().indexOf(filter) > -1|| rolename.toLowerCase().indexOf(filter) > -1);
                  setuserFilter(filterData)
                }}
                placeholder='Search users...'
              />
    </Header>
    <Header as='h3' floated='left'>Profile List</Header>
       
        <Button onClick={()=>setModalOpen(true)} fluid  basic color='green' > <Icon name='plus' />Add</Button>
      <Divider/>
      <div style={{height:'70vh', overflowY:'auto'}}>
      {(userFilter && userFilter.length)&&<RenderProfile data={userFilter}/>}
  <Modal style={{position:'relative',height:'auto'}}
              onClose={() =>{ setModalOpen(false),resetForm()}}
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
          <Form.Dropdown
                    placeholder='Company'
                    fluid
                    search
                    selection
                    value={company}
                    onChange={(e,data)=>setcompany(data.value)}
                    options={cmpny}
                  />
                   <Form.Dropdown
                    placeholder='Role'
                    fluid
                    search
                    selection
                    value={role}
                    onChange={(e,data)=>setrole(data.value)}
                    options={roles}
                  />
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
        </div>
    </Transition>
  )
}

export default ProfileList