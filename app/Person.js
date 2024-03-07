import React from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";

export const Person = ({ person }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: person.id,
  });

  const { isOver, setNodeRef: setDroppableNodeRef } = useDroppable({
    id: person.id,
  });

  const style = transform
    ? {
        padding: "5px",
        borderRadius: "8px",
        border: "1px solid red",
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : {
        padding: "5px",
        borderRadius: "8px",
        border: "1px solid red",
      };

  return (
    <div key={person.id}>
      <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
        <div ref={setDroppableNodeRef}>{person.name}</div>
      </div>
    </div>
  );
};
