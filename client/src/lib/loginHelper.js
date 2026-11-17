import { redirect } from "react-router-dom";
import api from "./axios";
import { normalizeApiError } from "./errorHelper.js";

async function handleLogin({ email, password }) {
  try {
    const res = await api.post("/login", {
      email,
      password,
    });

    return res.data;
  } catch (err) {
    const status = err?.status;

    if (status === 409) {
      throw redirect("/");
    }

    return normalizeApiError(err);
  }
}

async function loginAction({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  return handleLogin(data);
}

export { loginAction };
