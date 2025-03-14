import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/MovieDetail.css";
import { useNavigate } from "react-router-dom";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]); // 필터링된 리뷰
  const [allReviews, setAllReviews] = useState([]); // 전체 리뷰
  const [categoryScores, setCategoryScores] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const navigate = useNavigate();
  const [sortType, setSortType] = useState("latest");

  // useRef 추가
  const categoryRef = useRef(null);
  const emotionRef = useRef(null);

  const categories = [
    { name: "연출", value: "DIRECTING" },
    { name: "연기", value: "ACTING" },
    { name: "음악", value: "OST" },
    { name: "스토리", value: "STORY" },
    { name: "분위기", value: "MOOD" },
    { name: "기타", value: "OTHER" },
  ];

  const handleSortChange = async (type) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/movies/${id}/reviews/filter`,
        {
          params: {
            topic: selectedCategory,
            emotion: selectedEmotion,
            sort: type === "score" ? "rating_desc" : "latest",
          },
        }
      );

      if (response.data?.reviews) {
        setReviews(response.data.reviews);
      }
      setSortType(type);
    } catch (error) {
      console.error("리뷰 정렬 실패:", error);
    }
  };
  const getCategoryCounts = (category) => {
    const positiveCount = allReviews.filter(
      (r) => r.a_t_type === category && r.a_e_type === "POSITIVE"
    ).length;

    const negativeCount = allReviews.filter(
      (r) => r.a_t_type === category && r.a_e_type === "NEGATIVE"
    ).length;

    return { positiveCount, negativeCount };
  };

  const fetchMovieDetail = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8080/movies/${id}`);
      if (response.data) {
        setMovie(response.data);
        // 기본적으로 최신순으로 리뷰 설정 (r_no도 고려)
        const sortedReviews = response.data.reviews
          ? response.data.reviews.sort(
              (a, b) =>
                new Date(b.r_date) - new Date(a.r_date) || b.r_no - a.r_no
            )
          : [];
        setReviews(sortedReviews);
        setAllReviews(response.data.reviews || []);

        const scoreResponse = await axios.get(
          `http://localhost:8080/movies/${id}/category-scores`
        );
        if (scoreResponse.data) {
          setCategoryScores(scoreResponse.data);
        }
      } else {
        setError(true);
      }
    } catch (error) {
      console.error("영화 상세 정보 조회 실패:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMovieDetail();
  }, [fetchMovieDetail]);

  const handleCategoryClick = async (category) => {
    const newCategory = selectedCategory === category ? null : category;
    setSelectedCategory(newCategory);
    categoryRef.current = newCategory; // ref 업데이트
    setSelectedEmotion(null);
    emotionRef.current = null; // ref 업데이트
    setSortType("latest"); // 🔥 분류 변경 시 최신순으로 초기화
    try {
      const response = await axios.get(
        `http://localhost:8080/movies/${id}/reviews/filter`,
        {
          params: {
            topic: newCategory,
            emotion: null,
            sort: "latest", // 🔥 최신순으로 변경
          },
        }
      );

      if (response.data?.reviews) {
        const sortedReviews = response.data.reviews.sort(
          (a, b) => new Date(b.r_date) - new Date(a.r_date) || b.r_no - a.r_no
        );
        setReviews(sortedReviews);
      }
      if (response.data?.categoryScores) {
        setCategoryScores(response.data.categoryScores);
      }
    } catch (error) {
      console.error("필터링 실패:", error);
    }
  };

  const handleCategoryEmotionClick = async (category, emotion) => {
    setSelectedCategory(category);
    categoryRef.current = category; // ref 업데이트
    setSelectedEmotion(emotion);
    emotionRef.current = emotion; // ref 업데이트
    setSortType("latest");
    try {
      const response = await axios.get(
        `http://localhost:8080/movies/${id}/reviews/filter`,
        {
          params: {
            topic: category,
            emotion: emotion,
            sort: "latest", // 🔥 최신순으로 변경
          },
        }
      );

      if (response.data?.reviews) {
        const sortedReviews = response.data.reviews.sort(
          (a, b) => new Date(b.r_date) - new Date(a.r_date) || b.r_no - a.r_no
        );
        setReviews(sortedReviews);
      }
      if (response.data?.categoryScores) {
        setCategoryScores(response.data.categoryScores);
      }
    } catch (error) {
      console.error("필터링 실패:", error);
    }
  };

  const FilterStatus = () => {
    if (!selectedCategory && !selectedEmotion) return null;

    return (
      <div className="filter-status">
        현재 필터:
        {selectedCategory && (
          <span className="filter-tag">
            {categories.find((c) => c.value === selectedCategory)?.name}
          </span>
        )}
        {selectedEmotion && (
          <span className="filter-tag">
            {selectedEmotion === "POSITIVE" ? "좋아요" : "별로예요"}
          </span>
        )}
        <button
          className="clear-filter"
          onClick={() => {
            setSelectedCategory(null);
            categoryRef.current = null;
            setSelectedEmotion(null);
            emotionRef.current = null;
            fetchMovieDetail();
          }}
        >
          초기화
        </button>
      </div>
    );
  };

  if (loading) return <p className="loading-message">로딩 중...</p>;
  if (error || !movie)
    return <p className="error-message">🚨 영화를 찾을 수 없습니다.</p>;

  const posterPath = movie.m_poster
    ? `http://192.168.28.130${movie.m_poster}`
    : "http://via.placeholder.com/200x300?text=No+Image";

  return (
    <div className="movie-detail">
      <div className="movie-content">
        <div className="movie-info-section">
          <div className="poster-container">
            <img src={posterPath} alt={movie.m_name} className="poster" />
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

        <div className="review-add">
          <button
            className="review-add-button"
            onClick={() => {
              const userType = window.confirm(
                "개발자이신가요?\n\n[확인] 개발자\n[취소] 일반 사용자"
              );
              navigate(`/reviewAdd/${id}${userType ? "?dev=true" : ""}`);
            }}
          >
            <h3>리뷰 작성</h3>
            <span>이 영화에 대한 리뷰를 작성해 보세요!</span>
          </button>
        </div>

        <div className="review-analysis">
          <h3>리뷰 분석</h3>
          <div className="categories-container">
            {categories.map((category) => {
              const counts = getCategoryCounts(category.value);
              return (
                <div key={category.value} className="category-box">
                  <div
                    className={`category-title ${
                      selectedCategory === category.value ? "active" : ""
                    }`}
                    onClick={() => handleCategoryClick(category.value)}
                  >
                    {category.name}
                    <div className="category-score">
                      {categoryScores[category.value] &&
                        `★ ${categoryScores[category.value].toFixed(1)}`}
                    </div>
                  </div>
                  <div className="emotion-buttons">
                    <button
                      className={`emotion-btn ${
                        selectedCategory === category.value &&
                        selectedEmotion === "POSITIVE"
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        handleCategoryEmotionClick(category.value, "POSITIVE")
                      }
                    >
                      👍
                      <span className="review-count">
                        {counts.positiveCount}
                      </span>
                    </button>
                    <button
                      className={`emotion-btn ${
                        selectedCategory === category.value &&
                        selectedEmotion === "NEGATIVE"
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        handleCategoryEmotionClick(category.value, "NEGATIVE")
                      }
                    >
                      👎
                      <span className="review-count">
                        {counts.negativeCount}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <FilterStatus />
        </div>

        <div className="sort-container">
          <button
            className={`sort-btn ${sortType === "latest" ? "active" : ""}`}
            onClick={() => handleSortChange("latest")}
          >
            최신순
          </button>
          <button
            className={`sort-btn ${sortType === "score" ? "active" : ""}`}
            onClick={() => handleSortChange("score")}
          >
            별점순
          </button>
        </div>

        <div className="reviews-container">
          <h3>리뷰 목록 {reviews.length > 0 && `(${reviews.length})`}</h3>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.r_no} className="review-item">
                <span>{review.r_date} | </span>
                <span>⭐{review.r_score}</span>
                <p>{review.r_text}</p>
                <div className="review-meta">
                  <span>
                    {categories.find((c) => c.value === review.a_t_type)?.name}
                  </span>
                  <span>| {review.a_e_type === "POSITIVE" ? "👍" : "👎"}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="no-reviews">아직 리뷰가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
