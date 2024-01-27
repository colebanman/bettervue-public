"use client";

import * as React from "react";
import Logo from "../public/logo.png";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerTrigger,
  DrawerFooter,
} from "../components/ui/drawer";
import { Skeleton } from "../components/ui/skeleton";
import { useEffect, useState } from "react";
import MobileDemoImg from "../public/DemoPage.png";

export default function Page() {


  return (
    <div className="h-screen flex flex-col mt-12 items-center text-white">
      <div className="flex flex-row justify-center items-center">
        <img src={Logo.src} className="w-16 h-16" />
        <h1 className="text-4xl font-bold">bettervue</h1>
      </div>
      <p className="text-lg mt-3">A more efficient way to view your grades.</p>




    <img id={"demo2"} src={MobileDemoImg.src} className=" scale-90 mt-8 rounded-md shadow-xl select-none transition-all duration-500 sm:inline-block md:hidden" />

    <Card id={"demo"} className="w-11/12 mt-12 h-[30rem] rounded-md shadow-md shadow-purple-500 select-none transition-all duration-500 hidden sm:hidden md:inline-block">
        <CardContent className="flex flex-row">
          <div className="w-1/2 grid">
            <Card className="mt-6 w-3/4">
              <CardHeader>
                <CardTitle>GPA</CardTitle>
              </CardHeader>
              <CardContent>
                <p>4.0</p>
              </CardContent>
            </Card>

            <Card className="mt-6 w-3/4">
              <CardHeader>
                <CardTitle>Student ID</CardTitle>
              </CardHeader>
              <CardContent>
                <p>000000</p>
              </CardContent>
            </Card>

            <Card className="mt-6 w-3/4">
              <CardHeader>
                <CardTitle>Grade</CardTitle>
              </CardHeader>
              <CardContent>
                <p>11</p>
              </CardContent>
            </Card>
          </div>

          <div className="w-1/2">
            <Card className="w-[110%] h-[26rem] -ml-10 mt-6">
              <CardContent>
                {Array(6)
                  .fill(null)
                  .map((_, index) => {
                    index += 1;
                    return (
                      <Drawer>
                        <DrawerContent>
                          <DrawerHeader>
                            <DrawerTitle>Your Class {index}</DrawerTitle>
                            <DrawerDescription>
                              Your Teacher
                              <Label className="sm:opacity-0 md:opacity-100 float-right text-3xl -mt-8 text-slate-100">
                                A+
                              </Label>
                            </DrawerDescription>
                          </DrawerHeader>

                          <DrawerFooter>
                            <Skeleton className="h-96 w-full text-center justify-center flex items-center fotn-bold">
                              <Label className="text-xl">Your Grades</Label>
                            </Skeleton>
                          </DrawerFooter>

                          <DrawerClose>
                            <Button variant="outline">Cancel</Button>
                          </DrawerClose>
                        </DrawerContent>

                        <DrawerTrigger className="h-14 hover:cursor-pointer rounded-md mt-[0.67rem] w-full bg-primary flex justify-center items-center">
                          <div className="mr-auto ml-4 flex w-full items-center">
                            <Badge>{index}</Badge>
                            <Label className="ml-2 text-black font-medium">
                              Your Class {index}
                            </Label>
                          </div>

                          <div className="flex mr-4 ml-auto justify-center items-center">
                            <Label className="text-black font-medium">A+</Label>
                          </div>
                        </DrawerTrigger>
                      </Drawer>
                    );
                  })}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>



          


      
    </div>
  );
}
