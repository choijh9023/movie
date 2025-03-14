import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail"; // ✅ 영화 상세 페이지 추가
import Review from "./pages/Review"; // ✅ 리뷰 페이지
import ReviewAdd from "./pages/reviewAdd"; // ✅ 리뷰 작성 페이지 추가

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} /> {/* 홈 화면 */}
        <Route path="/movie/:id" element={<MovieDetail />} />{" "}
        {/* 영화 상세 페이지 */}
        <Route path="/review/:id" element={<Review />} /> {/* 리뷰 페이지 */}
        <Route path="/reviewAdd/:id" element={<ReviewAdd />} />{" "}
        {/* ✅ 리뷰 작성 페이지 추가 */}
      </Routes>
    </Router>
  );
}

export default App;
