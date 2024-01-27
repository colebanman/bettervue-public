import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { InformationCircleIcon } from '@heroicons/react/24/solid'
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge"
import { Label } from "../../components/ui/label"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../../components/ui/accordion"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "../../components/ui/drawer"
import ClassTable from "./ClassTable";

export default function Constant(props) {    
    if(typeof props.classes == "object"){

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

        return (

            <Card className="w-[full] mt-[1.1rem] self-center h-[29.1rem]">

                <CardContent className="w-full">


                    
                    <div className="flex flex-col w-full h-full">
                        <div className="flex flex-col w-full flex-grow select-none hover:cursor-default overflow-y-auto mt-2 space-y-4">
                            {props.classes.map((item, index) => (
                                <div className="flex flex-row items-center justify-center flex-grow mt-5 h-14" key={index}>
                                    <Drawer>
                                        <DrawerContent>
                                            <DrawerHeader>
                                            <DrawerTitle>{item.name}</DrawerTitle>
                                            <DrawerDescription>
                                                {item.teacher.name}
                                                <Label className="sm:opacity-0 md:opacity-100 float-right text-3xl -mt-8 text-slate-100">{item.score}</Label>
                                            </DrawerDescription>
                                            </DrawerHeader>
                                            <DrawerFooter>

                                            <ClassTable
                                            editAssignment={props.editAssignment}
                                            addAssignment={props.addAssignment}
                                            setSelectedAssignment={props.setSelectedAssignment}
                                            calculateClassPercentage={props.calculateClassPercentage}
                                            
                                            assignments={item.assignments} />

                                            <DrawerClose>
                                                <Button variant="outline">Cancel</Button>
                                            </DrawerClose>
                                            </DrawerFooter>
                                        </DrawerContent>

                                        <DrawerTrigger className="bg-primary hover:cursor-pointer hover:brightness-90 transition-all justify-center flex flex-row text-left w-full text-black h-14 rounded-md">
                                            <div className="w-full h-full flex justify-center items-center">
                                                <div className="mr-auto ml-4 flex flex-row items-center">
                                                    <Badge className={""}>{item.period}</Badge>
                                                    <Label className="ml-2 font-medium w-1/2 truncate md:w-full flex">{item.name.split(" (")[0]}</Label>
                                                    <Label className="inline-block md:hidden">...</Label>
                                                </div>
                                                <div className="ml-auto mr-4 font-medium">
                                                    <h1>{item.rawScore}% (<DetermineGradeDisplay classObject={item} />)</h1>
                                                </div>
                                            </div>
                                        </DrawerTrigger>
                                    
                                    {/* <Button onClick={()=>{props.setSelectedClass(item);document.getElementById('classViewModal').showModal()}} className="btn flex flex-row transition-all duration-300 h-full w-full bg-primary">
                                        <Badge variant={""} className={""}>{item.period}</Badge>
                                        <Label className="ml-2">{item.name.split(" (")[0]}</Label>
                                        <h1 className="ml-auto ">{item.rawScore}% (<DetermineGradeDisplay classObject={item} />)</h1>
                                    </Button> */}

                                    </Drawer>

                                </div>
                            ))}
                        </div>
                    </div>

                    </CardContent>

                
                    </Card>

        )
    }

    if(props.item.value == ""){
        return (
            <div className={`w-full h-48 mb-3 self-center rounded-lg outline-1 outline-gray-700 outline-double hover:outline-gray-500 transition-all duration-150`}
            >
                
                <div className="flex flex-col px-4 h-full">


                    <div className="flex items-center justify-center h-full text-5xl font-bold"> {/* Wrapper div */}
                        <h1 className="text-center truncate">
                            <span className="loading loading-spinner w-16 ml-4"></span>       
                        </h1>
                    </div>

                </div>
               

            </div>
        );
    }


}
