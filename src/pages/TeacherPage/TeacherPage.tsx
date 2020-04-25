import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Button } from '@material-ui/core';

import { useAppState, Lesson } from '../../state';
import VideoApp from '../../VideoApp';

import './TeacherPage.css';

interface LessonListProps {
    lessons: Lesson[];
    setSelectedLesson: (lesson: Lesson) => void;
}

const LessonList: React.FC<LessonListProps> = ({
    lessons,
    setSelectedLesson,
}: LessonListProps) => {
    return (
        <div className="lesson-list-container">
            <h2>Upcoming Lessons</h2>
            {lessons.map(lesson => (
                <Card
                    key={lesson.id}
                    className="lesson-card"
                    onClick={(): void => setSelectedLesson(lesson)}
                >
                    <CardContent className="lesson-card-content">
                        <span>{lesson.name}</span>
                        <span>{moment(lesson.date_time).format('HH:mma')}</span>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

const TeacherPage: React.FC = () => {
    const appState = useAppState();

    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

    const [isStartNowSelected, setStartNowSelected] = useState(false);

    const [twilioVideoToken, setTwilioVideoToken] = useState<
        string | undefined
    >(undefined);

    useEffect(() => {
        (async (): Promise<void> => {
            const response = await appState.fetchLessons();
            setLessons(await response.json());
        })();
        // eslint-disable-next-line
    }, []);

    const handleStartLessonClick = async (): Promise<void> => {
        setStartNowSelected(true);

        const twilioToken = await appState.getToken(selectedLesson?.id);
        setTwilioVideoToken(twilioToken);
    };

    return (
        <div className="teacher-page-container">
            <h1>Lessons</h1>
            <div className="teacher-page-main-container">
                <div className="lesson-stream-view">
                    {!selectedLesson && !isStartNowSelected && (
                        <>
                            <div className="instruction-wrapper">
                                <h1>Get started by clicking on a lesson!</h1>
                            </div>
                            <div className="arrow">
                                <div className="curve"></div>
                                <div className="point"></div>
                            </div>
                        </>
                    )}
                    {selectedLesson && !isStartNowSelected && (
                        <div className="start-button">
                            <Button
                                variant="contained"
                                onClick={handleStartLessonClick}
                            >
                                Start {selectedLesson?.name}
                            </Button>
                        </div>
                    )}
                    {isStartNowSelected && (
                        <VideoApp twilioToken={twilioVideoToken} />
                    )}
                </div>
                <LessonList
                    lessons={lessons}
                    setSelectedLesson={setSelectedLesson}
                />
            </div>
        </div>
    );
};

export default TeacherPage;
