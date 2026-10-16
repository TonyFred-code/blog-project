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
import { Loader, AlertCircle, EyeOff, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Form,
  Link,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const actionData = useActionData();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [inputModified, setInputModified] = useState({
    email: false,
    password: false,
    response: null,
  });
  const isPending = navigation.state === "submitting";
  const serverErrors = (() => {
    if (!actionData)
      return {
        email: [],
        password: [],
        general: null,
      };

    const rawFieldErrors = Array.isArray(actionData.error)
      ? actionData.error
      : [];

    return {
      email: rawFieldErrors.filter((e) => e.field === "email"),
      password: rawFieldErrors.filter((e) => e.field === "password"),
      general:
        !actionData.token && rawFieldErrors.length === 0
          ? actionData.message
          : null,
    };
  })();
  const touched =
    inputModified.response === actionData
      ? inputModified
      : { email: false, password: false };
  const anyTouched = touched.password || touched.email;
  const errors = {
    email: touched.email ? [] : serverErrors.email,
    password: touched.password ? [] : serverErrors.password,
    general: anyTouched ? null : serverErrors.general,
  };

  function handleFormInputChange(fieldName) {
    setInputModified((prev) => {
      const isCurrent = prev.response === actionData;
      if (isCurrent && prev[fieldName]) return prev;

      return {
        email: false,
        password: false,
        ...(isCurrent ? prev : {}),
        response: actionData,
        [fieldName]: true,
      };
    });
  }

  useEffect(() => {
    if (!actionData) return;

    if (actionData.token && actionData.user) {
      login(actionData.user, actionData.token);
      navigate("/");
    }
  }, [actionData, login, navigate]);

  return (
    <>
      <title>Login | Blog App</title>
      <main className="min-h-screen bg-linear-to-br from-background via-primary/5 to-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-8">
            <header className="text-center space-y-4">
              <h1 className="text-3xl font-bold">Welcome Back</h1>
              <p className="text-muted-foreground">
                Please enter your details to continue
              </p>
            </header>

            <Card className="max-w-sm mx-auto shadow-lg m-auto">
              <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>
                  Enter your email below to login to your account
                </CardDescription>
              </CardHeader>

              <Form
                method="post"
                action="/login"
                className="flex flex-col gap-3"
              >
                <CardContent className="space-y-4">
                  {errors.general && (
                    <div className="flex items-center gap-2 rounded-lg bg-destructive/15 p-3 text-sm font-medium text-destructive border border-destructive/20">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{errors.general}</span>
                    </div>
                  )}

                  <FieldGroup>
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
                        onChange={() => handleFormInputChange("email")}
                      />
                      <FieldError errors={errors.email} />
                    </Field>

                    <Field data-invalid={errors.password.length > 0}>
                      <FieldLabel htmlFor="password">
                        Password : <span className="text-destructive">*</span>
                      </FieldLabel>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          id="password"
                          placeholder="Enter your password"
                          required
                          autoComplete="current-password"
                          disabled={isPending}
                          aria-invalid={errors.password.length > 0}
                          className="pr-12"
                          onChange={() => handleFormInputChange("password")}
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
                  </FieldGroup>

                  {/* Link to Register page */}
                  <div className="text-center text-sm text-muted-foreground pt-1">
                    Don&apos;t have an account?{" "}
                    <Link
                      to="/register"
                      className="font-medium text-primary underline underline-offset-4 hover:opacity-80"
                    >
                      Sign up
                    </Link>
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-end">
                  <Button
                    type="submit"
                    disabled={
                      isPending ||
                      errors.email.length > 0 ||
                      errors.password.length > 0
                    }
                  >
                    {isPending ? (
                      <>
                        <span>Loading...</span>
                        <Loader className="animate-spin h-4 w-4 mr-2" />
                      </>
                    ) : (
                      "Login"
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
