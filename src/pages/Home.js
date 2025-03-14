import React, { useEffect, useState } from "react";
import MovieList from "../components/MovieList";
import { getMovies } from "../api"; // API 불러오기
import "../styles/home.css";
const Home = () => {
  const [latestMovies, setLatestMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const data = await getMovies();
      console.log("📌 최신 영화 데이터:", data); // 데이터 확인용 로그
      setLatestMovies(data);
    };

    fetchMovies();
  }, []);

  return (
    <div className="home">
      <MovieList category="최신개봉작" movies={latestMovies} />
      <MovieList category="SF" movies={latestMovies} />
      <MovieList category="드라마" movies={latestMovies} />
      <MovieList category="코미디" movies={latestMovies} />
    </div>
  );
};

export default Home;
