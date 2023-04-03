This Link will send analytics in case the analytics context is passed through the provider (AnalyticsProvider).

```jsx
import { AnalyticsContextProvider } from "../../contexts/AnalyticsContext";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

<AnalyticsContextProvider>
  <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={
          <React.Fragment>
            <MUILinkWithTracking href="/">
              Material Link with analytics
            </MUILinkWithTracking>
          </React.Fragment>
        }
      ></Route>
    </Routes>
  </BrowserRouter>
</AnalyticsContextProvider>;
```
