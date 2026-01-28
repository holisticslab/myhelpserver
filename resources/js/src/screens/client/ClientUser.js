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
  Modal,Divider,Message,
  Form,Dropdown,Label, Dimmer, Loader,Progress
} from 'semantic-ui-react';

import * as moment from 'moment';

import { useParams, Link, useRouteMatch } from "react-router-dom";

import {ClientContext} from './client';
import {deleteUser, postUser} from '../subscription/subscription';

import {getRoles } from '../../components/function';
import  {passwordStrength}  from 'check-password-strength';
const strengthLabel=[{color:'red',percent:25, label:'Very Weak'},{color:'orange',percent:50,label:'weak'},{color:'yellow',percent:75,label:'Acceptable'},{color:'green',percent:100,label:'Strong'}]

const renderHTML = (rawHTML) => React.createElement("div", { dangerouslySetInnerHTML: { __html: rawHTML } });

const ClientUser = ({data,onDataChange,id,accesslvl}) => {

  // const strengthCheck=  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,16}$/;
  const {users} = useContext(ClientContext);
//   const {subcr,cmpny} = useContext(SubscriptionContext);
  const [modalOpen, setModalOpen] = React.useState(false);

  const [userid, setuserid] = React.useState(0);
  const [name, setname] = React.useState("");
  const [username, setusername] = React.useState("");
  const [password, setpassword] = React.useState("");
  const [password2, setpassword2] = React.useState("");
  const [pwdLevel, setPwdLevel] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [roles, setRoles] = React.useState([]);
  const [userrole, setuserrole] = React.useState("");
  const [userFilter, setuserFilter] = React.useState(users);
  
  
  React.useEffect(() => {

    const bootstrapAsync = async () => {
      setuserFilter(users);
      getRoles().then(x => {

        const ddl =  x.map((x,i) =>
        ({
          key: x.rolePK,
          text: x.rolename,
          value: x.rolePK,
        }))
        setRoles(ddl);
      });
    };

    bootstrapAsync();

  }, [users]);
 
  
  let { path, url } = useRouteMatch();

  
  const checkPassword = (data)=>{
    let option=[
      {
        id: 0,
        value: "Too weak",
        minDiversity: 0,
        minLength: 0,
        percent:25
      },
      {
        id: 1,
        value: "Weak",
        minDiversity: 2,
        minLength: 6,
        percent:50
      },
      {
        id: 2,
        value: "Medium",
        minDiversity: 3,
        minLength: 6,
        percent:75
      },
      {
        id: 3,
        value: "Strong",
        minDiversity: 4,
        minLength: 8,
        percent:100
      }
    ]
    setPwdLevel(passwordStrength(data,option).id);
  }

  const resetForm=()=>{
    setname("");
    setusername("");
    setpassword("");
    setpassword2("");
    setuserid(0);

  }


  const editForm=({name,username,id,roleFK})=>{
    console.log(roleFK)
    setname(name);
    setuserid(id);
    setuserrole(roleFK);
    setusername(username);
    setpassword("default");
    setpassword2("default");
    setModalOpen(true);
  }

  
  const submitForm=()=>{
    const data={id:userid,name,username,cmpnyid:id,password,role:userrole};

    if(password!=password2 ){
      setErrorMsg("Password not match");
    }
    else if(pwdLevel !==null && pwdLevel<2){
      setErrorMsg("Password must be alphanumeric and contain atleast 1 symbol");
    }
    else{
    postUser(data).then(x=>{
      onDataChange(x,"edit");
    }).catch(e=>console.log(e))
    resetForm();
    setModalOpen(false);}

  }

  const deleteUserForm=(pk)=>{
    deleteUser(pk).then(x=>{ 

      onDataChange({id:pk},"delete");
    }).catch(e=>console.log(e))
    resetForm();
  }
 
  const tableItem = userFilter.map((x, i) =>
  <Table.Row key={i}>
  <Table.Cell>{i+1}</Table.Cell>
  <Table.Cell>
  <Dropdown icon="ellipsis vertical"  className='icon' 
  pointing='top left'>
  <Dropdown.Menu className='right'>
    <Dropdown.Item  onClick={()=>editForm(x)} color='blue' icon='edit outline' text='Edit user' />
    {accesslvl<3 && <Dropdown.Item  onClick={()=>deleteUserForm(x.id)} icon='trash' text='Remove user' />}
  </Dropdown.Menu>
</Dropdown>
  </Table.Cell>
  <Table.Cell>
    {/* <Link to={`${url}/details/${i}`}> */}
    {x.name}
    {/* </Link> */}
    </Table.Cell>
  <Table.Cell>{x.username}</Table.Cell>
  <Table.Cell>{x.rolename}</Table.Cell>
  <Table.Cell>{x.lastLogin}</Table.Cell>
  
  <Table.Cell>
    </Table.Cell>
  </Table.Row>
);
      
  return <React.Fragment>
    <Button fluid as='div' labelPosition='right'>
    <Button fluid onClick={()=>setModalOpen(true)} basic color='green' > <Icon name='plus' />Add</Button>
      <Label basic >
      <Input 
                icon={{ name: 'search', link: true }}
                onChange={e=>{
                  let filter=e.target.value.toLowerCase()
                  const filterData = users.filter(({ name, username,rolename }) =>
                  name.toLowerCase().indexOf(filter) > -1 || username.toLowerCase().indexOf(filter) > -1
                  || rolename.toLowerCase().indexOf(filter) > -1);
                  setuserFilter(filterData)
                }}
                placeholder='Search users...'
              />
      </Label>
    </Button>
    
      
      <Divider/>
      <div className="clientUserTable">
     {userFilter?
  
      <Table>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>No</Table.HeaderCell>
        <Table.HeaderCell></Table.HeaderCell>
        <Table.HeaderCell>Name</Table.HeaderCell>
        <Table.HeaderCell>Login ID</Table.HeaderCell>
        <Table.HeaderCell>Roles</Table.HeaderCell>
        <Table.HeaderCell>Last Login</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      {tableItem}
    </Table.Body>
  </Table>
  :
  <Dimmer active>
    <Loader>Loading</Loader>
  </Dimmer>}

  <Modal style={{position:'relative',height:'auto'}}
              onClose={() =>{ setModalOpen(false),resetForm(),setPwdLevel(null)}}
              // onOpen={() => setOpen(true)}
              open={modalOpen}
          >
            <Header icon='archive' content='User Management' />
            <Modal.Content>
            <Form id="userEdit" onSubmit={()=>submitForm()}>
            <Form.Group widths='equal'>
            <Form.Input
              required
              fluid
              label='Name'
              onChange={e=>setname(e.target.value)}
              value={name}
            />
            <Form.Input
              required
              fluid
              label='Login ID'
              onChange={e=>setusername(e.target.value)}
              value={username}
            />
          </Form.Group>
              <Form.Group widths='equal'>
                
            <Form.Input
              required
              onFocus={event=> event.target.select()}
              fluid
              label='Password'
              type="password"
              onChange={e=>{
                setErrorMsg("");
                setpassword(e.target.value)
                checkPassword(e.target.value)
                if(password2=="default"){
                  setpassword2("");
                }
              }}
              value={password}
            />

            <Form.Input
              error={password2=="default" || password2=="" ||password==password2?null:"Password not match"}
              required
              onFocus={event=> event.target.select()}
              fluid
              label='Reconfirm Password'
              type="password"
              onChange={e=>{
                setErrorMsg("");
                setpassword2(e.target.value)
              }}
              value={password2}
            />
          </Form.Group>
          {
            pwdLevel!==null && 
          <Grid columns={2}>
            <Grid.Column>
              <Progress {...strengthLabel[pwdLevel]} />
            </Grid.Column>
            <Grid.Column>
              
            </Grid.Column>
          </Grid>
          }
          <Form.Dropdown
                    placeholder='Role'
                    fluid
                    search
                    selection
                    value={userrole}
                    onChange={(e,data)=>setuserrole(data.value)}
                    options={roles}
                  />
            </Form>
            {errorMsg &&
              <Message error
                header='Attention'
                content={errorMsg}
              />}
            </Modal.Content>
            <Modal.Actions>
              <Button color='red' onClick={() => {setModalOpen(false); resetForm();}}>
                <Icon name='remove' /> No
              </Button>
              <Button color='green' type="submit" form="userEdit" >
                <Icon name='checkmark' /> Submit
              </Button>
            </Modal.Actions>
          </Modal>

         
  </div>
  </React.Fragment>
}

export default ClientUser