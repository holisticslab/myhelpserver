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
  Modal,Divider,Accordion,
  Form,Dropdown,Message, Dimmer, Loader,
} from 'semantic-ui-react';

import { EditableLabel, HeaderAction, PromptModal } from '../../components/simplifyUi';
import * as moment from 'moment';

import { useParams, Link, useRouteMatch } from "react-router-dom";

import {deleteUser, postSubcr, SubscriptionContext,getSubcrData } from '../subscription/subscription';

const renderHTML = (rawHTML) => React.createElement("div", { dangerouslySetInnerHTML: { __html: rawHTML } });

import { ClientContext } from './client';
const ClientSubscription = ({data,id,accesslvl}) => {
//   const {subcr,cmpny} = useContext(SubscriptionContext);

const { users,premises,schmlist,reloadSubcr } = React.useContext(ClientContext);

  const [modalOpen, setModalOpen] = React.useState(false);

  const [objid, setID] = React.useState(0);
  const [name, setName] = React.useState("");
  const [cklists, selectcklists] = React.useState([]);
  const [premisedata, selectpremise] = React.useState([]);
  const [userdata, selectuser] = React.useState([]);
  const [cklistDDL, setcklistDDL] = React.useState([]);
  const [prmiseDDL, setpremiseDDL] = React.useState([]);
  const [userDDL, setUserDDL] = React.useState([]);
  const [activeIndex, setActiveIndex] = React.useState(-1);


  React.useEffect(() => {
    // if (typeof(Storage) !== "undefined") {
    //   // Code for localStorage/sessionStorage.
    const bootstrapAsync = async () => {

      if(schmlist)
      {
        let ddl= [{ key: "*",
        text: "All",
        value: "*"},...Object.keys(schmlist).map((x,i)=>{
            return{ key: i,
            text: schmlist[x].name+" v"+schmlist[x].version,
            value: x}
          })]
          setcklistDDL(ddl);
      }
      if(premises)
      {
        let ddl=  [{ key: "*",
        text: "All",
        value: "*"},...Object.keys(premises).map((x,i)=>{
                return{ key: i,
                text: premises[x].name,
                value: x}
              })]
          setpremiseDDL(ddl);
      }
      if(users)
      {
        let ddl=  [{ key: "*",
        text: "All",
        value: "*"},...users.map((x,i)=>{
                return{ key: i,
                      text: x.name,
                      value: x.id}})]
          setUserDDL(ddl);
      }
      // console.log(JSON.stringify(data));
   }

   bootstrapAsync();
  }, [])
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
    
    const postdata={id:objid,data:{name,cklists,premises:premisedata,users:userdata},cmpnyid:id,action:"modify"};
    // console.log(postdata);
    postSubcr(postdata).then(x=>{
reloadSubcr(x);
    }).catch(e=>console.log(e))
    resetForm();
  }

  const deleteForm=(pk)=>{
    const postdata={id:pk,cmpnyid:id,action:"delete"};
    postSubcr(postdata).then(x=>{
reloadSubcr(x);
    }).catch(e=>console.log(e))
    resetForm();
  }
 
  const RenderGroup = ({ data }) => {
    const listItems=Object.keys(data).map((k,i) => 

      <React.Fragment key={k}>

        <Accordion.Title>
          <HeaderAction
            buttonLeft={
              <Icon onClick={() => setActiveIndex(activeIndex === i ? -1 : i)} size="small"
                name={activeIndex === i ? 'arrow alternate circle down outline' : 'arrow alternate circle right outline'}
                color="teal" link />}
            buttonRight={
              <React.Fragment>
                  <Icon onClick={() => editForm(k)} size="small"
                name="edit"
                color="yellow" link />
                {accesslvl<3 && <Icon onClick={() => deleteForm(k)} size="small"
                name="trash"
                color="red" link />}
              </React.Fragment>
            }
          ><p onClick={() => setActiveIndex(activeIndex === i ? -1 : i)}>{data[k].name}</p></HeaderAction>
        </Accordion.Title>
        <Accordion.Content key={"cn" + i} active={activeIndex === i}>
        <Segment.Group horizontal>
          <Segment>
          <Header as='h3'>
          <Icon name='users' />
          <Header.Content>
            Total Users
          <Header.Subheader>{data[k].users.length}</Header.Subheader>
          </Header.Content>
        </Header>
          </Segment>
          <Segment>
          <Header as='h4'>
          <Icon name='clipboard list' />
          <Header.Content>
            Total Checklist
            <Header.Subheader>{data[k].cklists.length}</Header.Subheader>
          </Header.Content>
        </Header>
          </Segment>
          <Segment>
          <Header as='h4'>
          <Icon name='building' />
          <Header.Content>
            Total Premise
            <Header.Subheader>{data[k].premises.length}</Header.Subheader>
          </Header.Content>
        </Header>
          </Segment>
        </Segment.Group>
       
        
        
          {/* {x.items.length >0 && <RenderItem data={x.items} index={i}/>} */}
        </Accordion.Content>
      </React.Fragment>
    );
    return <Accordion fluid styled>{listItems}</Accordion>
    // <Card.Group as={Accordion} fluid styled >{listItems}</Card.Group>
  }

  const ListItems = ({data})=> Object.keys(data).map((pg) => 
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
      <Button onClick={()=>setModalOpen(true)} fluid  basic color='green' > <Icon name='plus' />Add</Button>
      <Divider/>
      <div className="clientTable">
        {data ?
        <RenderGroup data={data} />
        :
      <Dimmer active>
        <Loader>Loading</Loader>
      </Dimmer>
        // <List  ordered divided><ListItems data={data}/></List>
        }
        </div>

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
                    onChange={(e,data)=>{
                      let exist=data.value.findIndex((x)=>x==="*")>=0
                      if(exist){
                        let result = schmlist && Object.keys(schmlist).map((x,i)=>{
                          if(x!=="*")return x
                        })
                        selectcklists(result)
                      }
                      else selectcklists(data.value)
                    }}
                    options={cklistDDL}
                  />
                  <Form.Dropdown
                    placeholder='Premise'
                    fluid
                    multiple
                    search
                    selection
                    value={premisedata}
                    onChange={(e,data)=>{
                      let exist=data.value.findIndex((x)=>x==="*")>=0
                      if(exist){
                        let result = premises && Object.keys(premises).map((x,i)=>{
                          if(x!=="*")return x
                        })
                        selectpremise(result)
                      }
                      else selectpremise(data.value)
                    }}
                   
                    options={prmiseDDL}
                  />
                  <Form.Dropdown
                    placeholder='User'
                    fluid
                    multiple
                    search
                    selection
                    value={userdata}
                    onChange={(e,data)=>{
                      console.log(data.value)
                      let exist=data.value.findIndex((x)=>x==="*")>=0
                      if(exist){
                        let result = users && users.map((x,i)=>{
                          if(x.id!=="*")return x.id
                        })
                        selectuser(result)
                      }
                      else selectuser(data.value)
                    }}
                    
                    options={userDDL}
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
  </React.Fragment>
}

export default ClientSubscription