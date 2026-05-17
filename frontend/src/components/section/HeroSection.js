import { useNavigate } from "react-router-dom";
import "../../styles/section/HeroSection.css";

function HeroSection() {
  const navigate = useNavigate();

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
            <button className="primary-btn" onClick={() => navigate("/cafes")}>
              카페 찾아보기 →
            </button>

            <button
              className="ghost-btn"
              onClick={() => {
                const section = document.querySelector(".region-section");

                if (section) {
                  section.scrollIntoView({
                    behavior: "smooth",
                  });
                }
              }}
            >
              지역 둘러보기
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
