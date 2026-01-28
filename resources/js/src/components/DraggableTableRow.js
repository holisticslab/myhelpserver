import React from "react";

// Placeholder component for DraggableTableRow
// TODO: Implement drag and drop functionality
const DraggableTableRow = ({
    children,
    as: Component = "div",
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
            onDrop({ fromIndex, toIndex: i });
        }
    };

    return (
        <Component
            draggable
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            {...props}
        >
            {children}
        </Component>
    );
};

export default DraggableTableRow;
