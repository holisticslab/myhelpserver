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
  Button
} from 'semantic-ui-react';

import * as moment from 'moment';

import { useParams, Link, useRouteMatch } from "react-router-dom";

import { getScheme, SchemeContext } from './scheme';

const SchemeDetails = () => {

  const schmes = useContext(SchemeContext);
  let { path, url } = useRouteMatch();

  const { index } = useParams();


  const RenderDetails = props => {
    console.log(props)
    const data = props.data;
    const listItems = data.map((x,i) =>
      <List.Item key={i} as={Link} to={`${url}/version/${i}`}>
        <List.Content>
        {x.version}
        
        <List.Content floated='right'>{moment(x.createdAt).format('Do MMMM YYYY, h:mm:ss')}</List.Content>
        
        </List.Content>
      </List.Item>
    );
    return <List className="listScroll" celled ordered divided verticalAlign='middle' selection>{listItems}</List>
  }

  if (schmes)
   {
     const detail=schmes[index];
     return (

      <Transition transitionOnMount={true} animation="fade" duration={1000}>
        <div className="in innerContainer">
          <Header as='h3' dividing>
            <Button size='medium' circular icon='angle left' basic color='green' as={Link} to={`${url.split("/details").shift()}`} />
              Scheme : {detail.cklistName} </Header>


              <Segment color='green'>
                <Header as='h3' dividing>Language</Header>
                {detail.cklistLang}
              </Segment>
              <Segment color='green'>
                <Header as='h3' dividing>Version</Header>
                <RenderDetails data={detail.cklistData}/>
              </Segment>
        </div>
      </Transition>
    )}
  else
    return (<Header as='h3' >Loading....</Header>)
}

export default SchemeDetails