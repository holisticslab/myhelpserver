import React, { useContext } from 'react'
import {
  Input, Menu, Segment,
  Checkbox,
  Grid,
  Header,
  Icon,
  Image,
  Sidebar,
  Transition,Divider,
  List,Modal,
  Button,Dropdown
} from 'semantic-ui-react';

import * as moment from 'moment';

import { useParams, Link, useRouteMatch, useHistory } from "react-router-dom";

import { getSchemeDtl, SchemeContext, saveScheme } from './scheme';
import { HeaderAction ,EditableLabel} from '../../components/simplifyUi';
import { getStandard } from '../standard/standard';

const SchemeDetails = () => {

  let history = useHistory();
  const { setDraft,clearDraft } = useContext(SchemeContext);
  let { path, url } = useRouteMatch();
  const [schm, setschm] = React.useState(null);
  const [std,setStd] = React.useState(null);
  const [standard, selectStandard] = React.useState([]);
  const [modalOpen, setModalOpen] = React.useState(false);

  const { id } = useParams();

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      getSchemeDtl(id).then(x => {
        console.log(x)
        setschm(x);
      }).catch(e => console.log(e))
      // setFilteredScheme(schmes);
      getStandard().then(x=>setStd(x.map(({id,name,code},i) => {
        return {
          key: i,
          text: `${code}: ${name}`,
          value: id
        }
      })));
    }
    bootstrapAsync();
  }, [id])

  const resetForm=()=>{
    selectStandard([]);

  }
  const RenderDetails = props => {
    const data = props.data;
    const listItems = data.map((x, i) =>
      <List.Item key={i} onClick={() => {
        setDraft(x);
      }} as={Link} to={`editor/${id}/${i}`}>
        <List.Content>
          {x.version}
          <List.Content floated='right'>
            {/* v{x.cklistData[0].version}  */}
            <Button onClick={(e) => {
              e.preventDefault();
              if (confirm("Are you sure to delete this?") == true) {
                saveScheme({ id, idx: i, action: "delete" }).then(x => {
                  let newC = JSON.parse(JSON.stringify(schm));
                  newC.cklistData = x;
                  setschm(newC)
                })
              }
            }} size='medium' circular basic color='red' icon='trash alternate' />
          </List.Content>
          <List.Content >{moment(x.lastUpdate).format('Do MMMM YYYY, h:mm A')}</List.Content>
        </List.Content>


      </List.Item>
    );
    return <List className="clientTable" celled ordered divided verticalAlign='middle' selection >{listItems}</List>
  }
  const RenderStandard = props => {
    const data = props.data;
    const listItems = data.map((x, i) =>
      <List.Item key={i} onClick={() => {
        setDraft(x);
      }} as={Link} to={`editor/${id}/${i}`}>
        <List.Content>
          {x.version}
          <List.Content floated='right'>
            {/* v{x.cklistData[0].version}  */}
            <Button onClick={(e) => {
              e.preventDefault();
              if (confirm("Are you sure to delete this?") == true) {
                saveScheme({ id, idx: i, action: "delete" }).then(x => {
                  let newC = JSON.parse(JSON.stringify(schm));
                  newC.cklistData = x;
                  setschm(newC)
                })
              }
            }} size='medium' circular basic color='red' icon='trash alternate' />
          </List.Content>
          <List.Content >{moment(x.lastUpdate).format('Do MMMM YYYY, h:mm A')}</List.Content>
        </List.Content>


      </List.Item>
    );
    return <List className="clientTable" celled ordered divided verticalAlign='middle' selection >{listItems}</List>
  }


  if (schm) {
    const detail = schm;
    return (

      <Transition transitionOnMount={true} animation="fade" duration={1000}>
        <div className="in innerContainer">
          
        <Grid>
            <Grid.Column width={1}>
            <Button size='medium' circular icon='angle left' basic color='green' onClick={() => history.goBack()} />
              
            </Grid.Column>
            <Grid.Column width={15}>
            <EditableLabel
                  fluid
                  placeholder="Scheme"
                  // label='Checklist Name'
                  value={detail.cklistName}
                  onSave={name=>saveScheme({ id, action: "rename",name}).then(x => {
                    let newC = JSON.parse(JSON.stringify(schm));
                    newC.cklistName = name;
                    setschm(newC)
                  })}
                />
                <Divider />
            </Grid.Column>
          </Grid>
          <Grid columns='equal' attached="top">
            <Grid.Column>
            <Segment color='green' attached="top">
            <HeaderAction
              buttonRight={<Link to={`editor/${id}/draft`} onClick={()=>clearDraft()}><Icon name='add' size='large' /></Link>}
            >Version</HeaderAction>
            
          </Segment>
          <Segment attached="bottom">
            {detail.cklistData && <RenderDetails data={detail.cklistData} />}
            </Segment>
            </Grid.Column>
            <Grid.Column>
            <Segment color='green' attached="top">
            <HeaderAction
              buttonRight={<Icon link onClick={()=>setModalOpen(true)} color='blue' name='add' size='large' />}
            >Reference & Standards</HeaderAction>
            
          </Segment>
          <Segment attached="bottom">
            {detail.standards && <RenderStandard data={detail.standards} />}
            </Segment>
            </Grid.Column>
          </Grid>
          
          <Modal style={{position:'relative',height:'auto'}}
              onClose={() =>{ setModalOpen(false),resetForm()}}
              // onOpen={() => setOpen(true)}
              open={modalOpen}
          >
            <Header icon='archive' content='Reference Management' />
            <Modal.Content>
            {/* <Form.Group widths='equal'> */}
            <Dropdown
               placeholder='Reference & Standard'
               fluid
               multiple
               search
               selection
               value={standard}
               onChange={(e,data)=>selectStandard(data.value)}
               options={std}
            />
           
         
            </Modal.Content>
            <Modal.Actions>
              <Button color='red' onClick={() => {setModalOpen(false); resetForm();}}>
                <Icon name='remove' /> No
              </Button>
              <Button color='green' onClick={() => {setModalOpen(false);
                saveScheme({ id, action: "addstandard",standard}).then(x => {
                  let newC = JSON.parse(JSON.stringify(schm));
                  newC.standards = x;
                  setschm(newC)
                })
                console.log(standard);}}>
                <Icon name='checkmark' /> Submit
              </Button>
            </Modal.Actions>
          </Modal>
        </div>
      </Transition>
    )
  }
  else
    return (<Header as='h3' >Loading....</Header>)
}

export default SchemeDetails