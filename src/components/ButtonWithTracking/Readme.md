This button will send analytics in case the analytics context is passed through the provider (AnalyticsProvider).

```jsx
import { AnalyticsContextProvider } from "../../contexts/AnalyticsContext";
<AnalyticsContextProvider>
  <ButtonWithTracking
    eventName="Instructions Copied"
    eventProperties={{ info: "something" }}
    onClick={() => null}
  >
    Track analytics
  </ButtonWithTracking>
</AnalyticsContextProvider>;
```
