import React from "react";
import { useState } from "react";
import { useRef } from "react";

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const name = useRef();
  const email = useRef();
  const password = useRef();

  async function handleSignUp(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: name.current.value,
            email: email.current.value,
            password: password.current.value,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setMessage(data.message);

      name.current.value = "";
      email.current.value = "";
      password.current.value = "";
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSignUp} className="flex flex-col gap-3 w-80">
      <h1 className="text-2xl font-bold">Create Account</h1>

      <label>Name</label>

      <input
        type="text"
        placeholder="Enter your name"
        ref={name}
        className="border p-2 rounded"
      />

      <label>Email</label>

      <input
        type="email"
        placeholder="Enter your email"
        ref={email}
        className="border p-2 rounded"
      />

      <label>Password</label>

      <input
        type="password"
        placeholder="Enter your password"
        ref={password}
        className="border p-2 rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white p-2 rounded"
      >
        {loading ? "Creating..." : "Sign Up"}
      </button>

      {message && <p>{message}</p>}
    </form>
  );
};

export default SignUp;
