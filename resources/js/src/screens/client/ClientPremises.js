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
  Form,Dropdown, Dimmer, Loader,Pagination,Label
} from 'semantic-ui-react';

import * as moment from 'moment';

import { useParams, Link, useRouteMatch } from "react-router-dom";

import {deleteUser, postPremise, SubscriptionContext,getSubcrData } from '../subscription/subscription';

const renderHTML = (rawHTML) => React.createElement("div", { dangerouslySetInnerHTML: { __html: rawHTML } });

const ClientPremises = ({data,onDataChange,id,accesslvl}) => {
//   const {subcr,cmpny} = useContext(SubscriptionContext);
  const [modalOpen, setModalOpen] = React.useState(false);

  const [objid, setID] = React.useState(0);
  const [name, setName] = React.useState("");
  const [address, setAddress] = React.useState("");
  
  const [activePage, setActivePage] = React.useState(1);
  const [itemperpage, setitemperpage] = React.useState(50);
  const [premiseFilter, setPremiseFilter] = React.useState([]);
  const [basedata, setbasedata] = React.useState([]);

  React.useEffect(() => {

    const bootstrapAsync = async () => {

      let d=Object.keys(data).map((pg) =>{ data[pg].id=pg; return data[pg]});
      setbasedata(d);
      setPremiseFilter(d);
    };

    bootstrapAsync();

  }, [data]);
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
  const RenderProfile = ({data}) => {

    
    let pageItem=[];
    let i,j,temparray;
    for (i=0,j=data.length; i<j; i+=itemperpage) {
      temparray = data.slice(i,i+itemperpage);
      pageItem.push(temparray);
        // do whatever
    }
    const tableItem = pageItem[activePage-1].map((x, i) =>
    <List.Item  key={i}>
    <List.Content className="avatar image">
      <Dropdown  icon="ellipsis vertical"  className='icon' 
      pointing='top left'>
      <Dropdown.Menu className='right'>
        <Dropdown.Item  onClick={()=>editForm(x.id)} color='blue' icon='edit outline' text='Edit' />
        {accesslvl<3 && <Dropdown.Item  onClick={()=>deleteForm(x.id)} icon='trash' text='Remove' />}
      </Dropdown.Menu>
    </Dropdown>
    </List.Content>
    <List.Content>
      <List.Header> {x.name}</List.Header>
      {x.address}
    </List.Content>
  </List.Item>
);

  return <div className="clientUserTable">
    <List  ordered divided>
        {tableItem}
          </List>
          <Pagination siblingRange={2} activePage={activePage}   totalPages={pageItem.length} onPageChange={(e,d)=>setActivePage(d.activePage)}/>
        </div>
  
  }
  
      
  return <React.Fragment>
    <Button fluid as='div' labelPosition='right'>
    <Button fluid onClick={()=>setModalOpen(true)} basic color='green' > <Icon name='plus' />Add</Button>
      <Label basic >
      <Input 
                icon={{ name: 'search', link: true }}
                onChange={e=>{
                  let filter=e.target.value.toLowerCase()
                  const filterData = basedata.filter(({ name, address }) =>
                  name.toLowerCase().indexOf(filter) > -1 || address.toLowerCase().indexOf(filter) > -1);
                  setPremiseFilter(filterData)
                }}
                placeholder='Search Premise...'
              />
      </Label>
    </Button>
      <Divider/>
     
  {premiseFilter.length&& <RenderProfile data={premiseFilter} />
  
  }
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
  </React.Fragment>
}

export default ClientPremises