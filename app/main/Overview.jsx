import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Loader2 } from "lucide-react";

const DisplayItem = ({ title, value }) => (
    <Card className="h-36">
        <CardHeader>
            <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
            {value || value === 0 ? <p>{value}</p> : <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {/* Shows Loader2 when value is "", null, or undefined */}
        </CardContent>
    </Card>
);

export default function Overview({ constants, studentData }) {
    return (
        <div className="items-center grid grid-flow-row h-[30rem]">
            <DisplayItem title="Semester GPA" value={constants[2]?.value} />
            <DisplayItem title="Student ID" value={studentData.studentId} />
            <DisplayItem title="Grade" value={studentData.gradeLevel} />
        </div>
    );
}
