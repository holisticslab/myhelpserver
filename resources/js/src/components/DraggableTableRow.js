import React from "react";
import { Table } from "semantic-ui-react";

const DraggableTableRow =({as,...props})=> {
  const onDragStart = (ev, i) => {
    ev.dataTransfer.setData("index", i);
  };

  const onDragOver = ev => {
    ev.preventDefault();
  };

  const onDrop = (ev, a) => {
    let b = ev.dataTransfer.getData("index");
    swap(parseInt(a, 10), parseInt(b, 10));
  };

  const swap=(a, b)=> {
    let items = props.data;
    // items[a] = items.splice(b, 1, items[a])[0];

    let element = items[b];
    items.splice(b, 1);
    items.splice(a, 0, element);

    props.onDrop(items);
    // this.setState({
    //   ...this.state,
    //   items
    // });
  }
    const { i } = props;
    return (
      <Table.Row as={as}
        draggable
        className="draggable"
        onDragStart={e => onDragStart(e, i)}
        onDragOver={e => onDragOver(e)}
        onDrop={e => {
          onDrop(e, i);
        }}
      >
        {props.children}
      </Table.Row>
    );
  
}

export default DraggableTableRow;
