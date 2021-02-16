import React,{useContext } from 'react'
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

import {Switch,Route,Link,useRouteMatch} from "react-router-dom";

import { getStandard,StandardContext } from './standard';

const StandardList = () => {

  const std = useContext(StandardContext);
  let { path, url } = useRouteMatch();


  const RenderStandard = props => {
    console.log(props)
    const data = props.data;
    const listItems = data.map((x,i) =>
      <List.Item key={i} as={Link} to={`${url}/details/${i}`}>
        <List.Content>
        <List.Header>{x.code}</List.Header>{x.name}
        <List.Content floated='right'>{x.lang}</List.Content>
        
        </List.Content>
      </List.Item>
    );
    return <List className="listScroll" celled ordered divided verticalAlign='middle' selection>
      {listItems}
      {/* <List.Item>
              Dogs
            <List.List>
                <List.Item>Labradoodles</List.Item>
                <List.Item>Shiba Inu</List.Item>
                <List.Item>Mastiff</List.Item>
              </List.List>
            </List.Item> */}
    </List>
  }
  return (

    <Transition transitionOnMount={true} animation="fade" duration={1000}>
      <div className="in innerContainer">
        <Header as='h3'>Standard List</Header>
        {std &&
          <RenderStandard data={std}/>
        }   
      </div>
    </Transition>
  )
}

export default StandardList