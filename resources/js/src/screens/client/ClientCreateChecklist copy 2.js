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

import { ClientContext,saveChecklist } from './client';
import { deleteUser, postUser } from '../subscription/subscription';
import { EditableLabel, HeaderAction, PromptModal } from '../../components/simplifyUi';

const renderHTML = (rawHTML) => React.createElement("div", { dangerouslySetInnerHTML: { __html: rawHTML } });

const ClientCreateChecklist = ({ data, onDataChange, id }) => {
  //   const {subcr,cmpny} = useContext(SubscriptionContext);
  
  const { index } = useParams();
  const { activeDraft } = React.useContext(ClientContext);
  const [modalOpen, setModalOpen] = React.useState(false);

  const [userid, setuserid] = React.useState(0);
  const [name, setname] = React.useState("");
  const [version, setVersion] = React.useState("1.0.0");
  // const [language, setLanguage] = React.useState("ms");
  const [categories, setCategories] = React.useState([]);
  const [severities, setSeverities] = React.useState([]);
  const [cklistData, setCklistData] = React.useState([]);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [savedCklist, setSavedCklist] = React.useState({});


  let { path, url } = useRouteMatch();

  React.useEffect(() => {
    // if (typeof(Storage) !== "undefined") {
    //   // Code for localStorage/sessionStorage.
    const bootstrapAsync = async () => {
    // let cklistDraft = localStorage.getItem(id + "_cklistDraft");
    console.log(activeDraft)
    if (activeDraft && index=="draft") {
      setSavedCklist(activeDraft);
      if (activeDraft.cklistName) setname(activeDraft.cklistName);
      if (activeDraft.version) setVersion(activeDraft.version);
      // if (activeDraft.cklistLang) setLanguage(activeDraft.cklistLang);
      if (activeDraft.severity) setSeverities(activeDraft.severity);
      if (activeDraft.category) setCategories(activeDraft.category);
      if (activeDraft.data) setCklistData(activeDraft.data);
      // ();
      // ();
      // ();
    }
   }

   bootstrapAsync();
  }, [activeDraft])

  const updateDraftName = x => {
    setname(x);
    let cklistDraft = JSON.stringify(savedCklist);
    if (cklistDraft) {
      cklistDraft = JSON.parse(cklistDraft);
      cklistDraft.cklistName = x;
    }
    else {
      cklistDraft = { cklistName: x };
    }
    setSavedCklist(cklistDraft);
    localStorage.setItem(id + "_cklistDraft", JSON.stringify(cklistDraft));
  }
  const updateDraftVersion = x => {
    setVersion(x);
    let cklistDraft =JSON.stringify(savedCklist);
    if (cklistDraft) {
      cklistDraft = JSON.parse(cklistDraft);
      cklistDraft.version = x;
    }
    else {
      cklistDraft = { version: x };
    }
    setSavedCklist(cklistDraft);
    localStorage.setItem(id + "_cklistDraft", JSON.stringify(cklistDraft));
  }
  // const updateDraftLang = x => {
  //   setLanguage(x);
  //   let cklistDraft = JSON.stringify(savedCklist);
  //   if (cklistDraft) {
  //     cklistDraft = JSON.parse(cklistDraft);
  //     cklistDraft.cklistLang = x;
  //   }
  //   else {
  //     cklistDraft = { cklistLang: x };
  //   }
  //   setSavedCklist(cklistDraft);
  //   localStorage.setItem(id + "_cklistDraft", JSON.stringify(cklistDraft));
  // }
  
  
  const updateDraftSeverity=(x)=>{
    let cklistDraft= JSON.stringify(savedCklist);
    if(cklistDraft){
      cklistDraft = JSON.parse(cklistDraft);
      cklistDraft.severity=x;
    }
    else{
      cklistDraft={severity:x};
    }
    setSavedCklist(cklistDraft);
    localStorage.setItem(id+"_cklistDraft", JSON.stringify(cklistDraft));
  }

  const updateDraftCategory=(x)=>{
    let cklistDraft= JSON.stringify(savedCklist);
    if(cklistDraft){
      cklistDraft = JSON.parse(cklistDraft);
      cklistDraft.category=x;
    }
    else{
      cklistDraft={category:x};
    }
    setSavedCklist(cklistDraft);
    localStorage.setItem(id+"_cklistDraft", JSON.stringify(cklistDraft));
  }
  const updateDraftData=(x)=>{
    let cklistDraft= JSON.stringify(savedCklist);
    if(cklistDraft){
      cklistDraft = JSON.parse(cklistDraft);
      cklistDraft.data=x;
    }
    else{
      cklistDraft={data:x};
    }
    setSavedCklist(cklistDraft);
    localStorage.setItem(id+"_cklistDraft", JSON.stringify(cklistDraft));
  }



  const RenderItem = ({data,index}) => {
    const tableItem = data.map((x, i) =>
      <Table.Row key={i}>
        <Table.Cell>{i + 1}</Table.Cell>
        <Table.Cell>{renderHTML(x.text_ms)}</Table.Cell>
        <Table.Cell>{x.ctg}</Table.Cell>
        <Table.Cell>{severities.find(z => z.id === x.severity).name}</Table.Cell>
        <Table.Cell>{x.type}</Table.Cell>
        <Table.Cell>
          { Array.isArray(x.info) ?<List as='ol'>
            {
              x.info.map((y, idx) =>
                <List.Item as='li' key={idx}>

                      <List.Content >
                        {y}
                      </List.Content>

                </List.Item>
              )
            }
          </List>:x.info}
        </Table.Cell>
        <Table.Cell>
        <PromptModal onSave={(n) => {
                // let newData = [...cklistData];
                // newData[i].items=[n,...x.items]
                 let newData = JSON.parse(JSON.stringify(cklistData));
                //  console.log(newData[index].items[i]);
                //  console.log(n);
                newData[index].items[i]=n;
                setCklistData(newData);
                updateDraftData(newData);
                // setActiveIndex(i);
               }}
                title="Edit Checklist"
                items={[
                  { type: "hidden", name: "id", value:x.id},
                  {  label: "Checklist", name: "text_ms", required: true , value:x.text_ms },
                  {  label: "type", name: "type", required: true , value:x.type},
                  {  label: "Category", name: "ctg", type: "ddl", required: true, value:x.ctg,
                        options:categories.map((x,i)=>{
                        return{ key: i,
                        text: x,
                        value: x}
                      })
                    },
                  {  label: "Severity",  name: "severity", type: "ddl", required: true,value:x.severity,
                     options:severities.map((x,i)=>{
                     return{ key: i,
                      text: x.name,
                      value: x.id}
                    })
                  },
                  {  label: "Reference", name: "info",type: "array",value:x.info }
                ]}
                buttonProps={{ size: "small", name: 'edit', color: "yellow" }}
              />
        </Table.Cell>
      </Table.Row>
    );
    return <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>No</Table.HeaderCell>
          <Table.HeaderCell>Text</Table.HeaderCell>
          <Table.HeaderCell>Category</Table.HeaderCell>
          <Table.HeaderCell>severity</Table.HeaderCell>
          <Table.HeaderCell>type</Table.HeaderCell>
          <Table.HeaderCell>Reference</Table.HeaderCell>
          <Table.HeaderCell></Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {tableItem}
      </Table.Body>
    </Table>

  }
  const RenderChecklist = ({ data }) => {
    const listItems = data.map((x, i) =>

      <React.Fragment key={i}>

        <Accordion.Title>
          <HeaderAction
            buttonLeft={
              <Icon onClick={() => setActiveIndex(activeIndex === i ? -1 : i)} size="small"
                name={activeIndex === i ? 'arrow alternate circle down outline' : 'arrow alternate circle right outline'}
                color="teal" link />}
            buttonRight={
              <React.Fragment>
                  <PromptModal onSave={(x) => {
                    let newData = JSON.parse(JSON.stringify(cklistData));
                    newData[i].section=x.sect;
                    setCklistData(newData);
                    updateDraftData(newData);
                  }}
                    title="New Section"
                    items={[
                      { value: x.section, label: "Edit Section Name", name: "sect", required: true }
                    ]}
                    PrompButton={(props) => <Icon size="small" name="edit" {...props}  color="yellow" link />}
                  />
                 
              <PromptModal onSave={(n) => {
                let newData = [...cklistData];
                newData[i].items=[n,...x.items]
                setCklistData(newData);
                updateDraftData(newData);
                setActiveIndex(i);
               }}
                title="Add Checklist"
                items={[
                  { type: "hidden", name: "id", createID: true, },
                  {  label: "Checklist", name: "text_ms", required: true },
                  {  label: "type", name: "type", required: true },
                  {  label: "Category", name: "ctg", type: "ddl", required: false,
                        options:categories.map((x,i)=>{
                        return{ key: i,
                        text: x,
                        value: x}
                      })
                    },
                  {  label: "Severity",  name: "severity", type: "ddl", required: true,
                     options:severities.map((x,i)=>{
                     return{ key: i,
                      text: x.name,
                      value: x.id}
                    })
                  },
                  {  label: "Reference", type:"array", name: "cklist", required: true }
                ]}
                buttonProps={{ size: "small", name: 'plus', color: "teal" }}
              />
              </React.Fragment>
            }
          ><p onClick={() => setActiveIndex(activeIndex === i ? -1 : i)}>{x.section}</p></HeaderAction>
        </Accordion.Title>
        <Accordion.Content key={"cn" + i} active={activeIndex === i}>
          {x.items.length >0 && <RenderItem data={x.items} index={i}/>}
        </Accordion.Content>
      </React.Fragment>
    );
    return <Accordion fluid styled>{listItems}</Accordion>
    // <Card.Group as={Accordion} fluid styled >{listItems}</Card.Group>
  }

  const RenderCategory = props => {
    const data = props.data;
    const listItems = data.map((x, i) =>
      <List.Item key={i}>
        <List.Content>
          {x}
        </List.Content>
      </List.Item>
    );
    return <List className="" celled>{listItems}</List>
  }
  const RenderSeverity = props => {
    const data = props.data;
    // console.log(data);
    const tableItem = data.map((x, i) =>
      <Table.Row key={x.id}>
        <Table.Cell>{x.name}</Table.Cell>
        <Table.Cell>{x.mark}</Table.Cell>
        <Table.Cell >
          <a style={{ color: x.color }}><Icon name='stop' size='large' /></a>

        </Table.Cell>

        <Table.Cell>
          <PromptModal onSave={(x) => {
            let a = [...severities];
            a[i] = x;
            setSeverities(a);
            updateDraftSeverity();
          }}
            title="Add Severity"
            items={[
              { value: x.id, type: "hidden", name: "id" },
              { value: x.name, label: "Name", name: "name", required: true },
              { value: x.mark, label: "Marks", type: "number", name: "mark", required: true },
              { value: x.color, label: "Color", type: "color", name: "color", required: true }
            ]}
            buttonProps={{ size: "small", name: 'pencil', color: "teal" }}
          />
        </Table.Cell>
      </Table.Row>
    );
    return <Table singleLine>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Marks</Table.HeaderCell>
          <Table.HeaderCell>Color</Table.HeaderCell>
          <Table.HeaderCell>Action</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {tableItem}
      </Table.Body>
    </Table>

  }


  const panes = [
    {
      menuItem: 'Home',
      render: () =>
        <Segment.Group horizontal>
          <Segment color='green'>

            <HeaderAction
              buttonRight={
                <PromptModal onSave={(x) => {setSeverities([...severities, x]);
                   updateDraftSeverity([...severities, x]);
                }}
                  title="Add Severity"
                  items={[
                    { value: "", type: "hidden", name: "id", createID: true, },
                    { value: "", label: "Name", name: "name", required: true },
                    { value: "", label: "Marks", type: "number", name: "mark", required: true },
                    { value: "", label: "Color", type: "color", name: "color", required: true }
                  ]}
                  buttonProps={{ size: "small", name: 'plus', color: "teal" }}
                />
              }
            >Severity</HeaderAction>
            {severities.length>0 && <RenderSeverity data={severities} />}
          </Segment>
          <Segment color='green'>
            <HeaderAction onClick={() => { }} size="small" name='plus' color="teal"
              buttonRight={
                <PromptModal onSave={(x) => {setCategories([...categories, x.category]);updateDraftCategory([...categories, x.category]);}}
                  title="Add Category"
                  items={[
                    { value: "", label: "Category", name: "category", required: true, uppercase: true }
                  ]}
                  buttonProps={{ size: "small", name: 'plus', color: "teal" }}
                />
              }
            >Category</HeaderAction>
            
            {categories.length>0 && <RenderCategory data={categories} />}
          </Segment>
        </Segment.Group>
      ,
    },
    {
      menuItem: 'Checklist Items',
      render: () =>
        <div className="clientTable">
          <PromptModal onSave={(x) => {
            let newData = { section: x.sect, items: [] };
            setCklistData([...cklistData, newData]);
            updateDraftData([...cklistData, newData]);
          }}
            title="New Section"
            items={[
              { value: "", label: "Enter New Section Name", name: "sect", required: true }
            ]}
            PrompButton={(props) => <Button fluid basic color='green' {...props} > <Icon name='plus' />Add Section</Button>}
          />
          {cklistData && <RenderChecklist data={cklistData} />}
        </div>,
    }
  ]
  return <React.Fragment>
    <Segment.Group horizontal>
      <Segment>
        <EditableLabel
          fluid
          placeholder="Checklist Title"
          label='Checklist Name'
          value={name}
          onSave={updateDraftName}
        />
      </Segment>
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
      <Segment >
       
      <Button color="teal" fluid onClick={()=>{
         let n = Math.round(Date.now()/ 1000);
         let newid=n.toString(36)
        saveChecklist({id:newid,data:savedCklist,cmpnyid:id}).then(k=>{
          console.log(k);
      })}}>Save 1</Button>
      </Segment>
      {/* <Segment>
        <EditableLabel
          fluid
          placeholder="1.0.0"
          label='Checklist Language'
          icon={{ label: null }}
          type="ddl"
          onSave={updateDraftLang}
          value={language}
        />
      </Segment> */}
      </Segment.Group>

    <Tab  menu={{ pointing: true }} panes={panes} />

  </React.Fragment>
}

export default ClientCreateChecklist