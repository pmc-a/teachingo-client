import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Button } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import { useAppState, Lesson } from '../../state';
import VideoApp from '../../VideoApp';

import './StudentPage.css';

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

const StudentPage: React.FC = () => {
    const appState = useAppState();

    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [isSelectedLessonInFuture, setIsSelectedLessonInFuture] = useState(
        false
    );
    const [isSelectedLessonStarted, setIsSelectedLessonStarted] = useState(
        false
    );
    const [isJoinNowSelected, setJoinNowSelected] = useState(false);

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

    useEffect(() => {
        const currentTime = moment();

        if (selectedLesson?.date_time) {
            if (currentTime < moment(selectedLesson.date_time)) {
                setIsSelectedLessonInFuture(true);
            }
        }
    }, [selectedLesson]);

    useEffect(() => {
        const currentTime = moment();

        if (selectedLesson?.date_time) {
            if (currentTime >= moment(selectedLesson.date_time)) {
                setIsSelectedLessonStarted(true);
            }
        }
    }, [selectedLesson]);

    const handleJoinNowClick = async (): Promise<void> => {
        setJoinNowSelected(true);
        setIsSelectedLessonStarted(false);

        const twilioToken = await appState.getToken(selectedLesson?.id);
        setTwilioVideoToken(twilioToken);
    };

    return (
        <div className="student-page-container">
            <h1>Lessons</h1>
            <div className="student-page-main-container">
                <div className="lesson-stream-view">
                    <div>{selectedLesson?.name}</div>
                    {isSelectedLessonInFuture && (
                        <div>
                            This lesson has not started yet, try again later!
                        </div>
                    )}

                    {isSelectedLessonStarted && (
                        <div className="join-button">
                            <Button
                                variant="contained"
                                onClick={handleJoinNowClick}
                            >
                                Join Now
                            </Button>
                        </div>
                    )}

                    {isJoinNowSelected && (
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

export default StudentPage;
