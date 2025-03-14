import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/CreateReview.css";

const CreateReview = ({ movie }) => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [showAiResult, setShowAiResult] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);
  const [isDevMode, setIsDevMode] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const categories = [
    { name: "연출", value: "DIRECTING" },
    { name: "연기", value: "ACTING" },
    { name: "음악", value: "OST" },
    { name: "스토리", value: "STORY" },
    { name: "분위기", value: "MOOD" },
    { name: "기타", value: "OTHER" },
  ];

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setIsDevMode(searchParams.get("dev") === "true");
  }, [location]);

  const handleTextChange = (event) => {
    setReviewText(event.target.value);
  };

  const handleSubmit = async () => {
    if (!reviewText.trim()) {
      alert("리뷰를 작성해주세요.");
      return;
    }
    if (rating === 0) {
      alert("평점을 선택해주세요.");
      return;
    }

    const reviewData = {
      m_cd: movie.m_cd,
      r_text: reviewText,
      r_score: rating,
    };

    try {
      if (!isDevMode) {
        axios.post("http://localhost:8080/reviews/add", reviewData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        alert("✅ 리뷰가 성공적으로 등록되었습니다!");
        navigate("/home");
        return;
      }

      setIsAnalyzing(true);
      setShowAiResult(true);

      const response = await axios.post(
        "http://localhost:8080/reviews/add",
        reviewData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("전체 응답 데이터:", response.data);

      if (response.data.aiResult) {
        const { aiResult } = response.data;
        console.log("AI 분석 결과:", aiResult);

        setAiAnalysisResult({
          atType: aiResult.predicted_category,
          aeType: aiResult.predicted_sentiment,
          atScore: aiResult.category_confidence,
          aeScore: aiResult.sentiment_confidence,
        });
      } else {
        console.error("AI 분석 결과가 없습니다.");
        alert("AI 분석 결과를 받아오지 못했습니다.");
      }
    } catch (error) {
      console.error("🚨 리뷰 등록 실패:", error);
      console.error("에러 상세:", error.response?.data);
      alert("🚨 리뷰 등록 중 오류가 발생했습니다.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirm = () => {
    navigate("/home");
  };

  const goBack = () => {
    navigate(-1);
  };

  if (!movie) {
    return null;
  }

  return (
    <div className="review-textarea-container">
      <textarea
        placeholder="리뷰를 작성해주세요."
        value={reviewText}
        onChange={handleTextChange}
      />

      <div className="review-actions">
        <div className="rating-container">
          <span className="rating-label">★</span>
          <div className="rating-buttons">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                className={rating === num ? "active" : ""}
                onClick={() => setRating(num)}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div className="review-submit-actions">
          {!showAiResult ? (
            <>
              <button className="submit-button" onClick={handleSubmit}>
                등록
              </button>
              <button className="back-button" onClick={goBack}>
                이전
              </button>
            </>
          ) : (
            <div className="ai-analysis-result">
              <h3>AI 분류결과</h3>
              {isAnalyzing ? (
                <div className="analyzing-container">
                  <div className="loading-spinner"></div>
                  <p>AI가 리뷰를 분석중입니다...</p>
                </div>
              ) : (
                <>
                  <div>
                    주제:{" "}
                    {
                      categories.find(
                        (c) => c.value === aiAnalysisResult?.atType
                      )?.name
                    }
                  </div>
                  <div>
                    감정:{" "}
                    {aiAnalysisResult?.aeType === "POSITIVE" ? "긍정" : "부정"}
                  </div>
                  <div>주제 점수: {aiAnalysisResult?.atScore?.toFixed(2)}</div>
                  <div>감정 점수: {aiAnalysisResult?.aeScore?.toFixed(2)}</div>
                  <button className="confirm-button" onClick={handleConfirm}>
                    확인
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateReview;
