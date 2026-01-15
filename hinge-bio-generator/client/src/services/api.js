import axios from "axios";

//const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const getCSRFToken = async () => {
  const response = await axios.get(`${API_BASE_URL}/bio/csrf-token`);
  return response.data.csrfToken;
};

export const generatePromptAnswers = async (formData, selectedPrompts) => {
  try {
    const csrfToken = await getCSRFToken();
    const response = await axios.post(
      `${API_BASE_URL}/bio/generate-prompts`,
      {
        ...formData,
        selectedPrompts,
      },
      {
        headers: {
          "X-CSRF-Token": csrfToken,
        },
      }
    );
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
