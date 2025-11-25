import api from "./api";

export const fetchRandomBoards = async (limit = 4) => {
  const { data } = await api.get("/api/v1/boards/recommend/random", {
    params: { limit },
  });
  return data;
};

export function fetchLatestBoards(limit = 5) {
  return api.get(`/boards/new?limit=${limit}`);
}