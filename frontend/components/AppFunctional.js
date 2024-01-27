import React, { useState } from "react";

// önerilen başlangıç stateleri
const initialState = {
  message: "",
  email: "",
  steps: 0,
  index: 4,
};

export default function AppFunctional(props) {
  const [state, setState] = useState(initialState);

  function getXY() {
    const x = (state.index % 3) + 1;
    const y = Math.floor(state.index / 3) + 1;
    return { x, y };
  }

  function getXYMesaj() {
    const { x, y } = getXY();
    return `Koordinatlar (${x}, ${y})`;
  }

  function reset() {
    setState(initialState);
  }

  function sonrakiIndex(move) {
    const x = state.index % 3;
    const y = Math.floor(state.index / 3);

    switch (move) {
      case "left":
        return x > 0 ? state.index - 1 : state.index;
      case "up":
        return y > 0 ? state.index - 3 : state.index;
      case "right":
        return x < 2 ? state.index + 1 : state.index;
      case "down":
        return y < 2 ? state.index + 3 : state.index;
      default:
        return state.index;
    }
  }

  function ilerle(move) {
    const nextIndex = sonrakiIndex(move);
    if (nextIndex !== state.index) {
      setState((prev) => ({
        ...prev,
        index: nextIndex,
        steps: state.steps + 1,
        message: "",
      }));
    } else {
      setState((prev) => ({ ...prev, message: `You can't move to ${move}` }));
    }
  }

  function onChange(evt) {
    setState((prev) => ({ ...prev, email: evt.target.value }));
  }

  function onSubmit(evt) {
    evt.preventDefault();
    const data = {
      x: getXY().x,
      y: getXY().y,
      steps: state.steps,
      email: state.email,
    };
    axios
      .post("http://localhost:9000/api/result", data)
      .then((res) => {
        setState((prev) => ({ ...prev, message: res.data.message }));
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMesaj()}</h3>
        <h3 id="steps">{state.steps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div
            key={idx}
            className={`square${idx === state.index ? " active" : ""}`}
          >
            {idx === state.index ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{state.message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={() => ilerle("left")}>
          SOL
        </button>
        <button id="up" onClick={() => ilerle("up")}>
          YUKARI
        </button>
        <button id="right" onClick={() => ilerle("right")}>
          SAĞ
        </button>
        <button id="down" onClick={() => ilerle("down")}>
          AŞAĞI
        </button>
        <button id="reset" onClick={reset}>
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          id="email"
          type="email"
          placeholder="email girin"
          value={state.email}
          onChange={onChange}
        ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
