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
  Form,Dropdown,Confirm, Dimmer, Loader,
} from 'semantic-ui-react';

import * as moment from 'moment';

import { useParams,useHistory, Link, useRouteMatch } from "react-router-dom";

import {deleteUser, postCopyCklist, SubscriptionContext,getSubcrData } from '../subscription/subscription';

const renderHTML = (rawHTML) => React.createElement("div", { dangerouslySetInnerHTML: { __html: rawHTML } });

import { ClientContext } from './client';

const ClientChecklists = ({data,stock,onDataChange,onDelete,id,accesslvl}) => {
//   const {subcr,cmpny} = useContext(SubscriptionContext);

const history = useHistory();
let { path, url } = useRouteMatch();
    const { activeDraft } = React.useContext(ClientContext);
  const [modalOpen, setModalOpen] = React.useState(false);

  const [objid, setID] = React.useState(null);
  const [cklists, selectcklists] = React.useState([]);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  React.useEffect(() => {
    // if (typeof(Storage) !== "undefined") {
    //   // Code for localStorage/sessionStorage.
    const bootstrapAsync = async () => {
      console.log(activeDraft);
      console.log(data);
   }

   bootstrapAsync();
  }, [activeDraft])
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
 
  const RenderScheme = props => {
    const data = props.data;
    const listItems =  Object.keys(data).map((x) =>
    <List.Item key={x}>
        <List.Content  as={Link} to={`${url}/${x}`}>
        {data[x].name}
        </List.Content>
        <List.Content floated='right'>v{data[x].version}
        {accesslvl<3 && <Button onClick={()=>deleteForm(x)}  size='medium' circular  basic color='red' icon='trash alternate' />}
        </List.Content>
      </List.Item>
    );

    return <List  ordered divided>
    {listItems}
  </List>
}
      
  return <React.Fragment>
      <Button as={Link} onClick={e=>{ if(activeDraft){
        setOpenConfirm(true);
        e.preventDefault();

      }}} to={`checklistadd`} fluid  basic color='green' > <Icon name='plus' />Add</Button>
      <Confirm
          open={openConfirm}
          content={`There are unsaved checklist name ${activeDraft?activeDraft.cklistName:""}. Do you wish to continue?`}
          cancelButton='Never mind, Create new'
          confirmButton="Let's continue"
          onCancel={()=>{setOpenConfirm(false);history.push("checklistadd");}}
          onConfirm={()=>{setOpenConfirm(false); history.push("checklist/draft");}}
        />
      <Divider/>
      <div className="clientTable">
      
        {data? <RenderScheme data={data}/>:
      <Dimmer active>
        <Loader>Loading</Loader>
      </Dimmer>}   
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

export default ClientChecklists