import React, { useEffect, useState } from "react";


export default function Graph(props) {
    let draggableGraphId = props.draggableGraphId;
    let index = props.index;


    return (
        <Draggable key={draggableGraphId} draggableId={draggableGraphId} index={index}>
            {(provided) => (
            <div className="w-full h-44 mb-3 self-center bg-gray-800 rounded-lg"
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={{ ...provided.draggableProps.style }}
            >

                <div className="px-4"> {/* Wrapper div */}
                    <h1 className="text-center truncate">
                    {props.item.title}
                    </h1>
                </div>
            </div>
            )}
        </Draggable>

    );
}
