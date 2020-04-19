import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import { useAppState, Lesson } from '../../state';

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

    useEffect(() => {
        (async (): Promise<void> => {
            const response = await appState.fetchLessons();
            setLessons(await response.json());
        })();
        // eslint-disable-next-line
    }, []);

    return (
        <div className="teacher-page-container">
            <h1>Lessons</h1>
            <div className="teacher-page-main-container">
                <div className="lesson-stream-view">
                    <span>Lesson stream view</span>
                    <div>{selectedLesson?.name}</div>
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
