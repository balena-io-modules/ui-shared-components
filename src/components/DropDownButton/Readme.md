This component implements a Dropdown button using MUI (This can be removed as soon as MUI implements it. Check progress:https://mui.com/material-ui/discover-more/roadmap/#new-components )

```jsx
import { AnalyticsContextProvider } from "../../contexts/AnalyticsContext";
<AnalyticsContextProvider>
  <DropDownButton
    items={[
      {
        eventName: "First action name (analytics)",
        eventProperties: {
          prop: "this is a property I want to track for analytics",
        },
        onClick: () => console.log("first action clicked"),
        children: "first action button title",
        tooltip: "This is a tooltip",
      },
      {
        eventName: "Second action name (analytics)",
        eventProperties: {
          anotherProp: "this is another property I want to track for analytics",
        },
        onClick: async () => await downlaodOS(formModel, downloadUrl),
        children: <>This can also be a component</>,
        disabled: true,
        tooltip:
          "This is disabled because we want to show you how to disable it",
      },
    ]}
  />
</AnalyticsContextProvider>;
```
