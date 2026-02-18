import axios from "axios";

// Use relative URL so CRA's proxy (package.json "proxy": "http://localhost:5000")
// handles forwarding to the backend. This works for both localhost and Dev Tunnels.
const API_BASE_URL = "/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

const getCSRFToken = async () => {
  const response = await apiClient.get("/bio/csrf-token");
  return response.data.csrfToken;
};

export const generatePromptAnswers = async (formData, selectedPrompts) => {
  try {
    const csrfToken = await getCSRFToken();
    const response = await apiClient.post(
      "/bio/generate-prompts",
      {
        ...formData,
        selectedPrompts,
      },
      {
        headers: {
          "X-CSRF-Token": csrfToken,
        },
      },
    );
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
