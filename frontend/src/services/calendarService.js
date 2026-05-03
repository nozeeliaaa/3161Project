import apiClient from "./apiClient";

export async function getCourseEvents(courseId) {
  const { data } = await apiClient.get(`/courses/${courseId}/events`);
  return data;
}

export async function getStudentEvents(studentId, date) {
  const { data } = await apiClient.get(`/students/${studentId}/events`, {
    params: date ? { date } : {}
  });
  return data;
}

export async function createEvent(courseId, payload) {
  const { data } = await apiClient.post(`/courses/${courseId}/events`, payload);
  return data;
}
