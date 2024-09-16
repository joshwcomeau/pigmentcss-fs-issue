# Linaria code splitting repro

I noticed that with Linaria + next-with-linaria, the code-splitting isn't quite working properly.

This app has two routes:

- The homepage (`/`)
- The about page (`/`)

Each of these routes has some CSS right within the route component. There is also a shared component with some CSS, `Button`.

To make debugging easier, each component includes a CSS variable identifying the file it came from. For example, on the homepage:

```tsx
const HomeWrapper = styled.div`
  --css-file: homepage;
`;
```

# The problem

When I visit the homepage, I would expect only the CSS from `HomeWrapper` and `Button` to be loaded. The dependency graph would look like:

```
Homepage
└── Button
```

When I run a production build, however, the following CSS file is generated for the homepage:

```css
.bsc0o8j {
  --css-file: button;
  color: #f0f;
}

.h1bdmy7h {
  --css-file: homepage;
}

.a188tdip {
  --css-file: about-page;
}
```

The CSS from the `/about` page is also included, even though the About page is not imported by either the "home" route or the Button. It seems to be crawling back _up_ the tree, loading all components which also import Button:

```
Homepage   About page
      \    /
      Button
```

This issue only occurs when the same reusable component is imported by both routes. If I remove the `import Button`, then it works as expected.

Interestingly, this issue doesn't happen in development, it only happens in production. In development, the CSS file looks like this:

```css
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** css ./node_modules/.pnpm/next@14.2.11_@babel+core@7.25.2_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[13].oneOf[7].use[2]!./node_modules/.pnpm/next@14.2.11_@babel+core@7.25.2_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[13].oneOf[7].use[3]!./node_modules/.pnpm/next-with-linaria@0.7.0_@babel+runtime@7.25.6_@wyw-in-js+babel-preset@0.5.4_typescript@5.6.2__gnzvsvtmakml3zp46f7kry5kxu/node_modules/next-with-linaria/lib/loaders/outputCssLoader.js??ruleSet[1].rules[21].use[0]!./src/components/Button/Button.linaria.module.css ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
.Btn_bsc0o8j {
  --css-file: button;
  color: magenta;
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qb3NodS93b3JrL3RlbXAvbGluYXJpYS1jb2RlLXNwbGl0dGluZy10ZXN0L3NyYy9jb21wb25lbnRzL0J1dHRvbi9CdXR0b24udHN4Il0sIm5hbWVzIjpbIi5CdG5fYnNjMG84aiJdLCJtYXBwaW5ncyI6IkFBT1lBIiwiZmlsZSI6Ii9Vc2Vycy9qb3NodS93b3JrL3RlbXAvbGluYXJpYS1jb2RlLXNwbGl0dGluZy10ZXN0L3NyYy9jb21wb25lbnRzL0J1dHRvbi9CdXR0b24udHN4Iiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHN0eWxlZCB9IGZyb20gJ0BsaW5hcmlhL3JlYWN0JztcblxuZnVuY3Rpb24gQnV0dG9uKHsgY2hpbGRyZW4gfTogeyBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlIH0pIHtcbiAgcmV0dXJuIDxCdG4+e2NoaWxkcmVufTwvQnRuPjtcbn1cblxuY29uc3QgQnRuID0gc3R5bGVkLmJ1dHRvbmBcbiAgLS1jc3MtZmlsZTogYnV0dG9uO1xuICBjb2xvcjogbWFnZW50YTtcbmA7XG5cbmV4cG9ydCBkZWZhdWx0IEJ1dHRvbjtcbiJdfQ==*/
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** css ./node_modules/.pnpm/next@14.2.11_@babel+core@7.25.2_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[13].oneOf[7].use[2]!./node_modules/.pnpm/next@14.2.11_@babel+core@7.25.2_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[13].oneOf[7].use[3]!./node_modules/.pnpm/next-with-linaria@0.7.0_@babel+runtime@7.25.6_@wyw-in-js+babel-preset@0.5.4_typescript@5.6.2__gnzvsvtmakml3zp46f7kry5kxu/node_modules/next-with-linaria/lib/loaders/outputCssLoader.js??ruleSet[1].rules[21].use[0]!./src/app/page.linaria.module.css ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
.HomeWrapper_h1bdmy7h {
  --css-file: homepage;
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qb3NodS93b3JrL3RlbXAvbGluYXJpYS1jb2RlLXNwbGl0dGluZy10ZXN0L3NyYy9hcHAvcGFnZS50c3giXSwibmFtZXMiOlsiLkhvbWVXcmFwcGVyX2gxYmRteTdoIl0sIm1hcHBpbmdzIjoiQUFnQm9CQSIsImZpbGUiOiIvVXNlcnMvam9zaHUvd29yay90ZW1wL2xpbmFyaWEtY29kZS1zcGxpdHRpbmctdGVzdC9zcmMvYXBwL3BhZ2UudHN4Iiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgc3R5bGVkIH0gZnJvbSAnQGxpbmFyaWEvcmVhY3QnO1xuXG5pbXBvcnQgQnV0dG9uIGZyb20gJ0AvY29tcG9uZW50cy9CdXR0b24nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBIb21lKCkge1xuICByZXR1cm4gKFxuICAgIDxIb21lV3JhcHBlcj5cbiAgICAgIEhvbWVwYWdlXG4gICAgICA8YnIgLz5cbiAgICAgIDxCdXR0b24+TWFnZW50YSBCdXR0b248L0J1dHRvbj5cbiAgICAgIDxiciAvPlxuICAgICAgPGEgaHJlZj1cIi9hYm91dFwiPkdvIHRvIGFib3V0IHBhZ2U8L2E+XG4gICAgPC9Ib21lV3JhcHBlcj5cbiAgKTtcbn1cblxuY29uc3QgSG9tZVdyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICAtLWNzcy1maWxlOiBob21lcGFnZTtcbmA7XG4iXX0=*/
```
