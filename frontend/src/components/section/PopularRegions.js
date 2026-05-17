import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/section/PopularRegions.css";

import { getRegions } from "../../api/regionApi";

import seoul from "./imges/seoul.jpg";
import busan from "./imges/busan.jpg";
import daegu from "./imges/daegu.jpg";
import incheon from "./imges/incheon.jpg";
import gyeongju from "./imges/gyeongju.jpg";
import daejeon from "./imges/daejeon.jpg";
import ulsan from "./imges/ulsan.jpg";
import sejong from "./imges/sejong.jpg";
import gyeonggi from "./imges/gyeonggi.jpg";
import gangneung from "./imges/gangneung.jpg";
import jeju from "./imges/jeju.jpg";

const regionImages = {
  "seoul.jpg": seoul,
  "busan.jpg": busan,
  "daegu.jpg": daegu,
  "incheon.jpg": incheon,
  "gyeongju.jpg": gyeongju,
  "daejeon.jpg": daejeon,
  "ulsan.jpg": ulsan,
  "sejong.jpg": sejong,
  "gyeonggi.jpg": gyeonggi,
  "gangneung.jpg": gangneung,
  "jeju.jpg": jeju,
};

const fallbackImage =
  "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600";

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
          {regions.map((region) => {
            const image = regionImages[region.imageUrl] || fallbackImage;

            return (
              <div key={region.regionId} className="region-slide">
                <div
                  className="region-card"
                  onClick={() => navigate(`/cafes?regionId=${region.regionId}`)}
                >
                  <div
                    className="region-image"
                    style={{
                      backgroundImage: `url(${image})`,
                    }}
                  />

                  <span className="region-name">{region.regionName}</span>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </section>
  );
}

export default PopularRegions;
