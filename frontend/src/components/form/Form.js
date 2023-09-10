import React, { useEffect, useState } from "react";
import "./form.css";
function Form(props) {
  const [name, setName] = useState("");
  const [isErr, setIsErr] = useState(false);
  const [openGates, setopenGates] = useState(false);
  // const [isLoggedIn, setIsloggedIn] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      props.socket.emit("verifyToken", { token }, (response) => {
        if (response.success) {
          props.resetLoading({ left: null, right: null });
          props.setName(response.message.data.user.name);
        } else {
          props.resetLoading({ left: null, right: null });
        }
      });
    } else {
      props.resetLoading({ left: null, right: null });
    }
  }, []);
  const inputName = (event) => {
    setName(event.target.value);
    if (event.target.value === "") {
      setIsErr(true);
    } else setIsErr(false);
  };
  const joinButtonStyle = {
    boxShadow:
      isErr === false && name !== ""
        ? "-1px -1px 2px #00ff00, -1px 0 10px #00ff00, 1px 0 10px #00ff00, 0 1px 10px #00ff00"
        : "-1px -1px 2px #e60073, -1px 0 10px #e60073, 1px 0 10px #e60073, 0 1px 10px #e60073",

    marginBottom: "1rem",
  };

  const submit = (event) => {
    event.preventDefault();
    const data = { name };
    if (name != "") {
      props.resetLoading({ left: "Load", right: "ing..." }, true);
      props.socket.emit("register", data, (response) => {
        if (response.success) {
          props.resetLoading({ left: null, right: null }, false);
          props.setName(data.name);
          localStorage.setItem("token", response.message.data.token);
        }
      });
    } else {
      props.resetLoading({ left: null, right: null }, false);

      setIsErr(true);
    }
  };
  return (
    <>
      <form className="form" onSubmit={submit}>
        <label htmlFor="name" className="name-label">
          Name
        </label>
        <input className="name" value={name} onChange={inputName} />
        {isErr && <div className="err">Name can't be empty</div>}

        <button className="submit" style={joinButtonStyle}>
          Submit
        </button>
      </form>
    </>
  );
}

export default Form;
