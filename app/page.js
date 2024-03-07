"use client";

import { useEffect, useState } from "react";
import { Person } from "@/app/Person";
import { DndContext } from "@dnd-kit/core";
import { Tree, TreeNode } from "react-organizational-chart";

const data = [
  {
    id: 1,
    name: "Amy Elsner",
    children: [
      {
        id: 2,
        name: "Anna Fali",
        children: [],
      },
      {
        id: 3,
        name: "Stephen Shaw",
        children: [
          {
            id: 4,
            name: "Bob White",
            children: [
              {
                id: 5,
                name: "Joe Cook",
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
];

const findNodeById = (node, id) => {
  if (node.id == id) {
    return node;
  } else {
    for (let child of node.children) {
      let foundNode = findNodeById(child, id);
      if (foundNode) {
        return foundNode;
      }
    }
  }
  return null;
};

const removeNodeById = (node, id) => {
  if (node.id === id) {
    return null;
  }

  node.children = node.children.filter((child) => child.id !== id);
  for (let child of node.children) {
    removeNodeById(child, id);
  }

  return node;
};

const updateTree = (tree, fromId, toId) => {
  if (fromId === toId) {
    return tree;
  }
  const draggedNode = findNodeById(tree, fromId);
  if (draggedNode) {
    removeNodeById(tree, fromId);
    const droppedNode = findNodeById(tree, toId);
    if (droppedNode) {
      droppedNode.children.push(draggedNode);
    } else {
      console.log("New node not found");
    }
  } else {
    console.log("Node to update not found");
  }
  return tree;
};

const MyTree = ({ people }) => {
  const style = {
    padding: "5px",
    borderRadius: "8px",
    display: "inline-block",
    border: "1px solid red",
  };

  const renderTreeNode = ({ treeNode }) => {
    return treeNode.children?.length > 0 ? (
      <TreeNode key={treeNode.id} label={<Person person={treeNode} />}>
        {treeNode.children?.length > 0 &&
          treeNode.children.map((child) => renderTreeNode({ treeNode: child }))}
      </TreeNode>
    ) : (
      <TreeNode key={treeNode.id} label={<Person person={treeNode} />} />
    );
  };

  return (
    <Tree
      lineWidth={"2px"}
      lineColor={"green"}
      lineBorderRadius={"10px"}
      label={<div style={style}>Root</div>}
    >
      {renderTreeNode({ treeNode: people })}
    </Tree>
  );
};

export default function Home() {
  const [people, setPeople] = useState(data[0]);
  const [rerenderTrigger, setRerenderTrigger] = useState(false);

  const handleDragEnd = ({ over, active }) => {
    if (over) {
      console.log(`Dragged item: ${active.id} , Drop target: ${over.id}`);
      setPeople(updateTree(people, active.id, over.id));
      setRerenderTrigger((prev) => !prev);
    }
  };

  useEffect(() => {
    // Reset the rerender trigger after the component has rerendered
    setRerenderTrigger(false);
  }, [rerenderTrigger]);

  return (
    <main>
      <DndContext onDragEnd={handleDragEnd}>
        <MyTree people={people} />
      </DndContext>
    </main>
  );
}
