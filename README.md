# Afya Clinic Stock Console

An internal stock console for a clinic's supplies team — search, filter, sort, view item detail, and correct stock counts. Built for the Savannah Informatics Web Engineer take-home assessment.

## Live Demo

TBD — link added after Section 3 deployment.

## Repository

https://github.com/CHEGEBB/afya-clinic-stock-console

## Tech Stack

- Framework: Next.js, App Router, TypeScript
- Styling: Tailwind CSS v4, CSS-first config using @theme tokens, no tailwind.config.js
- Validation: Zod
- Icons: lucide-react
- State: Zustand for auth/session; everything else described below
- Data source: DummyJSON

## Getting Started (Run Locally)

```

Clone the repo, install dependencies, and run the dev server:

git clone https://github.com/CHEGEBB/afya-clinic-stock-console.git
cd afya-clinic-stock-console
npm install
npm run dev

Open http://localhost:3000 in your browser.

Other scripts:

npm run lint — runs ESLint
npm run format — runs Prettier and writes changes
npm run format:check — runs Prettier in check mode, fails on unformatted files

---
```

## Section 1 — Design

### Components and screens

Afya Clinic Stock Console will feature three different screens, that is, the login screen, the stock list which will serve as the main console, and the item details screen. There will also be several other components, starting with the form which will employ zod for validation. The form will help rectify any mismatches that might arise in the stock. Zod will ensure that the stock input is valid, required, positive, and an integer before the form is validated. This ensures that the api will never receive an accidentally blank, negative or decimal entry. I will also create a search and filter component along with several modal components for error, empty, and success states.

For the login page, the authentication process will involve a username and password combination. After this is completed successfully, the token will be stored and the user will be redirected to the stock list screen, which is the main page and screen. The stock list screen will involve importing and displaying the search and filter component at the top, which involves the search box, category drop-down menu, and sorting button. Below this, there will be an item list with pagination. All items available in the inventory are shown in the item list, based on whichever filters or searches are applied.

The third screen, item detail screen, will appear when a user clicks on an item or follows a link which will be shared in chat by their colleague. It will display details about the item along with its quantity in stock. Item detail will resemble a card and will have action buttons such as Save and Edit. The Edit button will allow the correction of those items which don’t have the same quantity as the one in stock. Once Edit button is clicked, form component is invoked and quantity is updated and then save button is clicked to save the change.

### State — server data, URL state, local UI state

It is best to save the state on the url for filter, search, and sort functionalities. I first considered using local or session storage but using async storage would restrict my approach to link sharing with colleagues as once the link is shared, the other person would see what is saved on their own local storage instead of what I have sent since the local storage differs depending on the device. Saving the data in the url ensures that using query parameters search, filter, sort, and pagination are all consistent; what I see on the screen is what they will see, regardless of if there is an internet problem causing me to refresh the page. If I share the link with a colleague and he opens the link in his device, he would see the same screen as mine because the data is shared through the url.

Login and session information such as access token, refresh token, and currently logged-in user cannot be stored within the url state and ui state as it needs to be accessible through all screens in the entire session. For that reason, I make use of zustand store for this purpose and save it to local storage.

### Data fetching, caching & invalidation

When you perform a search query, choose a filter, or sort by something, the url will automatically include those parameters in the url and will generate a request to get items that satisfy the request. Adding a small timeout via the useEffect hook will help me avoid spamming the api in such a way that every time the user performs a keystroke, a request is generated. Another thing I would address is when the user has a request that hasn't yet finished and, because of some reason, he or she loses their internet connection, but when they reconnect they make a new request, I will ignore the old request so the user never sees old result for a search that has now changed.

As my stock list screen and item detail screen will load the data, for these I would need to have three states, which are loading state, empty state, and error state. As far as loading state is concerned, I would be using skeleton loading. I have used this in most of my other projects, and skeleton loading gives much more assurance to the users that something is actually happening in the background than the usual loading spinner, even though these two can be used together to give better user experience. In case of empty state, I would be showing a modal or screen having a clear message along with an icon such as an svg saying it's empty. In case of an error state, I will be showing a modal having a clear message along with a button for retrying. Particularly in case of no connection error because of the internet failure, as the document states the use of ward tablets with patchy wifi, I will show a modal or banner letting users know their connection dropped, which would be a better user experience than simply letting it fail without telling them.

After clicking on the save button, the user will see the saving state, the request will get fired through PUT or PATCH methods, and success modal will get shown for some seconds then disappear, and the stock quantity count gets updated. The save can also result in the error state, where zod gets used for validation in the form, without losing the input values.

The token expires within no time thus, when a user makes any request, there is the possibility that the request may fail due to expiry of the session rather than redirecting the user back to the login screen, which will not be a good experience for the user, I will use refresh token logic. Here, I will request for a new token and retry the failed request in the background. If refresh token succeeds, the user will never get logged out or failed requests due to expiry of the session.

### Layout, colour, typography

The color scheme for my theme will be emerald green along with a little bit of warm white color to make the design feel safe and assured. For status, error, warning, and success messages, I will use red, amber, and green colors that are universally recognized. Additionally, I will use Lucide React, an icon library that is already integrated within Next.js.

In terms of typography, DM Sans, Rubik, and Outfit are some of the ideal fonts as they are calm yet readable. This means that the font size and font weight will vary based on whether the text is in paragraph form or in heading form. Spacing and layouts will be managed through built-in spacing in Tailwind CSS instead of creating custom ones. I will use Tailwind for layouts as well to make sure that I am able to create an interface that is visible, understandable, and usable.

### Accessibility approach

Everything should be fully operable by just the keyboard and key presses such as Enter and Space should function as click events. I am using semantically correct HTML such as the button tag that will be correctly interpreted by screen readers. I will also ensure that my emerald against warm white colors have sufficient contrast ratio, because my custom color can look good visually but fail in terms of contrast.

In summary, I believe that with the above implemented, Afya Clinic Stock Console will be functional.

### Decision log

Decision: Use URL as storage for searching, filtering, sorting, and pagination. Alternative rejected: Local or session storage. Reasons: The storage is per device; therefore, a link sent to a colleague will have the state of that colleague rather than the state I am viewing, the URL comes with the link, which makes it ideal for sharing, reloading, and reconnection after dropping.

Decision: Debounce search requests using the useEffect hook rather than creating a request on each keystroke. Alternative rejected: Sending a request on each keystroke. Reasons: On a slow or intermittent network, e.g., ward tablets, the user will send requests that will spam the API and give old results since the slow request can resolve later than a faster one.

Decision: Refresh the access token in the background silently and try the failed request again rather than logging out the user if the token expires during the session. Alternative rejected: Redirecting the user to the login page if any 401 error occurs. Reasons: Losing user's place and having to log in again is not a good UX experience, especially for supplies staff in the middle of doing a stock count.

---

## Section 2 — Build

### Required behaviour notes

### Known limitations of the mock API

TBD, for example PUT to /products/:id does not persist server side, and token expiry behaviour.

---

## Code quality & tooling

Formatter: Prettier, configured via .prettierrc. The format:check script runs prettier --check . and fails, non-zero exit, on unformatted files.

Linter: ESLint, based on eslint-config-next, customized rather than left as default. @typescript-eslint/no-unused-vars is set to error to catch dead code and unused imports. react/no-unescaped-entities is disabled, since the app's copy, item names and labels, uses plain English apostrophes and quotes frequently, and escaping every instance hurt readability for no real benefit. This is documented inline in eslint.config.mjs.

Conventional Commits: enforced via commitlint, using @commitlint/config-conventional, wired to a husky commit-msg hook, so it runs locally on every commit, not only in CI. Verified by testing both a rejected non conventional commit message and an accepted one.

.editorconfig: committed at the repo root, UTF-8, LF line endings, 2 space indent, consistent across editors.

---

## Section 3 — Deployment & CI/CD

Public URL: TBD

Deploy branch: TBD

Pipeline: TBD, what it runs and which checks can block a merge.

---

## Section 4 — AI reflection

TBD, answered honestly, per section, once the build is complete
