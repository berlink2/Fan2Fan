import React from "react";
import "./style/signin.css";

export default () => {
  return (
    <form>
      <div class="field">
        <input
          type="email"
          name="email"
          className="input"
          placeholder=""
        ></input>
        <label for="email" class="label">
          Email
        </label>
      </div>
      <div class="field">
        <input
          type="password"
          name="password"
          className="input"
          placeholder=""
        ></input>
        <label for="password" class="label">
          Password
        </label>
      </div>
    </form>
  );
};
