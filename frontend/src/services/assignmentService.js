import apiClient from "./apiClient";

export async function getAssignments(courseId) {
  const { data } = await apiClient.get(`/courses/${courseId}/assignments`);
  return data;
}

export async function createAssignment(courseId, payload) {
  const { data } = await apiClient.post(`/courses/${courseId}/assignments`, payload);
  return data;
}

export async function submitAssignment(assignmentId, payload) {
  const { data } = await apiClient.post(`/assignments/${assignmentId}/submit`, payload);
  return data;
}

export async function getSubmissions(assignmentId) {
  const { data } = await apiClient.get(`/assignments/${assignmentId}/submissions`);
  return data;
}

export async function gradeSubmission(submissionId, payload) {
  const { data } = await apiClient.post(`/submissions/${submissionId}/grade`, payload);
  return data;
}

export async function getStudentSubmissions(studentId) {
  const { data } = await apiClient.get(`/students/${studentId}/submissions`);
  return data;
}

export async function getStudentAverage(studentId) {
  const { data } = await apiClient.get(`/students/${studentId}/average`);
  return data;
}
