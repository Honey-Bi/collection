import "./App.scss";
import data from "./card.json";
import React, { useEffect, useState, useRef } from "react";

function App() {
  type Size = { width: number; height: number };
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const cardsRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number>(0);

  function activeNext() {
    if (active < data.length - 2) setActive((prev) => prev + 1);
  }
  function activePrev() {
    if (active > 0) setActive((prev) => prev - 1);
  }

  // 화면 초기화
  useEffect(() => {
    handleResize();
  }, []);

  const handleResize = () => {
    // 화면 resize 크기 저장
    setSize({
      width: document.body.clientWidth,
      height: document.body.clientHeight,
    });
  };

  useEffect(() => {
    // 화면 resize 처리 및 키입력 처리
    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyPress);
    };
  });

  const handleKeyPress = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowUp":
      case "ArrowRight":
        activeNext();
        break;
      case "ArrowDown":
      case "ArrowLeft":
        activePrev();
        break;
    }
  };

  function chagngeActive(index: number) {
    if (index === 0) return;
    setActive(index - 1);
  }

  function hex2rgba(hex: string, a: number): string {
    hex = hex.replace(/^#/, "");

    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${a})`;
  }

  let result = [];
  for (let i = 0; i < data.length; i++) {
    let album = [];
    if (Object.keys(data[i]).length > 0) {
      const rgba = hex2rgba(data[i].color!, 0.3);
      let background;
      if (data[i].img)
        background = { backgroundImage: `url(${require("./img/" + data[i].img)})` };
      else background = { backgroundColor: data[i].color };

      album.push(
        <div className="info" key={i}>
          <div className="album">
            <a
              className={`record ${active + 1 === i ? "" : "disable"}`}
              style={background}
              href={data[i].url}
              target="_blank"
              rel="noreferrer"
            >
              <div className="innerRound" style={{ backgroundColor: data[i].color }} />
            </a>
            <div
              className="shadow"
              style={{
                boxShadow: `${rgba} 0px 8px 24px, ${rgba} 0px 16px 56px, ${rgba} 0px 24px 80px`,
              }}
            />
          </div>
          <div className="data-info">
            <div className="title">{data[i].title}</div>
            <div className="type">{data[i].type}</div>
            <div className="date">{data[i].date}</div>
          </div>
          <div className="control">
            <button>
              <svg viewBox="0 0 32 32" width="32px">
                <path d="M5.92 24.096q0 0.832 0.576 1.408t1.44 0.608h4.032q0.832 0 1.44-0.608t0.576-1.408v-16.16q0-0.832-0.576-1.44t-1.44-0.576h-4.032q-0.832 0-1.44 0.576t-0.576 1.44v16.16zM18.016 24.096q0 0.832 0.608 1.408t1.408 0.608h4.032q0.832 0 1.44-0.608t0.576-1.408v-16.16q0-0.832-0.576-1.44t-1.44-0.576h-4.032q-0.832 0-1.408 0.576t-0.608 1.44v16.16z"></path>{" "}
              </svg>
            </button>
            <button>
              <svg viewBox="0 0 32 32" width="32px">
                <path d="M5.92 24.096q0 1.088 0.928 1.728 0.512 0.288 1.088 0.288 0.448 0 0.896-0.224l16.16-8.064q0.48-0.256 0.8-0.736t0.288-1.088-0.288-1.056-0.8-0.736l-16.16-8.064q-0.448-0.224-0.896-0.224-0.544 0-1.088 0.288-0.928 0.608-0.928 1.728v16.16z"></path>
              </svg>
            </button>
            <button>
              <svg
                className="roll"
                fill="none"
                strokeWidth="2"
                viewBox="-5 -5 32 32"
                width="32px"
                height="32px"
                stroke="black"
              >
                <path d="M5 13C5 16.866 8.13401 20 12 20C15.866 20 19 16.866 19 13C19 9.13401 15.866 6 12 6H7M7 6L10 3M7 6L10 9"></path>
              </svg>
            </button>
          </div>
        </div>
      );
    }
    result.push(
      <div
        key={i}
        className={`card ${active === i ? "active" : ""}`}
        style={{
          transformOrigin: `center ${size.height / 2 + 500}px`,
          transform: `rotate(${(i - active) * 45 - 45}deg)`,
          display: `${Math.abs(active - i) < 4 ? "flex" : "none"}`,
        }}
        onClick={() => chagngeActive(i)}
      >
        {album}
      </div>
    );
  }

  // 스크롤 함수
  function rotateWheel(e: React.WheelEvent) {
    // wheel down
    if (e.deltaY > 0) activeNext();
    // wheel up
    else if (e.deltaY < 0) activePrev();
  }

  return (
    <>
      <div className="card-list" ref={cardsRef} onWheel={rotateWheel}>
        {result}
      </div>
      <div className="project-title">111</div>
      <div className="project-info">
        a <br /> collection of
        <br /> interactive <br />
        html 5<br /> experience
      </div>
    </>
  );
}

export default App;
