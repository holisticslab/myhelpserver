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
  Modal, Divider, Accordion,
  Form, Dropdown, Card,Popup
} from 'semantic-ui-react';

import * as moment from 'moment';

import { useParams, Link, useRouteMatch } from "react-router-dom";

import { getStandard, StandardContext } from './standard';

import { EditableLabel, HeaderAction, PromptModal } from '../../components/simplifyUi';

const renderHTML = (rawHTML) => React.createElement("div", { dangerouslySetInnerHTML: { __html: rawHTML } });

const StandardDetails = () => {

  const {std,saveStd} = useContext(StandardContext);
  let { path, url } = useRouteMatch();  
  const [stdData, setStdData] = React.useState([]);
  const [filteredData, setfilteredData] = React.useState([]);

  const [details, setDetails] = React.useState(null);
  const [panes, setPanes] = React.useState([]);

  const { index } = useParams();


  React.useEffect(() => {

    const bootstrapAsync = async () => {
      if(std){
        setDetails(std[index])
        renderPanes(std[index].data);
      }
      // setStdData(std[index].data);
      // setfilteredData(std[index].data);
    };

    bootstrapAsync();

  }, [std]);
  const renderPanes=(data)=>{
    let listpane=Object.keys(data).map((ln)=>{
      return { menuItem:`Page ${ln}`, render: () => <Tab.Pane>{ln} Content</Tab.Pane>}
    });

    setPanes(listpane);

  }

  const RenderItem = props => {
    const data = props.data;
    if(data!==null && typeof data ==="object")
    {
      const listItems = Object.keys(data).map((ln)=><Table.Row  key={ln}>
      <Table.Cell width="1">{ln}</Table.Cell>
      <Table.Cell>{renderHTML(data[ln])}</Table.Cell>
    </Table.Row>)
   
    
    return <Table basic='very'>
    <Table.Body>
     {listItems}
    </Table.Body>
  </Table>
   }
   else{
     return <h1>{data||"No Data"}</h1>
   }
  }
  const RenderStandard = props => {
    // const data = props.data;
    if(props && props.data){
      
    const data=props.data[index].data;
    // console.log(Object.keys(data))
    const panes =  Object.keys(data).flatMap((pg) => 
    {
    //   if(typeof data[pg]==="object" && data[pg] !==null && Object.keys(data[pg]).length>0)
    //  { 
      //  console.log(data[pg])
       return (
      pg==0?(
        { menuItem: 'General', render: () => <Tab.Pane><RenderItem data={data[pg]}/></Tab.Pane> }
    ):({ menuItem: `Page ${pg}`, render: () => <Tab.Pane><RenderItem data={data[pg]}/></Tab.Pane> })
      )
    // }
    //   else console.log(data[pg]);
      }
      )
    
    return <Tab className="clientTable"
    grid={{ paneWidth: 11, tabWidth: 4 }}
     menu={{ pointing: true,vertical: true,  tabular: true  }} panes={panes} />
    // return <h1>has data</h1>
  }
  else{
    return <h1>no data</h1>
  }
  }

  
  const updateDraftName = name => {
    setDetails({...details,name});
  }
  const updateDraftCode = code => {
    setDetails({...details,code});
  }
  const updateDraftLang = lang => {
    setDetails({...details,lang});
  }

  return <React.Fragment>
    {details &&
    <React.Fragment>
  <Segment.Group horizontal>
    <Segment>
      <EditableLabel
        fluid
        placeholder="Code"
        label='Code'
        value={details.code}
        onSave={updateDraftCode}
      />
    </Segment>
    <Segment>
      <EditableLabel
        fluid
        placeholder="Language"
        label='Language'
        value={details.lang}
        onSave={updateDraftLang}  
      />
    </Segment>
    {/*
    <Segment>
      <EditableLabel
        fluid
        placeholder="1.0.0"
        label='Checklist Version'
        icon={{ label: null }}
        onSave={updateDraftVersion}
        value={version}
      />
    </Segment>
     */}
    <Segment >
     
    <Button color="teal" fluid onClick={()=>{
      saveStd(index,details)
    //    let n = Math.round(Date.now()/ 1000);
    //    let newid=n.toString(36)
    //    if(!savedCklist.name) savedCklist.name=name;
    //    if(!savedCklist.version) savedCklist.version=version;
    //    saveScheme({id:objid?objid:newid,data:savedCklist,cmpnyid:id}).then(k=>{
    //     history.goBack();
    //     clearDraft();
    //     reloadData(k);
    // })
    }}>Save</Button>

    </Segment>
    </Segment.Group>
    <Segment attached="bottom">
    <EditableLabel
      fluid
      placeholder="Name"
      label='Name'
      value={details.name}
      onSave={updateDraftName}
    />
  </Segment>
  </React.Fragment>
    }
  {/* <Tab className="clientTable"
  grid={{ paneWidth: 11, tabWidth: 4 }}
   menu={{ pointing: true,vertical: true,  tabular: true  }} panes={panes} /> */}
   <RenderStandard  data={std} />
</React.Fragment>
}

export default StandardDetails