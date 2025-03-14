import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ 영화 목록 가져오기
export const getMovies = async () => {
  try {
    const response = await apiClient.get("/movies");
    return response.data || [];
  } catch (error) {
    console.error("❌ API 요청 실패:", error);
    return [];
  }
};

// ✅ 특정 영화 상세 정보 가져오기
export const getMovieDetail = async (id) => {
  try {
    const response = await apiClient.get(`/movies/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ 영화 상세 정보 API 요청 실패:", error);
    return null;
  }
};
