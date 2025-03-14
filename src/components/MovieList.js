import React, { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import "../styles/MovieList.css";
import { getMovies } from "../api";
import "../styles/Category.css";
import Category from "./Category";

const MovieList = ({ category }) => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const data = await getMovies();
      console.log("📌 API 응답 데이터:", data);
      setMovies(data);
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    if (movies.length > 0) {
      console.log(`📌 현재 카테고리: ${category}`);

      const today = new Date(); // ✅ 현재 날짜
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(today.getMonth() - 1); // ✅ 한 달 전 날짜 계산

      const filtered = movies.filter((movie) => {
        if (category === "최신개봉작") {
          const releaseDate = new Date(movie.m_rd); // ✅ 개봉일을 Date 객체로 변환
          return releaseDate >= oneMonthAgo && releaseDate <= today; // ✅ 개봉일이 한 달 이내인지 확인
        } else {
          return (
            movie.m_genre.trim().toLowerCase() === category.trim().toLowerCase()
          ); // ✅ 장르별 필터링
        }
      });

      console.log("🎬 필터링된 영화:", filtered);
      setFilteredMovies(filtered);
    }
  }, [movies, category]);

  return (
    <div>
      <Category title={category} />

      {filteredMovies.length === 0 ? (
        <p>📌 등록된 영화가 없습니다.</p>
      ) : (
        <div className="movie-container">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.m_no} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieList;
