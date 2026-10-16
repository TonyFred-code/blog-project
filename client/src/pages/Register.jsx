import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import useAuth from "@/hooks/useAuth";
import { Loader, AlertCircle, EyeOff, Eye, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Form,
  Link,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const actionData = useActionData();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [inputModified, setInputModified] = useState({
    response: null,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const isPending = navigation.state === "submitting";
  const serverErrors = (() => {
    if (!actionData) {
      return {
        email: [],
        password: [],
        confirmPassword: [],
        general: null,
      };
    }

    const rawFieldErrors = Array.isArray(actionData.error)
      ? actionData.error
      : [];

    return {
      email: rawFieldErrors.filter((e) => e.field === "email"),
      password: rawFieldErrors.filter((e) => e.field === "password"),
      confirmPassword: rawFieldErrors.filter(
        (e) => e.field === "confirmPassword"
      ),
      general:
        !actionData.token && rawFieldErrors.length === 0
          ? actionData.message
          : null,
    };
  })();
  const touched =
    inputModified.response === actionData
      ? inputModified
      : { email: false, password: false, confirmPassword: false };
  const anyTouched =
    touched.email || touched.password || touched.confirmPassword;
  const errors = {
    email: touched.email ? [] : serverErrors.email,
    password: touched.password ? [] : serverErrors.password,
    confirmPassword: touched.password ? [] : serverErrors.confirmPassword,
    general: anyTouched ? null : serverErrors.general,
  };

  useEffect(() => {
    if (!actionData) return;

    if (actionData.token && actionData.user) {
      login(actionData.user, actionData.token);
      navigate("/");
    }
  }, [actionData, navigate, login]);

  function handleInputChange(fieldName) {
    setInputModified((prev) => {
      const isCurrent = prev.response === actionData;
      if (isCurrent && prev[fieldName]) return prev;

      return {
        email: false,
        password: false,
        confirmPassword: false,

        ...(isCurrent ? prev : {}),
        response: actionData,
        [fieldName]: true,
      };
    });
  }

  return (
    <>
      <title>Register | Blog App</title>
      <main className="min-h-screen bg-linear-to-br from-background via-primary/5 to-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-8">
            <header className="text-center space-y-4">
              <h1 className="text-3xl font-bold">Create Account</h1>
              <p className="text-muted-foreground">
                Join to start reading and writing blog posts
              </p>
            </header>

            <Card className="max-w-sm mx-auto shadow-lg m-auto">
              <CardHeader>
                <CardTitle>Sign up for an account</CardTitle>
                <CardDescription>
                  Enter your information below to register
                </CardDescription>
              </CardHeader>

              <Form
                method="post"
                action="/register"
                className="flex flex-col gap-3"
              >
                <CardContent className="space-y-4">
                  {/* General Banner Error */}
                  {errors.general && (
                    <div className="flex items-center gap-2 rounded-lg bg-destructive/15 p-3 text-sm font-medium text-destructive border border-destructive/20">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{errors.general}</span>
                    </div>
                  )}

                  <FieldGroup>
                    {/* Email Input */}
                    <Field data-invalid={errors.email.length > 0}>
                      <FieldLabel htmlFor="email">
                        Email : <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your email"
                        required
                        autoComplete="email"
                        disabled={isPending}
                        aria-invalid={errors.email.length > 0}
                        onChange={() => handleInputChange("email")}
                      />
                      <FieldError errors={errors.email} />
                    </Field>

                    {/* Password Input */}
                    <Field data-invalid={errors.password.length > 0}>
                      <FieldLabel htmlFor="password">
                        Password : <span className="text-destructive">*</span>
                      </FieldLabel>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          id="password"
                          placeholder="Create a password"
                          required
                          autoComplete="new-password"
                          disabled={isPending}
                          aria-invalid={errors.password.length > 0}
                          onChange={() => handleInputChange("password")}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <FieldError errors={errors.password} />
                    </Field>

                    {/* Confirm Password Input */}
                    <Field data-invalid={errors.confirmPassword.length > 0}>
                      <FieldLabel htmlFor="confirmPassword">
                        Confirm Password :{" "}
                        <span className="text-destructive">*</span>
                      </FieldLabel>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          id="confirmPassword"
                          placeholder="Confirm your password"
                          required
                          autoComplete="new-password"
                          disabled={isPending}
                          aria-invalid={errors.confirmPassword.length > 0}
                          onChange={() => handleInputChange("confirmPassword")}
                        />

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={isPending}
                          className="absolute right-0 top-0 h-full"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <FieldError errors={errors.confirmPassword} />
                    </Field>
                  </FieldGroup>

                  <div className="text-center text-sm text-muted-foreground pt-1">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="font-medium text-primary underline underline-offset-4 hover:opacity-80"
                    >
                      Login
                    </Link>
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-end">
                  <Button
                    type="submit"
                    disabled={
                      isPending ||
                      errors.email.length > 0 ||
                      errors.password.length > 0 ||
                      errors.confirmPassword.length > 0
                    }
                  >
                    {isPending ? (
                      <>
                        <span>Registering...</span>
                        <Loader className="animate-spin h-4 w-4 mr-2" />
                      </>
                    ) : (
                      "Register"
                    )}
                  </Button>
                </CardFooter>
              </Form>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
