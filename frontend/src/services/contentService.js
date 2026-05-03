import apiClient from "./apiClient";

export async function getCourseContent(courseId) {
  const { data } = await apiClient.get(`/courses/${courseId}/content`);
  return data;
}

export async function createSection(courseId, payload) {
  const { data } = await apiClient.post(`/courses/${courseId}/sections`, payload);
  return data;
}

export async function addSectionItem(sectionId, payload) {
  const { data } = await apiClient.post(`/sections/${sectionId}/items`, payload);
  return data;
}
