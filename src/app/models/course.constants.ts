import { NzTableFilterList } from "ng-zorro-antd/table"

abstract class AcademicSemesterConstants {
    static readonly SEMESTER_1 = '1st Year 1st Semester'
    static readonly SEMESTER_2 = '1st Year 2nd Semester'
    static readonly SEMESTER_3 = '2nd Year 1st Semester'
    static readonly SEMESTER_4 = '2nd Year 2nd Semester'
    static readonly SEMESTER_5 = '3rd Year 1st Semester'
    static readonly SEMESTER_6 = '3rd Year 2nd Semester'
    static readonly SEMESTER_7 = '4th Year 1st Semester'
    static readonly SEMESTER_8 = '4th Year 2nd Semester'
}

export const listOfSemesterColumnFilter: NzTableFilterList = [
    { text: AcademicSemesterConstants.SEMESTER_1, value: AcademicSemesterConstants.SEMESTER_1 },
    { text: AcademicSemesterConstants.SEMESTER_2, value: AcademicSemesterConstants.SEMESTER_2 },
    { text: AcademicSemesterConstants.SEMESTER_3, value: AcademicSemesterConstants.SEMESTER_3 },
    { text: AcademicSemesterConstants.SEMESTER_4, value: AcademicSemesterConstants.SEMESTER_4 },
    { text: AcademicSemesterConstants.SEMESTER_5, value: AcademicSemesterConstants.SEMESTER_5 },
    { text: AcademicSemesterConstants.SEMESTER_6, value: AcademicSemesterConstants.SEMESTER_6 },
    { text: AcademicSemesterConstants.SEMESTER_7, value: AcademicSemesterConstants.SEMESTER_7 },
    { text: AcademicSemesterConstants.SEMESTER_8, value: AcademicSemesterConstants.SEMESTER_8 },
]
