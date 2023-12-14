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

import { getProfile, ProfileContext } from './profile';

const renderHTML = (rawHTML) => React.createElement("div", { dangerouslySetInnerHTML: { __html: rawHTML } });

const ProfileDetails = () => {

  const subcr = useContext(ProfileContext);
  let { path, url } = useRouteMatch();

  const { index } = useParams();


  
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
  const RenderProfile = props => {
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

  if (subcr)
   {
     const detail=subcr[index];
     return (

      <Transition transitionOnMount={true} animation="fade" duration={1000}>
        <div className="in innerContainer listScroll">
          <Header as='h3' dividing style={{ lineHeight: '2em' }}>
            <Button size='medium' circular icon='angle left' basic color='green' as={Link} to={`${url.split("/details").shift()}`} />
              Profile : {`${detail.subcrName}`} </Header>

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
                <Header as='h3' dividing>Staff</Header>
                <RenderProfile data={detail.subcrStaff}/>
              </Segment>
        </div>
      </Transition>
    )}
  else
    return (<Header as='h3' >Loading....</Header>)
}

export default ProfileDetails