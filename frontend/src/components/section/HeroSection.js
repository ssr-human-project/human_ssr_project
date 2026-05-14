import "../../styles/section/HeroSection.css";

function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-bg" />
      <div className="hero-inner">
        <div className="hero-content">
          <span className="hero-badge">PET FRIENDLY CAFE</span>
          <h1>
            반려견과 함께하는
            <br />
            특별한 카페 시간
          </h1>
          <p>전국 애견동반 카페를 쉽고 빠르게 찾아보세요.</p>
          <div className="hero-actions">
            <button className="primary-btn">카페 찾아보기 →</button>
            <button className="ghost-btn">지역 둘러보기</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
