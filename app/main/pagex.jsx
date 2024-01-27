"use client";
import React, { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import Overview from "./Overview.jsx";
import ClassView from "./ClassViewXX.jsx/index.js";
import { Link } from "next/link"

export default function MainDisplay(props) {
    const [loading, setLoading] = useState(true);
    const [studentData, setStudentData] = useState({
        studentName: "",
        studentId: "",
        studentGrade: "",
    });
    const [dragType, setDragType] = useState(null);
    const [marksLoading, setMarksLoading] = useState(true);
    const [classes, setClasses] = useState([{
        "name": "",
        "period": "",
        "score": "",
        "rawScore": "",
        "gradeBreakdown": [],
        "teacher":{
            "name": "",
            "email": "",
        }
    }]);
    const [gpa, setGpa] = useState(null);
    const [constants, setConstants] = useState([
        {
            "title":"id",
            "value":"",
            "type":"constant",
        },
        {
            "title":"grade",
            "value":"",
            "type":"constant",
        },
        {
            "title":"semester gpa (uw)",
            "value":"",
            "type":"constant",
        }
    ]);
    const [items, setItems] = useState([
        {
            "title":"classes",
            "type":"constant",
            "value":"hi",
        }
    ]);
    const [time, setTime] = useState(new Date());

    function generateId(){
        return Math.random().toString(36).substr(2, 9);
    }

    const onDragEnd = result => {
        if (!result.destination) {
            console.log("no destination")
          return;
        }
    
        if (dragType === 'items') {
          const newItems = Array.from(items);
          const [reorderedItem] = newItems.splice(result.source.index, 1);
          newItems.splice(result.destination.index, 0, reorderedItem);
          setItems(newItems);
        } else if (dragType === 'constant') {
          const newConstants = Array.from(constants);
          const [reorderedItem] = newConstants.splice(result.source.index, 1);
          newConstants.splice(result.destination.index, 0, reorderedItem);
          setConstants(newConstants);
        }
        else{
            console.log("no type -", result.type)
        }

        setDragType(null);

    };
   
    useEffect(() => {
        fetch(`/api/getUser`, {
            headers: {
                "x-hash": props.loginHash,
                "Sec-Fetch-Mode": "cors"
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if(data.error){
                    console.log(data.error);
                    toast.error(`Error: ${data.error}`);
                    switch(data.error){
                        case "invalid hash":
                            toast.error("Session expired! Redirecting...");
                            document.cookie = "loginHash=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                            window.location.href = "/login"; // Redirect to login page
                            return;
                        case "no student":
                                toast.error("Session expired! Redirecting...");
                                document.cookie = "loginHash=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                                window.location.href = "/login"; // Redirect to login page
                                return;
                        default:
                            toast.error("Unknown error occurred");
                            return;
                    }
                }
                setStudentData(data);

                // update constants
                let newConstants = constants;
                // filter out id and grade
                
                for(let i = 0; i < newConstants.length; i++){
                    switch(newConstants[i].title){
                        case "id":
                            newConstants[i].value = data.studentId;
                            break;
                        case "grade":
                            newConstants[i].value = data.gradeLevel;
                            break;
                    }
                }

                setConstants([...newConstants]);

                setLoading(false);

                fetch('/api/getOverview')
                .then((res) => res.json())
                .then((gradesData) => {
                    if(gradesData.error){
                        console.log(gradesData.error);
                        toast.error(`Error: ${gradesData.error}`);
                        switch(gradesData.error){
                            case "invalid hash":
                                toast.error("Session expired! Redirecting...");
                                document.cookie = "loginHash=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                                window.location.href = "/login"; // Redirect to login page
                                return;
                            case "no student":
                                    toast.error("Session expired! Redirecting...");
                                    document.cookie = "loginHash=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                                    window.location.href = "/login"; // Redirect to login page
                                    return;
                            default:
                                toast.error("Unknown error occurred");
                                return;
                        }
                    }
                    setClasses(gradesData);

                    // calculate gpa
                    let gradeTotal = 0;
                    let gradeCount = gradesData.length * 4;

                    gradesData.forEach((item) => {
                        
                        let grade = item.score;
                        // remove + and - from grade
                        grade = grade.replace("+", "");
                        grade = grade.replace("-", "");

                        switch(grade){
                            case "A":
                                gradeTotal += 4;
                                break;
                            case "B":
                                gradeTotal += 3;
                                break;
                            case "C":
                                gradeTotal += 2;
                                break;
                            case "D":
                                gradeTotal += 1;
                                break;
                            case "F":
                                gradeTotal += 0;
                                break;
                            default:
                                gradeTotal += 4;
                                break;
                        }

                    })

                    let gpa = (gradeTotal / gradeCount * 4 ) * 1.00;
                    console.log(`gpa: ${gpa}`)

                    setGpa(gpa.toFixed(2));

                    let newConstants = constants;
                    for(let i = 0; i < newConstants.length; i++){
                        switch(newConstants[i].title){
                            case "semester gpa (uw)":
                                newConstants[i].value = gpa;
                                break;
                        }
                    }

                    setConstants([...newConstants]);
                    setMarksLoading(false);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
                
            });
    }, [props.loginHash]);

    if (props.loginHash === null) {
        return (
            <div className="w-4/5 flex flex-row items-center">
                <h1 className="font-bold text-3xl text-gray-200">please login hi
                    <Link href="/login">here</Link>
                </h1>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="w-4/5 flex flex-row items-center justify-center">
                <div className="flex justify-center items-center">
                    <h1 className="font-bold text-3xl text-center text-gray-200">loading</h1>
                    <span className="loading loading-spinner w-8 ml-4"></span>
                </div>
            </div>
        );
    }
    
    return (
        <div className="w-11/12">
            <h1 className="font-bold text-center text-3xl text-gray-200">welcome back, 
            {` ` + studentData.studentName.toLowerCase()}!
            </h1>

            <h1 className="text-center font-mono">
                {time.toLocaleTimeString()} 
            </h1>

            <div className="flex flex-col md:flex-row">

            <div className="w-full md:w-1/3 mt-3">
                <h1 className="text-xl font-semibold underline text-center mb-3">
                    overview
                </h1>

                <Overview onDragEnd={onDragEnd} constants={constants} setDragType={setDragType} />

            </div>

            <div className="w-full md:w-2/3 mt-3 md:ml-3">
                <h1 className="text-xl font-semibold underline text-center mb-3">
                    classes
                </h1>

                <ClassView onDragEnd={onDragEnd} classes={classes} setClasses={setClasses} items={items} setDragType={setDragType} />

            </div>
           
            </div>
        </div>
    );
}
