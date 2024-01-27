"use client";
import React, { useState, useEffect, useCallback } from "react";
import PropTypes from 'prop-types';
import { useToast } from "../../components/ui/use-toast.js";
import Overview from "./Overview.jsx";
import ClassView from "./ClassView.jsx";
import { Link } from "next/link";
import { Button } from "../../components/ui/button.jsx";

const useStudentData = (loginHash, toast) => {
    const [loading, setLoading] = useState(true);
    const [studentData, setStudentData] = useState({
        studentName: "",
        studentId: "",
        studentGrade: "",
    });

    useEffect(() => {
        if (!loginHash) return;

        const fetchData = async () => {
            try {
                const response = await fetch(`/api/getUser`);
                const data = await response.json();

                if (data.error) {
                    handleErrorResponse(data.error);
                } else {
                    setStudentData(data);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error:', error);
                toast({ description: "Network error occurred", variant:"destructive" });
            }
        };

        fetchData();
    }, [loginHash, toast]);

    const handleErrorResponse = useCallback((error) => {
        toast({ description: `Error: ${error}` });
        if (error === "invalid hash" || error === "no student") {
            toast({ description: "Session expired! Redirecting..." });
            document.cookie = "loginHash=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = "/login";
        } else {
            toast({ description: "Unknown error occurred" });
        }
    }, [toast]);

    return { loading, studentData, setStudentData };
};




export default function MainDisplay() {
    const { toast } = useToast();
    const [dragType, setDragType] = useState(null);
    const [marksLoading, setMarksLoading] = useState(true);
    // const [classes, setClasses] = useState([/* initial classes state */]);
    const [classes, setClasses] = useState([
        
    ])

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
    const [items, setItems] = useState([/* initial items state */]);
    const [time, setTime] = useState(new Date());

    const generateId = () => Math.random().toString(36).substr(2, 9);

    const useCookie = (name) => {
        let tempHash = null;
        useEffect(() => {
            const cookieValue = document.cookie.split('; ').find(row => row.startsWith(`${name}=`))?.split('=')[1];
            if (cookieValue) {
                setLoginHash(cookieValue);
                tempHash = cookieValue;
            }
        }, []);
    
    
        return tempHash;
    };

    const [loginHash, setLoginHash] = useState(useCookie('loginHash') || null);
    const { loading, studentData, setStudentData } = useStudentData(loginHash, toast);


    const onDragEnd = (result) => {
        if (!result.destination) {
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

        setDragType(null);
    };

    // Further functions and logic (fetching grades, calculating GPA, etc.)
    const fetchGradesAndCalculateGpa = useCallback(() => {
        fetch('/api/getOverview')
            .then((res) => res.json())
            .then((gradesData) => {
                if (gradesData.error) {
                    toast({ description: `Error: ${gradesData.error}`, variant:"destructive" });
                    // handle specific errors like 'invalid hash' or 'no student'
                } else {
                    setClasses(gradesData);
                    calculateGpa(gradesData);
                    setMarksLoading(false);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                toast({ description: "Error fetching grades", variant:"destructive" });
            });
    }, [toast]);
    
    const calculateGpa = (gradesData) => {
        // Example GPA calculation logic
        let gradeTotal = 0;
        let gradeCount = gradesData.length;
    
        gradesData.forEach((item) => {
            // Add your logic to convert grades to GPA points
            
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

            let gpa = (gradeTotal / gradeCount );

            setGpa(gpa.toFixed(2));

            let newConstants = [...constants]

            for(let i = 0; i < newConstants.length; i++){
                switch(newConstants[i].title){
                    case "semester gpa (uw)":
                        console.log("Changed gpa")
                        newConstants[i].value = gpa;
                        break;
                }
            }

            setConstants([...newConstants]);
            setMarksLoading(false);

        });
    
        let gpa = gradeTotal / gradeCount;
        setGpa(gpa.toFixed(2));
        // Update constants or other state variables as needed
    };
    
    useEffect(() => {
        if (!loading) {
            fetchGradesAndCalculateGpa();
        }
    }, [loading, fetchGradesAndCalculateGpa]);

    const logout = useCallback(() => {
        fetch("/api/login", {
            method: "DELETE"
        }).then((res) => res.json())
        .then((data) => {
            if (data.error) {
                toast({ description: `Error: ${data.error}`, variant:"destructive" });
            }
        }
        ).catch((error) => {
            console.error('Error:', error);
            toast({ description: "Error logging out", variant:"destructive" });
        });

        setTimeout(() => {
            document.cookie = "loginHash=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = "/login";
        }, 1000);

        
    }, []);

    if (!loginHash) {
        return (
            <div className="w-4/5 flex flex-row items-center">
                <h1 className="font-bold text-3xl text-gray-200">please login</h1>
                {/* <Link className="link" href="/login">here</Link> */}

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
            <h1 className="font-bold justify-center items-center text-center text-3xl text-gray-200 flex flex-col">welcome back, 
            {` ` + studentData.studentName.toLowerCase()}!
            
            <Button onClick={logout} className="mt-2 h-8 w-16">
                Logout
            </Button>
            </h1>

            {/* <h1 className="text-center font-mono">
                {time.toLocaleTimeString()} 
            </h1> */}

            

            <hr className="border-gray-500 mb-5 mt-5 " />

            <div className="flex flex-col md:flex-row">

            <div className="w-full md:w-1/3 mt-3">
                <h1 className="text-xl font-semibold underline text-center mb-3">
                    overview
                </h1>

                <Overview onDragEnd={onDragEnd} studentData={studentData} constants={constants} setDragType={setDragType} />

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

MainDisplay.propTypes = {
    loginHash: PropTypes.string,
};
