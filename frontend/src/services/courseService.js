import apiClient from "./apiClient";

export async function getCourses() {
  const { data } = await apiClient.get("/courses");
  return data;
}

export async function getStudentCourses(studentId) {
  const { data } = await apiClient.get(`/courses/student/${studentId}`);
  return data;
}

export async function getLecturerCourses(lecturerId) {
  const { data } = await apiClient.get(`/courses/lecturer/${lecturerId}`);
  return data;
}

export async function createCourse(payload) {
  const { data } = await apiClient.post("/courses", payload);
  return data;
}

export async function getCourseMembers(courseId) {
  const { data } = await apiClient.get(`/courses/${courseId}/members`);
  return data;
}

export async function enrollInCourse(courseId) {
  const { data } = await apiClient.post(`/courses/${courseId}/enroll`);
  return data;
}
