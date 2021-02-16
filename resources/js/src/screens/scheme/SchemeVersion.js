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
  Popup
} from 'semantic-ui-react';

import * as moment from 'moment';

import { useParams, Link, useRouteMatch } from "react-router-dom";

import { getScheme, SchemeContext } from './scheme';

const renderHTML = (rawHTML) => React.createElement("div", { dangerouslySetInnerHTML: { __html: rawHTML } });

const SchemeVersion = () => {

  const schmes = useContext(SchemeContext);
  let { path, url } = useRouteMatch();

  const { index, version } = useParams();


  const RenderCategory = props => {
    const data = props.data;
    const listItems = data.map((x, i) =>
      <List.Item key={i}>
        <List.Content>
          {x}
        </List.Content>
      </List.Item>
    );
    return <List className="listScroll" celled divided verticalAlign='middle'>{listItems}</List>
  }
  const RenderSeverity = props => {
    const data = props.data;
    console.log(data);
    const tableItem = data.map((x, i) =>
      <Table.Row key={i}>
        <Table.Cell>{x.sevrName}</Table.Cell>
        <Table.Cell>{x.sevrMark?x.sevrMark:x.sevrVal}</Table.Cell>
        <Table.Cell >
          <a style={{ color: x.sevrColor }}><Icon name='stop' size='large' /></a>

        </Table.Cell>
      </Table.Row>
    );
    return <Table singleLine>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Value</Table.HeaderCell>
          <Table.HeaderCell>Color</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {tableItem}
      </Table.Body>
    </Table>

  }

  const RenderItem = props => {
    const data = props.data;
    console.log(data);
    const tableItem = data.map((x, i) =>
      <Table.Row key={i}>
      <Table.Cell>{i+1}</Table.Cell>
      <Table.Cell>{renderHTML(x.text_ms)}</Table.Cell>
      <Table.Cell>{x.ctg}</Table.Cell>
      <Table.Cell>{x.severityLabel}</Table.Cell>
      <Table.Cell>{x.type}</Table.Cell>
      <Table.Cell>
      <List as='ol'>
              {
                x.info.map((y, idx) =>
                  <List.Item  as='li' key={idx}>
                    
                    <Popup
                    position='top right'
                    content={renderHTML(y.text)}
                    trigger= {
                      <List.Content as ="a" href="#">
                      {`${y.doc} Pg ${y.pgNo}- ${y.LnNo}:`}
                      </List.Content>
                      } />
                    
                  </List.Item>
                )
              }
          </List>
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
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {tableItem}
      </Table.Body>
    </Table>

  }
  const RenderChecklist = props => {
    const data = props.data;
    const listItems = data.map((x, i) =>
      <List.Item as='li'key={i}>
        <List.Content>
          {x.section}
        </List.Content>
        <RenderItem data={x.items}/>
      </List.Item>
    );
    return <ol type="A">{listItems}</ol>
  }

  if (schmes) {
    const detail = schmes[index];
    const checklist = detail.cklistData[version];
    return (

      <Transition transitionOnMount={true} animation="fade" duration={1000}>
        <div className="in innerContainer listScroll">
          <Header as='h3' dividing style={{ lineHeight: '2em' }}>
            <Button size='medium' circular icon='angle left' basic color='green' as={Link} to={`${url.split("/version").shift()}`} />
              Scheme : {`${detail.cklistName} - v${checklist.version}`} </Header>

          <Segment.Group horizontal>
            <Segment color='green'>
              <Header as='h3' dividing>Severity</Header>
              <RenderSeverity data={checklist.severity} />
            </Segment>
            <Segment color='green'>
              <Header as='h3' dividing>Category</Header>
              <RenderCategory data={checklist.category} />
            </Segment>
          </Segment.Group>
          <Segment color='green'>
                <Header as='h3' dividing>Checklist</Header>
                <RenderChecklist data={checklist.data}/>
              </Segment>
        </div>
      </Transition>
    )
  }
  else
    return (<Header as='h3' >Loading....</Header>)
}

export default SchemeVersion