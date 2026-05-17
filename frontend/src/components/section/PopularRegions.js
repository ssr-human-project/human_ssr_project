import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/section/PopularRegions.css";

import { getRegions } from "../../api/regionApi";

function PopularRegions() {
  const [regions, setRegions] = useState([]);
  const navigate = useNavigate();

  const settings = {
    dots: false,
    infinite: regions.length > 7,
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

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await getRegions();

        console.log("지역 데이터:", response.data);

        setRegions(response.data);
      } catch (error) {
        console.error("지역 조회 실패", error);
      }
    };

    fetchRegions();
  }, []);

  return (
    <section className="region-section">
      <div className="section-head">
        <div>
          <span className="section-label">LOCATION</span>
          <h2 className="section-title">지역</h2>
          <p className="section-subtitle">
            원하시는 지역의 애견카페를 찾아보세요
          </p>
        </div>
        <button className="more-btn" onClick={() => navigate("/cafes")}>
          전체보기
        </button>
      </div>

      <div className="region-slider-wrap">
        <Slider {...settings} className="region-slider">
          {regions.map((region, index) => (
            <div key={region.regionId} className="region-slide">
              <div
                className="region-card"
                onClick={() => navigate(`/cafes?regionId=${region.regionId}`)}
              >
                <div className={`region-image region-image-${index}`} />
                <span className="region-name">{region.regionName}</span>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}

export default PopularRegions;
