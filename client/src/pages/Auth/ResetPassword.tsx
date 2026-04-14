import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { supabaseClient } from "../../lib/supabaseClient";
import "./AuthPage.css";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/signin`,
      });

      if (error) throw error;
      setSuccessMessage("Password reset email sent. Please check your inbox.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to send reset email."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-overlay" />
      <header className="auth-nav">
        <Link to="/auth/signin" className="auth-back">
          <ArrowLeft size={16} />
          Back to Sign In
        </Link>
        <div className="auth-brand">LuxeMart</div>
      </header>

      <section className="auth-card">
        <h1>Reset Password</h1>
        <p>Enter your email and we will send you a secure reset link.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email Address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@email.com"
              required
            />
          </label>

          {errorMessage && <p className="auth-message auth-message-error">{errorMessage}</p>}
          {successMessage && <p className="auth-message auth-message-success">{successMessage}</p>}

          <button type="submit" className="auth-submit" disabled={isSubmitting}>
            {isSubmitting ? "Please wait..." : "Send Reset Link"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default ResetPassword;

