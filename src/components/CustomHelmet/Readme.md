This is just a customization of [react-helmet](https://www.npmjs.com/package/react-helmet) to allow passing meta data using an object instead of manually writing all the HTML.

```jsx
const meta = {
  title: `Balena UI shared components`,
  description: `library to share UI components`,
  properties: {
    "og:title": `Example og title`,
    "og:description": `Example og description`,
  },
};

return (
  <>
    <p>
      This component will only set meta tags, will not display anything. Check
      the code!
    </p>
    <CustomHelmet {...meta} />
  </>
);
```
