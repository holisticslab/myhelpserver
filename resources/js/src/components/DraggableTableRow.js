import React from "react";
import { Table } from "semantic-ui-react";

// Component for DraggableTableRow with drag and drop functionality
const DraggableTableRow = ({
    children,
    as: Component = Table.Row,
    i,
    data,
    onDrop,
    ...props
}) => {
    const handleDragStart = e => {
        e.dataTransfer.setData("text/plain", i);
    };

    const handleDragOver = e => {
        e.preventDefault();
    };

    const handleDrop = e => {
        e.preventDefault();
        const fromIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
        if (onDrop && fromIndex !== i) {
            const newData = [...data];
            const [removed] = newData.splice(fromIndex, 1);
            newData.splice(i, 0, removed);
            onDrop(newData);
        }
    };

    return (
        <Component
            draggable
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{ cursor: "grab" }}
            {...props}
        >
            {children}
        </Component>
    );
};

export default DraggableTableRow;
