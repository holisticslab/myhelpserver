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
  Table,Tab
} from 'semantic-ui-react';

import * as moment from 'moment';

import { useParams, Link, useRouteMatch } from "react-router-dom";

import { getStandard, StandardContext } from './standard';

const renderHTML = (rawHTML) => React.createElement("div", { dangerouslySetInnerHTML: { __html: rawHTML } });

const StandardDetails = () => {

  const std = useContext(StandardContext);
  let { path, url } = useRouteMatch();  
  const [stdData, setStdData] = React.useState([]);
  const [filteredData, setfilteredData] = React.useState([]);

  const [details, setDetails] = React.useState([]);

  const { index } = useParams();


  React.useEffect(() => {

    const bootstrapAsync = async () => {
      
     setDetails(std[index])
      setStdData(std[index].data);
      setfilteredData(std[index].data);
    };

    bootstrapAsync();

  }, [std]);

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
  const RenderStandard = props => {

    const data = props.data;
    const panes =  Object.keys(data).flatMap((pg) => 
    {
      if(Object.keys(data[pg]).length>0)
      return (
      pg==0?(
        { menuItem: 'General', render: () => <Tab.Pane><RenderItem data={data[pg]}/></Tab.Pane> }
    ):({ menuItem: `Page ${pg}`, render: () => <Tab.Pane><RenderItem data={data[pg]}/></Tab.Pane> })
      )
      }
      )
    
    return <Tab menu={{ vertical: true }} panes={panes} />
  }

  if (details)
   {
     return (

      <Transition transitionOnMount={true} animation="fade" duration={1000}>
        <div className="in innerContainer listScroll">
          <Header as='h3' dividing style={{ lineHeight: '2em' }}>
            <Button size='medium' circular icon='angle left' basic color='green' as={Link} to={`${url.split("/details").shift()}`} />
              Standard : {`${details.code}: ${details.name}`} </Header>
              <Input fluid
                icon={{ name: 'search', link: true }}
                onChange={e=>{
                  let filter=e.target.value.toLowerCase()
                  let newdata= JSON.parse(JSON.stringify(stdData));
                  Object.keys(stdData).flatMap((pg) => 
                  newdata[pg]= Object.fromEntries(Object.entries(stdData[pg]).filter(([key, value]) =>
                  value.toLowerCase().indexOf(filter) > -1
                  ))
                  )
                 
                  console.log(newdata);
                  setfilteredData(newdata)
                }}
                placeholder='Search users...'
              />
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
          <Segment color='green'>
                <Header as='h3' dividing>Standards</Header>
                <RenderStandard data={filteredData}/>
              </Segment>
        </div>
      </Transition>
    )}
  else
    return (<Header as='h3' >Loading....</Header>)
}

export default StandardDetails