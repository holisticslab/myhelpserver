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
  Table
} from 'semantic-ui-react';

import * as moment from 'moment';

import { useParams, Link, useRouteMatch } from "react-router-dom";

import { getCompany, CompanyContext, updateCompany } from './company';

import logo from '../../assets/img/initialWhite.png'; 
import { EditableLabel, HeaderAction, PromptModal } from '../../components/simplifyUi';
const renderHTML = (rawHTML) => React.createElement("div", { dangerouslySetInnerHTML: { __html: rawHTML } });

const CompanyDetails = () => {

  const {cmpny} = useContext(CompanyContext);
  let { path, url } = useRouteMatch();

  const [users, setuser] = React.useState([]);
  const [cmpnydata, setCmpny] = React.useState(null);

  const { index } = useParams();


  React.useEffect(() => {
    const bootstrapAsync = async () => {
      if (cmpny)
      {
        const {cmpnyPK}=cmpny[index];
          getCompany(cmpnyPK).then(x => {
            setuser(x);
          })
          setCmpny(cmpny[index]);
    }
    };

    bootstrapAsync();

  }, [cmpny]);
  
  const RenderItem = props => {
    const data = props.data;
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
  const RenderCompany = props => {
    console.log(props)
    const data = props.data;
    const listItems = data.map((x,i) =>
      <List.Item key={i} >
        <List.Content>
        {x.name}
        
        {/* <List.Content floated='right'>v{x.cklistData[0].version}</List.Content> */}
        
        </List.Content>
      </List.Item>
    );
    return <List className="listScroll" celled ordered divided verticalAlign='middle' selection>
      {listItems}
    </List>
  }

  const updCmpnyName =x=>{
    setCmpny({...cmpnydata,cmpnyName:x})
    updateCompany({...cmpnydata,cmpnyName:x}).then(k=>{
       console.log(k);

  })
  }
  const updAddress =x=>{
    setCmpny({...cmpnydata,cmpnyDetails:{...cmpnydata.cmpnyDetails,address:x}})
    updateCompany({...cmpnydata,cmpnyDetails:{...cmpnydata.cmpnyDetails,address:x}}).then(k=>{
       console.log(k);

  })
  }
  const updConfig=cmpnyConfig=>{
    setCmpny({...cmpnydata,cmpnyConfig})
    updateCompany({...cmpnydata,cmpnyConfig}).then(k=>{
       console.log(k);

  })
  }

  if (cmpnydata)
   {
     return (

      <Transition transitionOnMount={true} animation="fade" duration={1000}>
        <div className="in innerContainer listScroll">
        <Grid container>
    <Grid.Column width={2}>
    <Button size='medium' circular icon='angle left' basic color='green' as={Link} to={`${url.split("/details").shift()}`} />
    </Grid.Column>
    <Grid.Column  width={14} >
    <EditableLabel
                  fluid
                  placeholder="Company Name"
                  label='Company'
                  value={cmpnydata.cmpnyName}
                  onSave={updCmpnyName}
                />
    </Grid.Column>
  </Grid>
         
  <Segment.Group >
          {/* <Segment.Group horizontal>
            <Segment color='green'>
              <Header as='h3' dividing>Severity</Header>
              <RenderSeverity data={checklist.severity} />
            </Segment>
            <Segment color='green'>
              <Header as='h3' dividing>Category</Header>
              <RenderCategory data={checklist.category} />
            </Segment>
          </Segment.Group> */}
          <Segment>
                <Header as='h3' dividing>Details</Header>
                <EditableLabel
                  fluid
                  placeholder="Company Address"
                  label='Address'
                  value={cmpnydata.cmpnyDetails.address}
                  onSave={updAddress}
                />
               
              </Segment>
              <Segment>
              <HeaderAction as="h3"
              buttonRight={
              <PromptModal onSave={(x) => {
                updConfig(x);
              }}
                title="Edit Config"
                items={[
                  { value: cmpnydata.cmpnyConfig && cmpnydata.cmpnyConfig.headerLogo, label: "Header Logo",type: "image", name: "headerLogo" },
                  { value: cmpnydata.cmpnyConfig && cmpnydata.cmpnyConfig.fullLogo, label: "Company Logo",type: "image", name: "fullLogo" },
                  { value: cmpnydata.cmpnyConfig && cmpnydata.cmpnyConfig.appName, label: "Name", name: "appName" },
                  { value: cmpnydata.cmpnyConfig && cmpnydata.cmpnyConfig.headerColor, label: "Header Color", type: "color", name: "headerColor"},
                  { value: cmpnydata.cmpnyConfig && cmpnydata.cmpnyConfig.headerTextColor, label: "Text Color", type: "color", name: "headerTextColor" }
                ]}
                buttonProps={{ size: "small", name: 'pencil', color: "teal" }}
              />
            }>Config</HeaderAction>
            {cmpnydata.cmpnyConfig && <React.Fragment>
                <Image src={cmpnydata.cmpnyConfig.fullLogo} size="medium" centered />
                <Header sub>Header Style</Header>
                <Menu borderless inverted size='large' style={{backgroundColor:cmpnydata.cmpnyConfig.headerColor? cmpnydata.cmpnyConfig.headerColor:""}}>
                <Menu.Item>
                  <Image src={cmpnydata.cmpnyConfig.headerLogo?cmpnydata.cmpnyConfig.headerLogo:logo} size='mini' verticalAlign='middle'/>
                </Menu.Item>
                <Menu.Item header  as="h3" style={{color:cmpnydata.cmpnyConfig.headerTextColor? cmpnydata.cmpnyConfig.headerTextColor:""}}>{cmpnydata.cmpnyConfig.appName? cmpnydata.cmpnyConfig.appName:cmpnydata.cmpnyName+" Audit Management System"}</Menu.Item>
                </Menu>
                </React.Fragment>}
                </Segment>
              </Segment.Group> 
        </div>
      </Transition>
    )}
  else
    return (<Header as='h3' >Loading....</Header>)
}

export default CompanyDetails