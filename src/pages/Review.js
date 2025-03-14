import React from "react";
import { useParams } from "react-router-dom";
import "../styles/Review.css";

const Review = () => {
  const { id } = useParams();

  return (
    <div className="review">
      <h2>🎬 영화 리뷰 페이지</h2>
      <p>선택한 영화 ID: {id}</p>
      <p>이곳에서 해당 영화의 리뷰를 작성하거나 볼 수 있어요!</p>
    </div>
  );
};

export default Review;
