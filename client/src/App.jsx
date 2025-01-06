import "./App.css";
import { AppNavigator } from "./AppNavigator";
import UserProvider from "./context/UserContext";
import { Provider } from "react-redux";
import store from "./store/store";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <Provider store={store}>
      <UserProvider>
        <Toaster />
        <AppNavigator />
      </UserProvider>
    </Provider>
  );
}

export default App;
