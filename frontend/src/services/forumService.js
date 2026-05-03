import apiClient from "./apiClient";

export async function getForums(courseId) {
  const { data } = await apiClient.get(`/courses/${courseId}/forums`);
  return data;
}

export async function createForum(courseId, payload) {
  const { data } = await apiClient.post(`/courses/${courseId}/forums`, payload);
  return data;
}

export async function getThreads(forumId) {
  const { data } = await apiClient.get(`/forums/${forumId}/threads`);
  return data;
}

export async function createThread(forumId, payload) {
  const { data } = await apiClient.post(`/forums/${forumId}/threads`, payload);
  return data;
}

export async function getReplies(threadId) {
  const { data } = await apiClient.get(`/threads/${threadId}/replies`);
  return data;
}

export async function createReply(threadId, payload) {
  const { data } = await apiClient.post(`/threads/${threadId}/replies`, payload);
  return data;
}
