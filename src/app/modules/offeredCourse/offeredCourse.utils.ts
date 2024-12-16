import { TSchedule } from "./offeredCourse.interface";

export const hasTimeConflict = (
    assignedSchedules: TSchedule[],
    newSchedule: TSchedule,
) => {
    for (const schedule of assignedSchedules) {
        const existingStartTime = new Date(
            `1970-01-01T${schedule.startTime}:00`,
        ); //10:30
        const existingEndTime = new Date(`1970-01-01T${schedule.endTime}:00`); //12:00
        const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}:00`); //10:30
        const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}:00`); //12:00

        if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
            return true;
        }
    }

    return false;
};
