
export interface ProgramItem {
    id: number;
    name: string;
    courses: CourseItem[];
}

export interface Syllabus {
    id: number;
    description: string;
}

export interface CourseItem {
    id: number;
    courseNo: string;
    name: string;
    creditHours: number;
    semester: string;
    syllabuses: Syllabus[];
}

export interface Syllabus {
    id: number;
    description: string;
}
