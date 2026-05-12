import { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

function AuthPage() {
  const [showLoginComponent, setShowLoginComponent] = useState(true);

  return (
    <div className="min-h-screen bg-base flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="text-center mb-8 px-4">
          <h1 className="text-3xl font-mono font-semibold text-text-primary tracking-tight">
            tiny<span className="text-accent">route</span>
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            {showLoginComponent
              ? "Welcome back. Log in to continue."
              : "Create an account to start shortening."}
          </p>
        </div>

        <div className="bg-surface border border-border py-8 px-6 shadow-sm sm:rounded-xl sm:px-10 mx-4 sm:mx-0">
          {showLoginComponent ? (
            <LoginForm setShowLoginComponent={setShowLoginComponent} />
          ) : (
            <RegisterForm setShowLoginComponent={setShowLoginComponent} />
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
