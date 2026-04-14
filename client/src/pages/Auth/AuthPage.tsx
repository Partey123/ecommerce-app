import { useEffect, useMemo, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./AuthPage.css";
import { supabaseClient } from "../../lib/supabaseClient";
import { useAuth } from "../../features/auth/useAuth";

type AuthMode = "signin" | "signup";

type AuthPageProps = {
  initialMode?: AuthMode;
};

const AuthPage = ({ initialMode = "signin" }: AuthPageProps) => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!authLoading && user) {
      navigate("/", { replace: true });
    }
  }, [authLoading, user, navigate]);

  const formTitle = useMemo(
    () => (mode === "signin" ? "Welcome Back" : "Create Your Account"),
    [mode]
  );

  const formSubtitle = useMemo(
    () =>
      mode === "signin"
        ? "Sign in to continue your premium shopping experience."
        : "Join LuxeMart and get access to curated luxury essentials.",
    [mode]
  );

  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleModeSwitch = (nextMode: AuthMode) => {
    setMode(nextMode);
    clearMessages();
  };

  const handleAuthSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearMessages();
    setIsSubmitting(true);

    try {
      if (mode === "signup") {
        if (password !== confirmPassword) {
          setErrorMessage("Passwords do not match.");
          return;
        }

        const { error } = await supabaseClient.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) throw error;
        setSuccessMessage("Account created. Check your email to confirm your account.");
      } else {
        const { error } = await supabaseClient.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        navigate("/", { replace: true });
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Authentication failed. Please try again.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    clearMessages();
    setIsSubmitting(true);

    try {
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Google authentication failed.";
      setErrorMessage(message);
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-overlay" />

      <header className="auth-nav">
        <Link to="/" className="auth-back">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
        <div className="auth-brand">LuxeMart</div>
      </header>

      <motion.section
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="auth-toggle-wrap">
          <button
            className={`auth-toggle ${mode === "signin" ? "active" : ""}`}
            onClick={() => handleModeSwitch("signin")}
            type="button"
          >
            Sign In
          </button>
          <button
            className={`auth-toggle ${mode === "signup" ? "active" : ""}`}
            onClick={() => handleModeSwitch("signup")}
            type="button"
          >
            Sign Up
          </button>
        </div>

        <h1>{formTitle}</h1>
        <p>{formSubtitle}</p>

        <form className="auth-form" onSubmit={handleAuthSubmit}>
          {mode === "signup" && (
            <label>
              Full Name
              <input
                type="text"
                placeholder="Jane Doe"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
              />
            </label>
          )}

          <label>
            Email Address
            <input
              type="email"
              placeholder="name@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {mode === "signup" && (
            <label>
              Confirm Password
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
            </label>
          )}

          {errorMessage && <p className="auth-message auth-message-error">{errorMessage}</p>}
          {successMessage && <p className="auth-message auth-message-success">{successMessage}</p>}

          <button type="submit" className="auth-submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Please wait..."
              : mode === "signin"
                ? "Sign In"
                : "Create Account"}
          </button>

          {mode === "signin" && (
            <Link to="/auth/reset-password" className="auth-inline-link">
              Forgot your password?
            </Link>
          )}
        </form>

        <div className="auth-divider">
          <span>or continue with</span>
        </div>

        <button
          type="button"
          className="auth-google-btn"
          onClick={handleGoogleAuth}
          disabled={isSubmitting}
        >
          <span className="auth-google-icon">G</span>
          {mode === "signin" ? "Sign in with Google" : "Sign up with Google"}
        </button>
      </motion.section>
    </main>
  );
};

export default AuthPage;
