import React, { useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { FolderPlusIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { Loader2 } from "lucide-react";
import Constant from "./ConstantDisplay";

const ClassView = ({ classes, setClasses }) => {
  if (classes.length < 2) {
    return (
      <div className="flwex flex-col text-center items-center justify-center h-48 w-full">
        <h1 className="text-3xl font-bold text-center">Loading...</h1>
        <Loader2 className="mr-2 h-12 w-12 animate-spin" />
      </div>
    );
  }

  const [viewSelect, setViewSelect] = useState("assignments");
  const [selectedClass, setSelectedClass] = useState(classes[0]);
  const [selectedCategory, setSelectedCategory] = useState(
    "Assignment Category"
  );
  const [selectedAssignment, setSelectedAssignment] = useState(
    classes[0].assignments[0]
  );

  const calculateClassPercentage = (classObject) => {
    console.log("calculating class percentage");
    console.log(classObject);
    let totalEarnedPoints = 0;
    let totalPossiblePoints = 0;
    let weightedScoreTotal = 0;
    let weightTotal = 0;

    const calculateTotalPoints = () => {
      classObject.assignments.forEach((assignment) => {
        if (assignment.score !== "Not Graded"){
          totalEarnedPoints += assignment.pointsEarned;
          totalPossiblePoints += assignment.pointsPossible;
        }
      });
    };

    const calculateWeightedPoints = () => {
      classObject.gradeBreakdown.forEach((category) => {
        if (category.name === "TOTAL") return;

        const categoryWeight =
          parseFloat(category.weight.replace("%", "")) / 100;
        let categoryEarnedPoints = 0;
        let categoryTotalPoints = 0;

        classObject.assignments.forEach((assignment) => {
          if (assignment.graded && assignment.type.includes(category.name)) {
            categoryEarnedPoints += assignment.pointsEarned;
            categoryTotalPoints += assignment.pointsPossible;
          }
        });

        if (categoryTotalPoints > 0) {
          const categoryPercentage = categoryEarnedPoints / categoryTotalPoints;
          weightedScoreTotal += categoryPercentage * categoryWeight;
        }

        weightTotal += categoryWeight;
      });
    };

    if (classObject.gradeBreakdown.length === 0) {
      console.log("no categories");
      calculateTotalPoints();
      return totalPossiblePoints === 0
        ? 0
        : ((totalEarnedPoints / totalPossiblePoints) * 100);
    } else {
      console.log("categories");
      calculateWeightedPoints();
      return weightTotal === 0 ? 0 : (weightedScoreTotal / weightTotal) * 100;
    }
  };

  const addAssignment = useCallback(() => {
    let addName = document.getElementById("addName").value;
    let addPoints = parseInt(document.getElementById("addPoints").value);
    let addOutOf = parseInt(document.getElementById("addOutOf").value);


    // Find class from the assignment
    let chosenClass = classes.filter(
      (item) => item.name == selectedClass.name
    )[0];

    let oldClassScore = chosenClass.score;
    if (typeof oldClassScore == "string") {
      oldClassScore = chosenClass.rawScore;
    } else {
      console.log(typeof oldClassScore);
    }

    console.log(`oldClassScore: ${oldClassScore}`);

    // Find the assignment and change the score to the new score
    chosenClass.assignments.unshift({
      name: addName,
      id: addName + Math.floor(Math.random() * 10000000),
      date: new Date().toLocaleDateString(),
      dueDate: new Date().toLocaleDateString(),
      score: ((addPoints / addOutOf) * 100).toFixed(2) + "%",
      exactScore: `${addPoints}/${addOutOf}`,
      graded: true,
      ec: false,
      type: selectedCategory,
      earnedPoints: addPoints,
      totalPoints: addOutOf,
      edited: true,
    });

    // Example usage
    const classPercentage = calculateClassPercentage(chosenClass);

    console.log(`new class %: ${classPercentage}`);

    // update the class score
    chosenClass.score = classPercentage.toFixed(3);

    // update the class raw score
    chosenClass.rawScore = classPercentage.toFixed(1);



    setClasses([...classes]);
  }, [selectedClass, selectedCategory, classes]);

  const editAssignment = useCallback((assignmentToEdit) => {
    console.log("editing assignment");
    console.log(assignmentToEdit);

    let newPoints = parseInt(assignmentToEdit.pointsEarned);
    let newPointsPossible = parseInt(assignmentToEdit.pointsPossible);
    let assignmentId = assignmentToEdit.id;


    // Find class from the assignment
    let chosenClass = classes.filter((item) =>
      item.assignments.some((item) => item.id == assignmentId)
    )[0];

    let oldClassScore = chosenClass.score;
    if (typeof oldClassScore == "string") {
      oldClassScore = chosenClass.rawScore;
    } else {
      console.log(typeof oldClassScore);
    }

    console.log(`oldClassScore: ${oldClassScore}`);

    var chosenAssignment

    // Find the assignment and change the score to the new score
    for(let assignmentNum = 0; assignmentNum < chosenClass.assignments.length; assignmentNum++){
      let item = chosenClass.assignments[assignmentNum];
      if(item.id == assignmentId){
        chosenAssignment = chosenClass.assignments[assignmentNum];
        chosenAssignment.previousScore = chosenAssignment.earnedPoints;
        chosenAssignment.earnedPoints = newPoints;
        chosenAssignment.totalPoints = newPointsPossible;
        chosenAssignment.score = `${((newPoints / newPointsPossible) * 100).toFixed(2)}%`;//`${((newPoints / newPointsPossible) * 100).toFixed(2)
        chosenAssignment.edited = true;
      }
    }

    

    console.log(`newPoints: ${newPoints}`);
    console.log(`assignmentId: ${assignmentId}`);

    // Example usage
    let classPercentage = calculateClassPercentage(chosenClass);
    
    console.log(`new class %: ${classPercentage}`);
    // update the class score
    chosenClass.score = classPercentage.toFixed(3);

    // update the class raw score
    chosenClass.rawScore = classPercentage.toFixed(1);

    classes.forEach((item) => {
      if (item.name == chosenClass.name) {
        item = chosenClass;
      }
    });

    setClasses([...classes]);

    return chosenAssignment;
  }, [classes]);

  const selectorContent = useMemo(() => {
    switch (viewSelect) {
      case "categories":
        return <ViewCategories chosenClass={selectedClass} />;
      case "assignments":
        return <ViewAssignments chosenClass={selectedClass} />;
      default:
        return null;
    }
  }, [viewSelect, selectedClass]);

  return (
    <div>
      <Constant
        editAssignment={editAssignment}
        addAssignment={addAssignment}
        setSelectedAssignment={setSelectedAssignment}
        calculateClassPercentage={calculateClassPercentage}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        classes={classes}
        height={"26.75"}
        draggableGraphId={"classView"}
      />

   </div>
  );
};

ClassView.propTypes = {
  classes: PropTypes.array.isRequired,
  setClasses: PropTypes.func.isRequired,
};

const Selector = ({ setViewSelect, viewSelect, selectedClass }) => {
  return (
    <div className="w-full mt-4 flex flex-row h-6 bg-gray-800 outline-1 outline-gray-700 outline-double rounded-lg">
      <button
        onClick={() => setViewSelect("assignments")}
        className={
          viewSelect === "assignments" ? "chooser brightness-90" : "chooser"
        }
      >
        Assignments
      </button>
      <button
        onClick={() => setViewSelect("categories")}
        className={
          viewSelect === "categories" ? "chooser brightness-90" : "chooser"
        }
      >
        Categories
      </button>
    </div>
  );
};

Selector.propTypes = {
  setViewSelect: PropTypes.func.isRequired,
  viewSelect: PropTypes.string.isRequired,
  selectedClass: PropTypes.object.isRequired,
};

const ViewAssignments = ({ chosenClass }) => {
  if (chosenClass.assignments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-base mt-2 font-bold">No assignments!</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="overflow-x-auto w-full h-96 myTable">
        <table className="table table-sm mt-2">
          <thead>
            <tr>
              <th>
                <button
                  onClick={() => {
                    document.getElementById("assignmentAddModal").showModal();
                  }}
                  data-tip={"Add an Assignment"}
                  className="tooltip tooltip-right hover:cursor-pointer"
                >
                  <FolderPlusIcon className="w-5 text-blue-600" />
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
            {chosenClass.assignments.map((item, index) => (
              <tr key={item.id}>
                <th>{index + 1}</th>
                <td>{item.name}</td>
                <td>
                  {item.edited ? (
                    <span
                      data-tip={`Edited - previously ${item.previousScore}`}
                      className="brightness-125 tooltip hover:cursor-default"
                    >
                      {item.earnedPoints}
                    </span>
                  ) : (
                    <span>{item.earnedPoints}</span>
                  )}
                  /{item.totalPoints}
                </td>
                <td>{item.score}</td>
                <td>{item.date}</td>
                <td>
                  <PencilSquareIcon
                    onClick={() => {
                      document.getElementById("newPoints").value =
                        item.earnedPoints;
                      setSelectedAssignment(item);
                      document
                        .getElementById("assignmentEditModal")
                        .showModal();
                    }}
                    className="w-3 hover:brightness-90 hover:cursor-pointer transition-all duration-150 text-blue-500"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

ViewAssignments.propTypes = {
  chosenClass: PropTypes.object.isRequired,
};

const ViewCategories = ({ chosenClass }) => {
  if (chosenClass.gradeBreakdown.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-base mt-2 font-bold">No categories!</h1>
      </div>
    );
  }

  const categories = chosenClass.gradeBreakdown.filter(
    (item) => item.name !== "TOTAL"
  );

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
            {categories.map((item, index) => (
              <tr key={item.name}>
                <th>{index + 1}</th>
                <td>{item.name}</td>
                <td>{item.weight}</td>
                <td>
                  {item.points}/{item.totalPoints}
                </td>
                <td>{((item.points / item.totalPoints) * 100).toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

ViewCategories.propTypes = {
  chosenClass: PropTypes.object.isRequired,
};

export default ClassView;
