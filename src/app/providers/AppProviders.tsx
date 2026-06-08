import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "@/app/store/store";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
}
