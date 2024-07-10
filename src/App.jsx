import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import './App.css';

const itemsFromBackend = [
  {
    id: uuid(),
    content: 'Test Task 1'
  },
  {
    id: uuid(),
    content: 'Test Task 2'
  },
  {
    id: uuid(),
    content: 'Test Task 3'
  },
  {
    id: uuid(),
    content: 'Test Task 4'
  },
  {
    id: uuid(),
    content: 'Test Task 5'
  },
  {
    id: uuid(),
    content: 'Test Task 6'
  },
  {
    id: uuid(),
    content: 'Test Task 7'
  },
  {
    id: uuid(),
    content: 'Test Task 8'
  },
  {
    id: uuid(),
    content: 'Test Task 9'
  },
  {
    id: uuid(),
    content: 'Test Task 10'
  }
];

const columnsFromBackend = {
  [uuid()]: {
    name: 'Unplanned',
    items: itemsFromBackend
  },
  [uuid()]: {
    name: 'Today',
    items: []
  },
  [uuid()]: {
    name: 'Tomorrow',
    items: []
  },
  [uuid()]: {
    name: 'This Week',
    items: []
  },
  [uuid()]: {
    name: 'Next Week',
    items: []
  }
};

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;

  const { source, destination } = result;
  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems
      }
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);

    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems
      }
    });
  }
};

export default function App() {
  const [columns, setColumns] = useState(columnsFromBackend);

  return (
    <div className="app">
      <DragDropContext onDragEnd={result => onDragEnd(result, columns, setColumns)}>
        {Object.entries(columns).map(([id, column]) => {
          return (
            <div key={id} className="column">
              <h2 className="column-title">{column.name}</h2>
              <div className="task-list">
                <Droppable droppableId={id} key={id}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`task-list-inner ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                      >
                        {column.items.map((item, index) => {
                          return (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`task-item ${snapshot.isDragging ? 'dragging' : ''}`}
                                  >
                                    {item.content}
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}
