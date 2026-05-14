import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/section/PopularRegions.css";

const regions = [
  "서울",
  "부산",
  "대구",
  "인천",
  "광주",
  "대전",
  "울산",
  "세종",
  "경기",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
];

function PopularRegions() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 5 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
  };

  return (
    <section className="region-section">
      <div className="section-head">
        <div>
          <span className="section-label">LOCATION</span>
          <h2 className="section-title">지역</h2>
          <p className="section-subtitle">원하시는 지역의 애견카페를 찾아보세요</p>
        </div>
        <button className="more-btn">전체보기</button>
      </div>

      <div className="region-slider-wrap">
        <Slider {...settings} className="region-slider">
          {regions.map((region, index) => (
            <div key={index} className="region-slide">
              <div className="region-card">
                <div className={`region-image region-image-${index}`} />
                <span className="region-name">{region}</span>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}

export default PopularRegions;
