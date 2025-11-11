import {useState} from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

function AuthPage() {
    const [showLoginComponent, setShowLoginComponent] = useState(true)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center py-2">
      <div className="w-full max-w-md">
        <div className="text-center mb-12 mt-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">TinyRoute</h1>
          <p className="text-gray-600">Shorten your URLs instantly</p>
        </div>
        <div className="justify-center mt-0">
        {showLoginComponent ? <LoginForm setShowLoginComponent={setShowLoginComponent}/> : <RegisterForm setShowLoginComponent={setShowLoginComponent} />}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
