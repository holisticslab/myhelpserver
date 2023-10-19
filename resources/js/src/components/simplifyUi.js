import React from 'react';
import { Button, Form, Input, Icon, Header, Image, Message, Segment, Modal, List, ListContent } from 'semantic-ui-react'

import { toDataUrl } from './function';

export const EditableLabel = ({ value, label, icon, onChange, onSave, disabled, ...props }) => {
  const [editMode, setEditMode] = React.useState(true);
  const [iconprops, setIconProps] = React.useState({ icon: 'save', label: 'Save' });
  const [newValue, setNewValue] = React.useState(value);
  React.useEffect(() => {
    setEditMode(value.length < 1);
    if (icon) setIconProps({ ...iconprops, ...icon })
  }, [value])
  return editMode ?
    <Form.Input value={newValue} {...props} label={label} onChange={e => setNewValue(e.target.value)}
      action={{
        color: 'teal',
        labelPosition: iconprops.label ? 'right' : iconprops.label,
        icon: iconprops.icon,
        content: iconprops.label,
        onClick: () => { newValue.length > 0 ? (setEditMode(false), onSave(newValue)) : [] }
      }} /> : <React.Fragment>
      <Header sub>{label}</Header>
      <Header as='h5' floated='right' >
        {!disabled && <Icon onClick={() => { setEditMode(true); setNewValue(value) }} size="small" name='pencil' color="teal" link />}
        </Header>
      <Header as='h3' floated='left'>{value}</Header>
      <Header></Header>
    </React.Fragment>

}

export const HeaderAction = ({ as, buttonLeft, buttonRight, children, ...props }) => {
  return <React.Fragment>
    {buttonRight && <Header as='h5' floated='right'>{buttonRight}</Header>}
    {buttonLeft && <Header as='h5' floated='left'>{buttonLeft}</Header>}
    <Header as={as ? as : 'h3'} floated="left">{children}</Header>
    <br />
  </React.Fragment>

}

export const PromptModal = ({ title, onSave, items, buttonProps, PrompButton }) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [newItem, setNewItem] = React.useState([]);
  const [newID, setNewID] = React.useState(0);
  const [formWarning, setWarning] = React.useState(true);
  const [tempInput, settempInput] = React.useState("");
  React.useEffect(() => {
    if (items) setNewItem(items);

  }, [items])
  return <React.Fragment>
    {typeof PrompButton == "undefined" ? <Icon onClick={() => {
      let n = Math.round(Date.now() / 1000);
      setNewID(n.toString(36));
      setModalOpen(true)
    }} {...buttonProps} link /> : <PrompButton onClick={() => {
      let n = Math.round(Date.now() / 1000);
      setNewID(n.toString(36));
      setModalOpen(true)
    }} />}
    <Modal style={{ position: 'relative', height: 'auto' }}
      onClose={() => { setModalOpen(false) }}
      // onOpen={() => setOpen(true)}
      open={modalOpen}
    >
      <Header content={title} />
      <Modal.Content>
        <Message
          hidden={formWarning}
          attached
          negative
          header='Attention!'
          content='Please complete the form below'
        />
        <Form id="promptForm" onReset={() => {
          // let x = [...newItem];
          newItem.forEach((e, i) => {
            e.value = items[i].value ? items[i].value : "";
          });
          settempInput("");
          setModalOpen(false);
        }}
          onSubmit={() => {
            let required = newItem.map(({ required }) => required);
            let pass = true;
            required.forEach((e, i) => {
              if (e) {
                if (typeof newItem[i].value == "undefined" || newItem[i].value.length < 1) {
                  pass = false;
                }
              }
            })
            if (pass) {
              let names = newItem.map(({ name }) => name);
              let returnObj = names.reduce((o, val, i) => { o[val] = newItem[i].createID ? newID : newItem[i].value; return o; }, {});
              onSave(returnObj), setModalOpen(false)
            }
            else {
              setWarning(false);
              let timerid = setTimeout(() => {
                setWarning(true);
              }, 2000);
            }
          }} >

          {newItem.map(({ createID, uppercase, options, type, ...x }, i) =>
            x.label && (
            type == "ddl" ?
              <Form.Dropdown
                {...x} key={i}
                selection
                onChange={(e, data) => {
                  let x = [...newItem];
                  x[i].value = data.value;
                  setNewItem(x)
                }}
                options={options}
              />
              : type == "array" ?
                <React.Fragment key={i}>
                  <Form.Input value={tempInput} label={x.label} onChange={e => settempInput(e.target.value)}
                    action={{
                      color: 'teal',
                      content: "add",
                      onClick: (e) => {
                        e.preventDefault();
                        let x = [...newItem];
                        let current = x[i].value;
                        x[i].value = current ? [...current, tempInput] : [tempInput];
                        settempInput("");//setModalOpen(true);
                        setNewItem(x)
                      }
                    }}
                  />
                  <List ordered divided verticalAlign='middle'>
                    {Array.isArray(x.value) &&
                      x.value.map((y, idx) =>
                        <List.Item key={idx}>
                          <List.Content floated='right'>
                            <Button onClick={e => {
                              e.preventDefault();
                              let x = [...newItem];
                              let current = x[i].value;
                              current.splice(idx, 1);
                              setNewItem(x)
                            }}>delete</Button>
                          </List.Content>
                          <List.Content>
                            {y}
                          </List.Content>
                        </List.Item>
                      )
                    }
                  </List>
                </React.Fragment>
                : type == "image" ?
                  <React.Fragment key={i}>
                    <Image src={x.value} size='tiny' verticalAlign='middle' />
                    <Form.Input  {...x} value="" type="file" onChange={e => {
                      let x = [...newItem];
                      toDataUrl(URL.createObjectURL(e.target.files[0]), 'image/png', 1000).then(d => {
                        console.log("siap prosess");
                        console.log(d);
                        x[i].value = d;
                        setNewItem(x)
                      }).catch(e => console.log(e))
                    }} accept="image/*" />
                  </React.Fragment>
                  : type == "textarea" ? <Form.TextArea  {...x} type={type} key={i} rows={5} onChange={e => {
                    let x = [...newItem];
                    x[i].value = uppercase ? e.target.value.toUpperCase() : e.target.value;
                    setNewItem(x)
                  }} />
                    : <Form.Input  {...x} type={type} key={i} onChange={e => {
                      let x = [...newItem];
                      x[i].value = uppercase ? e.target.value.toUpperCase() : e.target.value;
                      setNewItem(x)
                    }} />)
          )
          }
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button type="reset" form="promptForm" color='red' >
          <Icon name='remove' /> No
        </Button>
        <Button type="submit" form="promptForm" color='green'>
          <Icon name='checkmark' /> Submit
        </Button>
      </Modal.Actions>
    </Modal>
  </React.Fragment>
}