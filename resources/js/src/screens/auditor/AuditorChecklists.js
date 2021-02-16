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
  Form,Dropdown,Confirm
} from 'semantic-ui-react';

import * as moment from 'moment';

import { useParams,useHistory, Link, useRouteMatch } from "react-router-dom";

import {deleteUser, postCopyCklist, SubscriptionContext,getSubcrData } from '../subscription/subscription';

const renderHTML = (rawHTML) => React.createElement("div", { dangerouslySetInnerHTML: { __html: rawHTML } });


import {AuditorContext} from './auditor';

const AuditorChecklists = ({data}) => {
//   const {subcr,cmpny} = useContext(SubscriptionContext);

const history = useHistory();
let { path, url } = useRouteMatch();
    // const { activeDraft } = React.useContext(AuditorContext);
  const [modalOpen, setModalOpen] = React.useState(false);

  const [objid, setID] = React.useState(null);
  const [cklists, selectcklists] = React.useState([]);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  React.useEffect(() => {
    // if (typeof(Storage) !== "undefined") {
    //   // Code for localStorage/sessionStorage.
    const bootstrapAsync = async () => {
   }

   bootstrapAsync();
  }, [])
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
        {/* <Button onClick={()=>deleteForm(x)}  size='medium' circular  basic color='red' icon='trash alternate' /> */}
        </List.Content>
      </List.Item>
    );

    return <List  ordered divided>
    {listItems}
  </List>
}
      
  return <React.Fragment>
     
      <div className="clientTable">
      
        {data && <RenderScheme data={data}/>}   
  </div>
  </React.Fragment>
}

export default AuditorChecklists