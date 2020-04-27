import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';

import './LessonSummary.css';
import {
    Card,
    CardContent,
    TableContainer,
    Table,
    TableRow,
    TableCell,
    TableBody,
    TableHead,
    Button,
} from '@material-ui/core';
import { Lesson, useAppState, LessonStatsResponse } from '../../state';

interface Props {
    selectedLesson: Lesson | null;
}

const LessonSummary: React.FC<Props> = ({ selectedLesson }: Props) => {
    const appState = useAppState();
    const [lessonStats, setLessonStats] = useState<LessonStatsResponse | null>(
        null
    );
    const [contactStudentsSuccess, setContactStudentsSuccess] = useState(false);

    useEffect(() => {
        (async (): Promise<void> => {
            const lessonStatsResponse = await appState.fetchLessonStats(
                selectedLesson?.id
            );

            setLessonStats(await lessonStatsResponse.json());
        })();
        // eslint-disable-next-line
    }, []);

    const handleContactAbsenteesClick = async (): Promise<void> => {
        const absentStudentIds = lessonStats?.absentStudentsDetails?.map(
            absentStudent => absentStudent.id
        );

        await appState.contactAbsentStudents(
            absentStudentIds,
            selectedLesson?.id
        );
        setContactStudentsSuccess(true);
    };

    if (
        lessonStats &&
        lessonStats.numAttendedStudents &&
        lessonStats.numStudentsInClass &&
        lessonStats.percentageAttended &&
        lessonStats.absentStudentsDetails
    ) {
        return (
            <div className="overall-wrapper">
                <h1 className="summary-heading">
                    {selectedLesson?.name} Summary
                </h1>
                <div className="divider-wrapper">
                    <div className="column-wrapper">
                        <Card className="card-wrapper">
                            <CardContent>
                                <div className="stat-wrapper">
                                    <span className="stat-title">
                                        Attendance
                                    </span>
                                    <CountUp
                                        className="large-stat"
                                        duration={2.75}
                                        end={lessonStats.percentageAttended}
                                        suffix="%"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="card-wrapper">
                            <CardContent>
                                <div className="stat-wrapper">
                                    <span className="stat-title">
                                        Number Present
                                    </span>
                                    <span className="large-stat">
                                        {lessonStats?.numAttendedStudents}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="card-wrapper">
                            <CardContent>
                                <div className="stat-wrapper">
                                    <span className="stat-title">
                                        Number Absent
                                    </span>
                                    <span className="large-stat">
                                        {lessonStats.numStudentsInClass -
                                            lessonStats.numAttendedStudents}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="column-wrapper">
                        <h2>Absent Students</h2>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell component="th">
                                            Student Name
                                        </TableCell>
                                        <TableCell component="th" align="right">
                                            Student ID
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {lessonStats.absentStudentsDetails.map(
                                        row => (
                                            <TableRow key={row.first_name}>
                                                <TableCell scope="row">
                                                    {row.first_name}{' '}
                                                    {row.last_name}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {row.id}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Button
                            className="follow-up-cta-button"
                            variant="contained"
                            onClick={handleContactAbsenteesClick}
                        >
                            Contact Absentees
                        </Button>
                        {contactStudentsSuccess && (
                            <h3>Successfully Contacted!</h3>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default LessonSummary;
