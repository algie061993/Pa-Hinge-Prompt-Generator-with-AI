import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const generatePromptAnswers = async (formData, selectedPrompts) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/bio/generate-prompts`, {
      ...formData,
      selectedPrompts,
    });
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};