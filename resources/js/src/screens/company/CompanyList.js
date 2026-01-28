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

import { getCompany,CompanyContext } from './company';

const CompanyList = () => {

  const cmpny = useContext(CompanyContext);
  let { path, url } = useRouteMatch();


  const RenderCompany = props => {
    console.log(props)
    const data = props.data;
    const listItems = data.map((x,i) =>
      <List.Item key={i} as={Link} to={`${url}/details/${i}`}>
        <List.Content>
        <List.Header>{x.cmpnyName}</List.Header>{x.cmpnyDetails.address}
        {/* <List.Content floated='right'>{x.lang}</List.Content> */}
        
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
        <Header as='h3'>Company List</Header>
        {cmpny &&
          <RenderCompany data={cmpny}/>
        }   
      </div>
    </Transition>
  )
}

export default CompanyList