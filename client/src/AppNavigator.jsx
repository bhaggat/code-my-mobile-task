import { BrowserRouter, Routes, Route, Outlet } from "react-router";

function AuthLayout() {
  return (
    <div>
      <header>Auth Layout</header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
function ProtectedLayout() {
  return (
    <div>
      <header>ProtectedLayout Layout</header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

function Login() {
  return "Login";
}
function Register() {
  return "Register";
}

function Fields() {
  return "Fields";
}
function Forms() {
  return "Forms";
}

function SubmitForm() {
  return "SubmitForm";
}

export function AppNavigator() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<AuthLayout />}>
          <Route index path="login?" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        <Route element={<ProtectedLayout />} path="concerts">
          <Route index path="fields" element={<Fields />} />
          <Route path="forms" element={<Forms />} />
        </Route>
        <Route element={<SubmitForm />} />
      </Routes>
    </BrowserRouter>
  );
}
