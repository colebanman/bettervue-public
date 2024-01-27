import React, { useEffect, useState } from "react";
import Constant from './ConstantDisplay.jsx';
import Link from "next/link.js";
import { FolderPlusIcon, PencilIcon, PencilSquareIcon, PlusCircleIcon, PlusIcon, SquaresPlusIcon } from "@heroicons/react/24/solid";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card.jsx";


export default function ClassView(props) {

    if(props.classes.length < 2){
        return (
            <div className="flex flex-col text-center items-center justify-center h-48 w-full">
                <div className="flex flex-col text-center items-center justify-center h-48 w-full">
                    <h1 className="text-3xl font-bold text-center">loading...</h1>
                    <Loader2 className="mr-2 h-12 w-12 animate-spin" />
                </div>
            </div>
        )
    }

    const addNameRef = React.useRef(null);
    const addPointsRef = React.useRef(null);
    const addOutOfRef = React.useRef(null);


    const [viewSelect, setViewSelect] = useState("assignments");
    const [selectedClass, setSelectedClass] = useState(props.classes[0]);
    const [selectedCatagory, setSelectedCatagory] = useState("Assignment Catagory");

    const [selectedAssignment, setSelectedAssignment] = useState(props.classes[0]);

    function calculateClassPercentage(classObject) {
        if (classObject.gradeBreakdown.length === 0) {
            // Calculate based on total points if no grade breakdown is provided
            let totalEarnedPoints = 0;
            let totalPossiblePoints = 0;
    
            classObject.assignments.forEach(assignment => {
                if (assignment.graded) {
                    totalEarnedPoints += assignment.earnedPoints;
                    totalPossiblePoints += assignment.totalPoints;
                }
            });
    
            return totalPossiblePoints === 0 ? 0 : (totalEarnedPoints / totalPossiblePoints) * 100;
        } else {
            // Calculate based on weighted categories
            let weightedScoreTotal = 0;
            let weightTotal = 0;
    
            classObject.gradeBreakdown.forEach(category => {
                const categoryName = category.name;
                if (categoryName === 'TOTAL') return; // Skip the total category
    
                const categoryWeight = parseFloat(category.weight.replace('%', '')) / 100;
                let categoryEarnedPoints = 0;
                let categoryTotalPoints = 0;
    
                classObject.assignments.forEach(assignment => {
                    if (assignment.graded && assignment.type.includes(categoryName)) {
                        categoryEarnedPoints += assignment.earnedPoints;
                        categoryTotalPoints += assignment.totalPoints;
                    }
                });
    
                if (categoryTotalPoints > 0) {
                    const categoryPercentage = (categoryEarnedPoints / categoryTotalPoints);
                    weightedScoreTotal += categoryPercentage * categoryWeight;
                }
    
                weightTotal += categoryWeight;
            });
    
            return weightTotal === 0 ? 0 : (weightedScoreTotal / weightTotal) * 100;
        }
    }

    const addAssignment = () => {

        let addName = document.getElementById("addName").value;
        let addPoints = parseInt(document.getElementById("addPoints").value);
        let addOutOf = parseInt(document.getElementById("addOutOf").value);

        let classes = props.classes;

        // Find class from the assignment
        let chosenClass = classes.filter((item) => item.name == selectedClass.name)[0];

        let oldClassScore = chosenClass.score;
        if(typeof oldClassScore == "string"){
            oldClassScore = chosenClass.rawScore;
        }


        // Find the assignment and change the score to the new score
        chosenClass.assignments.unshift({
            "name": addName,
            "id": addName + Math.floor(Math.random() * 10000000),
            "date": new Date().toLocaleDateString(),
            "dueDate": new Date().toLocaleDateString(),
            "score": (addPoints / addOutOf * 100).toFixed(2) + "%",
            "exactScore": `${addPoints}/${addOutOf}`,
            "graded": true,
            "ec": false,
            "type": selectedCatagory,
            "earnedPoints": addPoints,
            "totalPoints": addOutOf,
            "edited": true
        });

        
        // Example usage
        const classPercentage = calculateClassPercentage(chosenClass);
        
        // update the class score
        chosenClass.score = classPercentage.toFixed(3);

        // update the class raw score
        chosenClass.rawScore = classPercentage.toFixed(1)

        chosenClass.amountChanged = (chosenClass.score - oldClassScore).toFixed(2);
        if(chosenClass.amountChanged > 0){
            chosenClass.amountChanged = "+" + chosenClass.amountChanged;
        }

        props.setClasses([...classes]);



    }


    const editAssignment = () => {
        let newPoints = parseInt(selectedAssignment.earnedPoints)
        let newPointsPossible = parseInt(selectedAssignment.totalPoints)
        let assignmentId = selectedAssignment.id;
        
        let classes = props.classes;

        // Find class from the assignment
        let chosenClass = classes.filter((item) => item.assignments.some((item) => item.id == assignmentId))[0];

        let oldClassScore = chosenClass.score;
        if(typeof oldClassScore == "string"){
            oldClassScore = chosenClass.rawScore;
        }

        console.log(`oldClassScore: ${oldClassScore}`);

        // Find the assignment and change the score to the new score
        let chosenAssignment = chosenClass.assignments.filter((item) => item.id == assignmentId)[0];
        chosenAssignment.previousScore = chosenAssignment.earnedPoints;
        chosenAssignment.earnedPoints = newPoints;
        chosenAssignment.totalPoints = newPointsPossible;
        chosenAssignment.edited = true;

        console.log(`newPoints: ${newPoints}`);
        console.log(`assignmentId: ${assignmentId}`);

        
        
        // Example usage
        const classPercentage = calculateClassPercentage(chosenClass);
        
        // update the class score
        chosenClass.score = classPercentage.toFixed(3);

        // update the class raw score
        chosenClass.rawScore = classPercentage.toFixed(1)

        chosenClass.amountChanged = (chosenClass.score - oldClassScore).toFixed(2);
        if(chosenClass.amountChanged > 0){
            chosenClass.amountChanged = "+" + chosenClass.amountChanged;
        }
        console.log(`chosenClass.amountChanged: ${chosenClass.amountChanged}`);

        props.setClasses([...classes]);
        
    };

    const DetermineGradeDisplay = (props) => {

        const classObject = props.classObject;

        if(classObject.amountChanged){
            switch(classObject.amountChanged.charAt(0)){
                case "-":
                    return <span className="text-error">{classObject.amountChanged}</span>
                case "+":
                    return <span className="text-success">{classObject.amountChanged}</span>
            }
        }
        else{
            return <span className="">{classObject.score}</span>
        }

    }


    const ViewCatagories = (props) => {
        let chosenClass = props.chosenClass;

        if(chosenClass.gradeBreakdown.length == 0){
            return (
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-base mt-2 font-bold">no catagories!</h1>
                </div>
            )
        }

        let catagories = chosenClass.gradeBreakdown.filter((item)=>{return item.name != "TOTAL"});

        return (
            <div className="flex flex-col items-center justify-center">
                <div className="overflow-x-auto w-full h-96">
                <table className="table table-sm mt-2">
                    <thead>
                        <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Weight</th>
                        <th>Points (Raw)</th>
                        <th>Points (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                    {catagories.map((item, index) => (
                        <tr>
                            <th>{index + 1}</th>
                            <td>{item.name}</td>
                            <td>{item.weight}</td>
                            <td>{item.points}/{item.totalPoints}</td>
                            <td>{((item.points/item.totalPoints)*100).toFixed(2)}%</td>
                        </tr>
                    ))} 
                     </tbody>
                    </table>
                    </div>
            </div>
        )
    }

    const ViewAssignments = (props) => {
        let chosenClass = props.chosenClass;

        if(chosenClass.assignments.length == 0){
            return (
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-base mt-2 font-bold">no assignments!</h1>
                </div>
            )
        }

        let assignments = chosenClass.assignments

        return (
            <div className="flex flex-col items-center justify-center">
                <div className="overflow-x-auto w-full h-96 myTable">
                <table className="table table-sm mt-2">
                    <thead>
                        <tr>
                        <th>
                            <button onClick={()=>{document.getElementById('assignmentAddModal').showModal()}} data-tip={"Add an Assignment"}  className="tooltip tooltip-right hover:cursor-pointer">
                                <FolderPlusIcon className="w-5 text-blue-600"/>
                            </button>
                        </th>
                        <th>Name</th>
                        <th>Score (Raw)</th>
                        <th>Score (%)</th>
                        <th>Date</th>
                        <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    {assignments.map((item, index) => {
                        const pointsColorized = () => {
                            if(item.edited){
                                return <td> <span data-tip={`Edited - previously ${item.previousScore}`} className="brightness-125 tooltip hover:cursor-default">{item.earnedPoints}</span>/{item.totalPoints}</td>
                            }
                            else{
                                return <td><span className="">{item.earnedPoints}</span>/{item.totalPoints}</td>
                            }
                        }
                        return (
                        <tr>
                            <th>{index + 1}</th>
                            <td>{item.name}</td>
                            {pointsColorized()}
                            <td>{item.score}</td>
                            <td>{item.date}</td>
                            <td><PencilSquareIcon onClick={()=>{document.getElementById("newPoints").value = item.earnedPoints; setSelectedAssignment(item);document.getElementById('assignmentEditModal').showModal()}} className="w-3 hover:brightness-90 hover:cursor-pointer transition-all duration-150 text-blue-500"/></td>
                        </tr>
                    )})} 
                     </tbody>
                    </table>
                    </div>
            </div>
        )
    }

    const SelectorDecider = (props) => {
        switch(viewSelect){
            case "catagories":
                return <ViewCatagories chosenClass={props.chosenClass}/>
            case "assignments":
                return <ViewAssignments chosenClass={props.chosenClass}/>
        }
    }

    const Selector = (props) => {
        return (
            <>
                <div className="w-full mt-4 flex flex-row h-6 bg-gray-800 outline-1 outline-gray-700 outline-double rounded-lg">
                    <button onClick={()=>{setViewSelect("assignments")}} className={viewSelect == "assignments" ? "chooser brightness-90" : "chooser"}>Assignments</button>
                    <button onClick={()=>{setViewSelect("catagories")}} className={viewSelect == "catagories" ? "chooser brightness-90" : "chooser"}>Catagories</button>
                    <button onClick={()=>{setViewSelect("charts")}} className={viewSelect == "charts" ? "chooser brightness-90" : "chooser"}>Charts</button>
                </div>

                <SelectorDecider chosenClass={props.chosenClass}/>
            </>
        )
    }

    return (
        <div>

<dialog id="assignmentAddModal" className="modal modal-bottom">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Add Assignment</h3>
                <h4 className="font-medium">
                <div className="badge badge-outline badge-sm badge-warning gap-2">
                        experimental
                    </div>
                </h4>

                <div className="flex flex-col w-full space-x-4">

                    

                    <label className="w-full flex flex-col">

                        <div className="flex flex-row">

                            <div className="flex flex-col">
                                <div className="label">
                                    <span className="label-text">Assignment Name</span>
                                </div>
                                <input ref={addNameRef} placeholder="Quiz #5" id="addName" type="text" className="input w-36 input-bordered max-w-xs" />
                            </div>
                            
                            <div className="flex flex-col">
                                <div className="label">
                                    <span className="label-text z-40">Assignment Catagory</span>
                                </div>

                                <div className="dropdown mt-auto ml-2" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                                <div tabIndex={3} role="button" className="btn w-36 btn-outline">{selectedCatagory} </div>
                                <ul tabIndex={3} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                    {/* <li><a>Item 1</a></li> */}
                                    {/* <li><a>Item 2</a></li> */}
                                    {
                                        selectedClass.gradeBreakdown.filter((ctg) => ctg.name != "TOTAL").map((item, index) => (
                                            <li><a onClick={()=>{
                                                setSelectedCatagory(item.name);
                                            }}>{item.name}</a></li>
                                        ))
                                    }
                                    {
                                        selectedClass.gradeBreakdown.length == 0 ? <li><a>No catagories</a></li> : null
                                    }
                                </ul>
                                </div>

                            </div>
                        
                            

                        </div>

                        <div className="flex flex-row">

                            <div>
                                <div className="label">
                                    <span className="label-text">Points</span>
                                </div>
                                <input ref={addPointsRef} placeholder="0" id="addPoints" type="number" className="input w-36 input-bordered max-w-xs" />
                            </div>
                        
                            <div className="ml-2">
                                <div className="label">
                                    <span className="label-text">Out of</span>
                                </div>
                                <input ref={addOutOfRef} placeholder="0" id="addOutOf" type="number" className="input w-36 input-bordered max-w-xs" />
                            </div>

                        </div>

                        
                        
                    </label>

                </div>
                
                

                <div className="modal-action">
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button onClick={addAssignment} className="btn">Add</button>
                </form>
                </div>
            </div>
            </dialog>

            {/* ---------------------- */}

            <dialog id="assignmentEditModal" className="modal modal-bottom">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Editing: "{selectedAssignment.name}"</h3>
                <h4 className="font-medium">
                <div className="badge badge-outline badge-sm badge-warning gap-2">
                        experimental
                    </div>
                </h4>
           

                <div className="flex flex-row w-full space-x-4">

                    <label className="form-control w-full max-w-xs flex flex-row">
                        
                        <div>
                            <div className="label">
                                <span className="label-text">Current Pts.</span>
                            </div>
                            <input inputMode={"numeric"} id={"newPoints"} defaultValue={selectedAssignment.earnedPoints} type="text" className="input w-36 input-bordered max-w-xs" />
                        </div>
                       
                        <div className="ml-2">
                            <div className="label">
                                <span className="label-text">Max Pts.</span>
                            </div>
                            <input defaultValue={selectedAssignment.totalPoints} type="text" placeholder="Type here" disabled className="input w-36 input-disabled max-w-xs" />
                        </div>
                        
                    </label>

                </div>
                
                

                <div className="modal-action">
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button onClick={editAssignment} className="btn">Update</button>
                </form>
                </div>
            </div>
            </dialog>

            {/* ---------------------- */}

            {/* <dialog id="classViewModal" className="modal modal-bottom">
                <div className="modal-box">

                    <div className="flex flex-row">

                        <div className="flex flex-col">
                            <h3 className="font-bold text-lg">{selectedClass.name}</h3>
                            <h4 className="font-medium">Period {selectedClass.period} ● <Link className="text-blue-600 underline" href={`mailto:${selectedClass.teacher.email}`}>{selectedClass.teacher.name}</Link> </h4>
                        </div>

                        <div className="flex flex-col ml-auto">
                            <h1 className="font-bold text-3xl ml-auto">{selectedClass.rawScore}% (<DetermineGradeDisplay classObject={selectedClass}/>)</h1>
                        </div>

                    </div>
                   
  
                    <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"/>
                    <Selector chosenClass={selectedClass}/>

                    <div className="modal-action">
                    <form method="dialog">
                        <button className="btn">Close</button>
                    </form>
                    </div>
                </div>
            </dialog> */}

            {/* <dialog id="classViewModal" className="modal modal-bottom sm:max-w-full"> */}
            <dialog id="classViewModal" className="modal modal-bottom sm:max-w-full">
    <div className="modal-box p-4 sm:p-4">

        <div className="flex sm:flex-row flex-col">

            <div className="flex flex-col mb-4 sm:mb-0">
                <h3 className="font-bold text-lg sm:text-lg">{selectedClass.name}</h3>
                <h4 className="font-medium text-md sm:text-md">Period {selectedClass.period} ● <Link className="text-blue-600 underline" href={`mailto:${selectedClass.teacher.email}`}>{selectedClass.teacher.name}</Link> </h4>
            </div>

            <div className="flex flex-col ml-auto">
                <h1 className="font-bold text-3xl sm:text-3xl ml-auto">{selectedClass.rawScore}% (<DetermineGradeDisplay classObject={selectedClass}/>)</h1>
            </div>

        </div>

        <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"/>
        <Selector chosenClass={selectedClass}/>

        <div className="modal-action">
            <form method="dialog">
                <button className="btn w-full sm:w-auto">Close</button>
            </form>
        </div>
    </div>
</dialog>


            {/* <Card className="h-24"> */}
                <Constant
                editAssignment={editAssignment}
                addAssignment={addAssignment}
                setSelectedAssignment={setSelectedAssignment}
                calculateClassPercentage={calculateClassPercentage}
                 selectedClass={selectedClass} setSelectedClass={setSelectedClass} classes={props.classes} height={"26.75"} draggableGraphId={"classView"} index={0}/>   
            {/* </Card> */}

            {/* <DragDropContext onDragStart={()=>{props.setDragType("constant")}} onDragEnd={props.onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided) => (
                    <div className="items-center" {...provided.droppableProps} ref={provided.innerRef}>
                        

                        {provided.placeholder}
                    </div>
                    )}
                </Droppable>
            </DragDropContext> */}

        </div>
        
    )
}