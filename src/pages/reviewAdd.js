import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/reviewAdd.css";
import CreateReview from "../components/CreateReview";

const ReviewAdd = () => {
  const { id } = useParams(); // URL에서 영화 ID 가져오기
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        console.log("Fetching movie details for ID:", id);
        const response = await axios.get(`http://localhost:8080/movies/${id}`);
        console.log("Fetched movie data:", response.data);
        setMovie(response.data);
      } catch (error) {
        console.error("🚨 영화 정보를 가져오는 중 오류 발생:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetail();
  }, [id]);

  if (loading) return <p className="loading-message">로딩 중...</p>;
  if (error || !movie)
    return <p className="error-message">🚨 영화 정보를 불러올 수 없습니다.</p>;

  return (
    <div className="movie-detail">
      <div className="movie-content">
        {/* 영화 정보 그대로 유지 */}
        <div className="movie-info-section">
          <div className="poster-container">
            <img
              src={`http://192.168.28.130${movie.m_poster}`}
              alt={movie.m_name}
              className="poster"
            />
          </div>
          <div className="info-container">
            <h2>제목: {movie.m_name}</h2>
            <p>
              개요: {movie.m_genre} / {movie.m_nation} / {movie.m_rt}분
            </p>
            <p>개봉: {movie.m_rd}</p>
            <p>평점: ★ ({movie.m_score ? movie.m_score.toFixed(1) : 0} / 5)</p>
            <p>총 리뷰수 : {movie.m_reviewCount || 0}개</p>
            <p>영화의 주요 줄거리: {movie.m_story}</p>
          </div>
        </div>

        {/* ✅ 리뷰 작성 UI 추가 */}
        <div className="review-add">
          <CreateReview movie={movie} />
        </div>
      </div>
    </div>
  );
};

export default ReviewAdd;
