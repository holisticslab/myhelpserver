import React,{useContext } from 'react'
import {
  Input, Menu, Segment,Form,
  Checkbox,
  Grid,
  Header,
  Icon,
  Image,
  Sidebar,
  Transition,
  List,
  Button,Modal,Dropdown,Table
} from 'semantic-ui-react';

import {Switch,Route,Link,useRouteMatch} from "react-router-dom";

import { deleteSubscription,SubscriptionContext,createSubscription } from './subscription';

const SubscriptionList = () => {

  const {subcr,cmpny} = useContext(SubscriptionContext);
  let { path, url } = useRouteMatch();
  const [open, setOpen] = React.useState(false)
  const [subcrList, setsubcrList] = React.useState(subcr);
  
  
  const [subcrPK, setsubcrPK] = React.useState(0)
  const [datestart, setdtstart] = React.useState(null)
  const [dateend, setdtend] = React.useState(null)
  const [user, setuser] = React.useState(0)
  const [premise, setpremise] = React.useState(0)
  const [schm, setschm] = React.useState(0)
  const [company, setcompany] = React.useState(null)


  
  React.useEffect(() => {

    const bootstrapAsync = async () => {
      setsubcrList(subcr);
    };

    bootstrapAsync();

  }, [subcr]);

  const RenderSubscription = props => {
    const data = props.data;
    const tableItem = data.map((x, i) =>
    <Table.Row key={i}>
    <Table.Cell>{i+1}</Table.Cell>
    <Table.Cell><Link to={`${url}/details/${i}`}>{cmpny && cmpny.find(obj => {return obj.value === x.cmpnyFK}).text}</Link></Table.Cell>
    <Table.Cell>{x.dateStart}</Table.Cell>
    <Table.Cell>{x.dateEnd}</Table.Cell>
    <Table.Cell>{x.subcrDetails.user}</Table.Cell>
    <Table.Cell>{x.subcrDetails.premise}</Table.Cell>
    <Table.Cell>{x.subcrDetails.schm}</Table.Cell>
    <Table.Cell>
      <Button onClick={()=>editForm(x)} circular color='blue' icon='edit outline' />
      <Button onClick={()=>deleteForm(x.subcrPK)} circular color='red' icon='trash alternate' />
    </Table.Cell>
    <Table.Cell>
      </Table.Cell>
    </Table.Row>
  );
  return <Table>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>No</Table.HeaderCell>
        <Table.HeaderCell>Company</Table.HeaderCell>
        <Table.HeaderCell>Date Start</Table.HeaderCell>
        <Table.HeaderCell>Date End</Table.HeaderCell>
        <Table.HeaderCell>No. User</Table.HeaderCell>
        <Table.HeaderCell>No. Premise</Table.HeaderCell>
        <Table.HeaderCell>No. Scheme</Table.HeaderCell>
        <Table.HeaderCell></Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      {tableItem}
    </Table.Body>
  </Table>
  }

  const editForm=({subcrPK,dateStart,dateEnd,cmpnyFK,subcrDetails})=>{
    const {user,premise,schm}=subcrDetails;
    setdtstart(dateStart);
    setdtend(dateEnd);
    setuser(user);
    setpremise(premise);
    setschm(schm);
    setcompany(cmpnyFK);
    setOpen(true);
    setsubcrPK(subcrPK);
  }

  const resetForm=()=>{
    setdtstart("");
    setdtend("");
    setuser(0);
    setpremise(0);
    setschm(0);
    setcompany("");
    setsubcrPK(0);
  }

  const submitForm=()=>{
    const data={subcrPK,datestart,dateend,company,details:{user,premise,schm}};
    createSubscription(data).then(x=>{
      
      if(subcrList){
       // 
        let list = subcrList.slice(0);
        let index=subcrList.findIndex(obj => {return obj.subcrPK === x.subcrPK});
        if(index<0){
          list.unshift(x);
        }
        else{
          list[index]=x;
        }
        setsubcrList(list);
      }
      else{
        setsubcrList([x]);
      }
      
    }).catch(e=>console.log(e))
    resetForm();
  }

  
  const deleteForm=(pk)=>{
    deleteSubscription(pk).then(x=>{
      console.log(x);
      if(subcrList){
       // 
        let list = subcrList.slice(0);
        let index=subcrList.findIndex(obj => {return obj.subcrPK === pk});
        if(index<0){
         // list.unshift(x);
        }
        else{
          list.splice(index, 1)
        }
        setsubcrList(list);
      }
      else{
      //  setsubcrList([x]);
      }
      
    }).catch(e=>console.log(e))
    resetForm();
  }

  return (

    <Transition transitionOnMount={true} animation="fade" duration={1000}>
      <div className="in innerContainer">
        <Header as='h3'>Subscription List
        </Header>
        <Modal style={{position:'relative',height:'auto'}}
        onClose={() =>{ setOpen(false),resetForm()}}
        onOpen={() => setOpen(true)}
        open={open}
      trigger={<Button>Create Subscription</Button>}
    >
      <Header icon='archive' content='Create New Subscription' />
      <Modal.Content>
      <Form id="subcrform" onSubmit={(e)=>{setOpen(false); submitForm();e.preventDefault()}}>
      <Form.Group widths='equal'>
      <Form.Input
        fluid
        label='Date Start'
        type="date"
        onChange={e=>setdtstart(e.target.value)}
        value={datestart}
        required
      />
      <Form.Input
        fluid
        label='Date End'
        type="date"
        onChange={e=>setdtend(e.target.value)}
        value={dateend}
        required
      />
    </Form.Group>
        <Form.Field>
          <Dropdown
            placeholder='Select Company'
            fluid
            search
            selection
            options={cmpny}
            onChange={(e,d)=>{ setcompany(d.value)}}
            value={company}
        required
          />
        </Form.Field>

        <Form.Group widths='equal'>
      <Form.Input
        fluid
        label='Number of User'
        type="number" step="1"
        min="0"
        onChange={e=>setuser(e.target.value)}
        value={user}
        required
      />
      <Form.Input
        fluid
        label='Number of Scheme'
        min="0"
        type="number" step="1"
        onChange={e=>setschm(e.target.value)}
        value={schm}
        required
      />
      <Form.Input
        fluid
        label='Number of Premises'
        type="number" step="1"
        min="0"
        onChange={e=>setpremise(e.target.value)}
        value={premise}
        required
      />
    </Form.Group>
      </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button color='red' onClick={() => {setOpen(false); resetForm();}}>
          <Icon name='remove' /> No
        </Button>
        <Button type="submit" form="subcrform" color='green'>
          <Icon name='checkmark' /> Submit
        </Button>
      </Modal.Actions>
    </Modal>
        {subcrList &&
          <RenderSubscription data={subcrList}/>
        }   
      </div>
    </Transition>
  )
}

export default SubscriptionList