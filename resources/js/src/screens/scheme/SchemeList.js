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

import { getScheme,SchemeContext } from './scheme';

const SchemeList = () => {

  const schmes = useContext(SchemeContext);
  let { path, url } = useRouteMatch();


  const RenderScheme = props => {
    console.log(props)
    const data = props.data;
    const listItems = data.map((x,i) =>
      <List.Item key={i}>
        <List.Content  as={Link} to={`${url}/details/${i}`}>
        {x.cklistName}
        </List.Content>
        <List.Content floated='right'>v{x.cklistData[0].version} 
        <Button onClick={()=>{}}  size='medium' circular  basic color='red' icon='trash alternate' />
        </List.Content>
      </List.Item>
    );
    return <List className="listScroll" celled ordered  verticalAlign='middle'>
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
        <Header as='h3'>Scheme List</Header>
        {schmes &&
          <RenderScheme data={schmes}/>
        }   
      </div>
    </Transition>
  )
}

export default SchemeList