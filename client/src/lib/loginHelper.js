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
    return normalizeApiError(err);
  }
}

async function loginAction({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  return handleLogin(data);
}

export { handleLogin, loginAction };
