import "./App.css";
import { AppNavigator } from "./AppNavigator";
import UserProvider from "./context/UserContext";

function App() {
  return (
    <UserProvider>
      <AppNavigator />
    </UserProvider>
  );
}

export default App;
