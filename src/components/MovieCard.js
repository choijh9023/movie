import React from "react";
import { Link } from "react-router-dom";
import "../styles/MovieCard.css";

const MovieCard = ({ movie }) => {
  const posterPath = movie.m_poster
    ? `http://192.168.28.130/${encodeURIComponent(movie.m_poster)}`
    : "http://via.placeholder.com/200x300?text=No+Image";

  return (
    <Link to={`/movie/${movie.m_no}`} className="movie-card-link">
      {" "}
      {/* ✅ 상세 페이지로 이동 */} {/* 🔥 기존 URL 유지 */}
      <div className="movie-card">
        <img src={posterPath} alt={movie.m_name} />
        <p>{movie.m_name}</p>
        <div className="movie-info">
          <p>국가: {movie.m_nation}</p>
          <p>개봉일: {movie.m_rd}</p>
          <p>
            평점:{" "}
            {movie.m_score ? `${movie.m_score.toFixed(1)} ⭐` : "평점 없음"}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
