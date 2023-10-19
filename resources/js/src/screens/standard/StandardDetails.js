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
  Form, Dropdown, Card, Popup
} from 'semantic-ui-react';

import * as moment from 'moment';

import { useParams, Link, useHistory } from "react-router-dom";

import { getStandard, StandardContext,getStandardDetails,saveStandard } from './standard';

import { EditableLabel, HeaderAction, PromptModal } from '../../components/simplifyUi';

const renderHTML = (rawHTML) => React.createElement("div", { dangerouslySetInnerHTML: { __html: rawHTML } });



import DraggableTableRow from '../../components/DraggableTableRow';

const StandardDetails = () => {


  const [activeIndex, setActiveIndex] = React.useState(-1);
  const { std, saveStd } = useContext(StandardContext);
  const [details, setDetails] = React.useState(null);

  const history = useHistory();
  const { id } = useParams();


  React.useEffect(() => {

    const bootstrapAsync = async () => {
      getStandardDetails(id).then(x=>{
        setDetails(x);
      })
      // if (std) {
      //   // setDetails(std[index])
      // }
      // setStdData(std[index].data);
      // setfilteredData(std[index].data);
    };

    bootstrapAsync();

  }, [std]);

  

  const updateDraftName = name => {
    setDetails({ ...details, name });
  }
  const updateDraftCode = code => {
    setDetails({ ...details, code });
  }
  const updateDraftLang = lang => {
    setDetails({ ...details, lang });
  }
  
  const RenderStd = ({ data }) => {
    console.log(data);
    const listItems = Object.keys(data).flatMap((pg,i)=>
      <React.Fragment key={i}>
        <DraggableTableRow as={Accordion.Title} key={i} i={i} data={Object.keys(data)} onDrop={a => {
          const ordered = a.reduce(
            (obj, key) => { 
              obj[key] = data[key]; 
              return obj;
            }, 
            {}
          );
          let newdtl=JSON.parse(JSON.stringify(details));
          newdtl.data=ordered
          setDetails(newdtl);
          // setCklistData(a);
          // updateDraftData(a);
        }}>
          <HeaderAction as="h5"
            buttonLeft={
              <Icon onClick={() => setActiveIndex(activeIndex === i ? -1 : i)} size="small"
                name={activeIndex === i ? 'arrow alternate circle down outline' : 'arrow alternate circle right outline'}
                color="teal" link />}
            buttonRight={
              <React.Fragment>
                <PromptModal onSave={(x) => {
                  let newdtl=JSON.parse(JSON.stringify(details));
                  newdtl.data[x.page]=newdtl.data[pg];
                  delete newdtl.data[pg];
                  setDetails(newdtl);
                }}
                  title="Edit Page"
                  items={[
                    { value: pg, label: "Edit Page Name", name: "page", required: true }
                  ]}
                  PrompButton={(props) => <Icon size="small" name="edit" {...props} color="yellow" link />}
                />

                <PromptModal onSave={(n) => {
                  console.log(n);
                  let newdtl=JSON.parse(JSON.stringify(details));
                  if(typeof newdtl.data[pg] !=="string"){
                    
                  newdtl.data[pg]={...newdtl.data[pg] ,[n.lineno]:n.desc};
                  }
                  else{
                  newdtl.data[pg]={[newdtl.data[pg]]:newdtl.data[pg] ,[n.lineno]:n.desc};
                }
                  setDetails(newdtl);
                  // let newData = [...cklistData];
                  // newData[i].items = [...x.items, n]
                  // setCklistData(newData);
                  // updateDraftData(newData);
                  setActiveIndex(i);
                }}
                  title="Add Item"
                  items={[
                    { label: "line no", name: "lineno", required: true },
                    { label: "Description", name: "desc", required: true, type:"textarea"},
                  ]}
                  buttonProps={{ size: "small", name: 'plus', color: "teal" }}
                />
                <Icon onClick={() => {
                    let newdtl=JSON.parse(JSON.stringify(details));
                    delete newdtl.data[pg];
                    setDetails(newdtl);
                }} size="small"
                  name="trash"
                  color="red" link />
              </React.Fragment>
            }
          ><p onClick={() => setActiveIndex(activeIndex === i ? -1 : i)}>{pg}</p>

          </HeaderAction>

        </DraggableTableRow>
        <Accordion.Content key={"cn" + i} active={activeIndex === i}>
           <RenderItem data={data[pg]} pg={pg} index={i} />
        </Accordion.Content>
      </React.Fragment>
    );
    return <Accordion fluid styled>{listItems}</Accordion>
    // <Card.Group as={Accordion} fluid styled >{listItems}</Card.Group>
  }

  const RenderItem = ({data,pg} )=> {

    if (data !== null && typeof data === "object") {
      const listItems = Object.keys(data).map((ln,i) => 
      <DraggableTableRow  key={ln} i={i} data={Object.keys(data)} onDrop={a=>{
        
        const ordered = a.reduce(
          (obj, key) => { 
            obj[key] = data[key]; 
            return obj;
          }, 
          {}
        );
        let newdtl=JSON.parse(JSON.stringify(details));
        newdtl.data[pg]=ordered
        setDetails(newdtl);
    
      }}>
        <Table.Cell width={1}>{ln}</Table.Cell>
        <Table.Cell>{renderHTML(data[ln])}</Table.Cell>
        <Table.Cell width={2}>

                <PromptModal onSave={(x) => {
                  let newdtl=JSON.parse(JSON.stringify(details));
                  if(ln!==x.lineno) delete data[ln];
                  newdtl.data[pg]={...data ,[x.lineno]:x.desc};
                
                  setDetails(newdtl);
                }}
                  title="Edit Item"
                  items={[
                    { label: "line no", name: "lineno", required: true, value:ln},
                    { label: "Description", name: "desc", required: true, type:"textarea", value:data[ln]},
                  ]}
                  buttonProps={{ size: "large", name: 'edit', color: "yellow" }}
                />
                <Icon onClick={() => {
                    let newdtl=JSON.parse(JSON.stringify(details));
                    delete data[ln]
                    newdtl.data[pg]={...data};
                    setDetails(newdtl);
                }} size="large"
                  name="trash"
                  color="red" link />
        </Table.Cell>
      </DraggableTableRow>
      );


      return <Table basic='very'>
        <Table.Body>
          {listItems}
        </Table.Body>
      </Table>
    }
    else {
      return <h1>{data || "No Data"}</h1>
    }
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
          <Segment >

            <Button color="teal" fluid onClick={() => {
              
              saveStandard(details).then(x=>console.log(x)).catch(e=>console.log(e))

                let index = std.findIndex( x => x.id === id );
                let saveddata= JSON.parse(JSON.stringify(details));
                saveddata.data=null;
                saveStd(index, saveddata);
              //    let n = Math.round(Date.now()/ 1000);
              //    let newid=n.toString(36)
              //    if(!savedCklist.name) savedCklist.name=name;
              //    if(!savedCklist.version) savedCklist.version=version;
              //    saveScheme({id:objid?objid:newid,data:savedCklist,cmpnyid:id}).then(k=>{
                setTimeout(() => {
                  history.goBack();
                }, 500);
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

    <div className="clientTable">
      <PromptModal onSave={(x) => {
        let newdtl=JSON.parse(JSON.stringify(details));
        if(newdtl.data){
          newdtl.data[x.page]={};
        }
        else{
          newdtl.data={}
          newdtl.data[x.page]={};
        }
        setDetails(newdtl);
      }}
        title="New Page"
        items={[
          { value: "", label: "Enter New Page Name", name: "page", required: true }
        ]}
        PrompButton={(props) => <Button fluid basic color='green' {...props} > <Icon name='plus' />Add Page</Button>}
      />
      {(details && details.data) && <RenderStd data={details.data} />}
    </div>
  </React.Fragment>
}

export default StandardDetails