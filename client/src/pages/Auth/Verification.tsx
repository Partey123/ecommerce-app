import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabaseClient } from "../../lib/supabaseClient";
import { useAuth } from "../../features/auth/useAuth";
import "./AuthPage.css";

const OTP_LENGTH = 8;

const Verification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [otpDigits, setOtpDigits] = useState<string[]>(Array.from({ length: OTP_LENGTH }, () => ""));
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [hasAutoSubmitted, setHasAutoSubmitted] = useState(false);
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const isVerifyingRef = useRef(false);

  const params = useMemo(() => {
    const queryParams = new URLSearchParams(location.search);
    const hash = location.hash.startsWith("#") ? location.hash.slice(1) : location.hash;
    const hashParams = new URLSearchParams(hash);
    return {
      email: queryParams.get("email") ?? hashParams.get("email"),
      next:
        queryParams.get("next") ??
        hashParams.get("next") ??
        queryParams.get("redirect_to") ??
        hashParams.get("redirect_to"),
    };
  }, [location.hash, location.search]);

  useEffect(() => {
    if (params.email && !email) {
      setEmail(params.email);
    }
  }, [email, params.email]);

  const redirectPath = useMemo(() => {
    if (params.next && params.next.startsWith("/")) {
      return params.next;
    }

    const role =
      (user?.user_metadata?.role as string | undefined) ??
      (user?.app_metadata?.role as string | undefined) ??
      "user";
    return role === "admin" ? "/admin" : "/shop";
  }, [params.next, user]);

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(0, 1);
    setOtpDigits((previous) => {
      const next = [...previous];
      next[index] = digit;
      return next;
    });

    if (digit && index < OTP_LENGTH - 1) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const performVerification = useCallback(
    async (enteredOtp: string) => {
      setErrorMessage("");
      setSuccessMessage("");

      if (enteredOtp.length < OTP_LENGTH) {
        setErrorMessage("Enter the full 8-digit code shown in your email screen.");
        return;
      }

      if (!email.trim()) {
        setErrorMessage("Enter the email used to create your account.");
        return;
      }

      if (isVerifyingRef.current) {
        return;
      }

      isVerifyingRef.current = true;
      setIsSubmitting(true);
      try {
        const { error } = await supabaseClient.auth.verifyOtp({
          email: email.trim(),
          token: enteredOtp,
          type: "signup",
        });

        if (error) throw error;

        setSuccessMessage("Account verified successfully.");
        navigate(redirectPath, { replace: true });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Verification failed. Please request a fresh verification email.";
        setErrorMessage(message);
      } finally {
        setIsSubmitting(false);
        isVerifyingRef.current = false;
      }
    },
    [email, navigate, redirectPath]
  );

  const handleVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || isVerifyingRef.current) {
      return;
    }
    setHasAutoSubmitted(true);
    await performVerification(otpDigits.join(""));
  };

  const handleOtpKeyDown = (index: number, key: string) => {
    if (key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) return;
    event.preventDefault();
    const next = Array.from({ length: OTP_LENGTH }, (_, idx) => pasted[idx] ?? "");
    setOtpDigits(next);
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    otpInputRefs.current[focusIndex]?.focus();
  };

  useEffect(() => {
    const code = otpDigits.join("");
    if (code.length !== OTP_LENGTH || isSubmitting || hasAutoSubmitted) {
      return;
    }

    if (!email.trim()) {
      setErrorMessage("Enter the email used to create your account.");
      return;
    }

    setHasAutoSubmitted(true);
    void performVerification(code);
  }, [
    email,
    hasAutoSubmitted,
    isSubmitting,
    otpDigits,
    performVerification,
  ]);

  useEffect(() => {
    if (otpDigits.join("").length < OTP_LENGTH) {
      setHasAutoSubmitted(false);
    }
  }, [otpDigits]);

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
        <h1>Verify Account</h1>
        <p>
          Enter the 8-digit code sent to your email. We verify with token reading and then continue
          to your dashboard.
        </p>

        <form className="auth-form" onSubmit={handleVerify}>
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

          <div className="auth-otp-row" aria-label="Verification code input">
            {otpDigits.map((digit, index) => (
              <input
                key={`otp-${index}`}
                className="auth-otp-input"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                ref={(node) => {
                  otpInputRefs.current[index] = node;
                }}
                onChange={(event) => handleOtpChange(index, event.target.value)}
                onKeyDown={(event) => handleOtpKeyDown(index, event.key)}
                onPaste={handleOtpPaste}
                required
              />
            ))}
          </div>

          {errorMessage && <p className="auth-message auth-message-error">{errorMessage}</p>}
          {successMessage && <p className="auth-message auth-message-success">{successMessage}</p>}

          <button type="submit" className="auth-submit" disabled={isSubmitting}>
            {isSubmitting ? "Verifying..." : "Verify and Continue"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default Verification;
