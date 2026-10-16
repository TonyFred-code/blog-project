import { AxiosError } from "axios";
import api from "./axios";
import { normalizeApiError } from "./errorHelper.js";

async function handleRegister({ email, password, confirmPassword }) {
  // Client-side validation: match passwords
  if (confirmPassword !== undefined && password !== confirmPassword) {
    return {
      success: false,
      error: [
        {
          field: "confirmPassword",
          message: "Passwords do not match",
        },
      ],
    };
  }

  try {
    const res = await api.post("/register", {
      email,
      password,
    });

    return {
      success: true,
      ...res.data,
    };
  } catch (err) {
    return normalizeApiError(err);
  }
}

async function registerAction({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  return handleRegister(data);
}

export { handleRegister, registerAction };
