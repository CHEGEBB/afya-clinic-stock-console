# Afya Clinic Stock Console

Afya Clinic Stock Console is an internal stock console for a clinic’s supplies department. The console allows searching, filtering, sorting, viewing the details of an item, and correcting the stock count.

## Live Demo

https://afya-clinic-stock-console.vercel.app/

Test login: username `emilys`, password `emilyspass` or any user from https://dummyjson.com/users

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

### Clone the repo, install dependencies, and run the dev server:

```
git clone https://github.com/CHEGEBB/afya-clinic-stock-console.git
cd afya-clinic-stock-console
```

### Running the app

```
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

Decision: Storage will be done via the url for searching, filtering, sorting, and pagination.
Alternative rejected: Local or session storage.
Reasons: The storage is per device. That means a link shared with a colleague will include the colleague’s state rather than mine, and the URL travels along with the link making it perfect for sharing, reloading, and reconnecting after losing connection.

Decision: De-bounce the search requests using the useEffect hook instead of sending a request for each key stroke.
Alternative rejected: Send a request for each keystroke.
Reasons: When the user is using a slow or unstable network like in ward tablets, he/she will end up sending requests to the API repeatedly and getting old data since the slow request may resolve before the fast one does.

Decision: Refresh access token silently in the background and retry the failed API call rather than logging out the user in case of expiration of the token in the middle of the session.
Alternative rejected: Redirect user to the login page in case of any 401 error.
Reasons: It's por user experience for users to lose their position and log in again, especially for supplies staff who is currently in the process of counting the stock.

Decision: Parse url state via window.location.search and manually parsing the UrlSearchParams instead of Next.js's useSearchParams hook.
Alternative rejected: useSearchParams hook wrapped inside the Suspense boundary.
Reasons: In case the Suspense boundary is not configured correctly, I had faced a number of problems in building/deploying the useSearchParams hook in the past with Vercel.

Decision: If both search and category filters are on at the same time, then the search overrides the category filter.
Alternative rejected: Attempting to implement both the features server-side together.
Reasons: The /products/search endpoint of DummyJSON doesn't have a parameter for categories, so filtering through a category can't be done within a search request, and fetching all data first and filtering it client-side isn't worth it for such a short assignment.

Decision: After a successful stock saving operation, set the item's stock value directly from the response data of the API.
Alternative rejected: Refetch after saving.
Reasons: PUT /products/{id} doesn’t update the product server-side in this mock API implementation, and a subsequent fetch would reset the stock value to what it was before, making the operation appear as though it failed when it didn’t.

## Section 2 — Build

### Required behaviour notes

When signing in, we request a token that expires in 1 minute, that is expiresInMins:1 as required. When the access token expires in the middle of the session, instead of logging out the user and redirecting them to the login page which would be poor user experience, my implementation captures the 401 error and requests for a new access token with the help of the refresh token and retries the initial request on behalf of the user such that they do not get logged out or experience a blank page unless the refresh process fails.

On the stock list page I've used the pagination function which loads 12 items on each page, this page also contains filter by category, sort by and also search box that provides debounce search of 400ms delay. This has been done through url parameters which ensure that even if I reload the page or copy the link and share it to other colleague they would get the same view as mine.

The item detail page was implemented by use of dynamic route /items/[id] that gets the product upon click in the stock list, and even when the link is pasted in the workspace chat, the view opens perfectly even on another device or when the page is reloaded.

As far as stock correction is concerned, I have used zod, which is basically a library for doing form validation. The reason why there is no re-fetch of data in case of saving because the mocked API doesn’t persist the changes on the server-side as I have mentioned in the limitation section below.

I verified the error path manually by temporarily routing a request to /http/500 and ensuring that the error and Retry button are rendering successfully and then reverting the changes before pushing them. I also tested the search input on the throttled "Slow 3G" network in dev tools of my chrome browser.

### Known limitations of the mock API

PUT /products/{id} results in a merged object being returned in the response, but this is not saved on the server side. The application updates the state based on the returned object rather than making another call to avoid silent reverting of the UI to the previous value.

/products/search and /products/category/{slug} are two distinct endpoints; there is no way to use both search and category filter at once in the same call. Search takes precedence over category filter if both of them are used, as shown in the decision log below.

## Code quality & tooling

For formatting, I used Prettier which is configured by the .prettierrc file. I have a format:check script which executes prettier --check . and exits with non-zero exit code when there is any issue with the formatting - this is run in CI to make sure we don't merge the formatting issues.

For linting, I used ESLint with configuration next, but I customized it rather than keeping it default. The @typescript-eslint/no-unused-vars was set to error to find unused variables and unused imports. I turned off react/no-unescaped-entities because the copy in the app - item names, labels etc. uses English apostrophe and quotation marks often, and escaping all of them was not adding much value but making it difficult to read.

For enforcement of Conventional Commits, I used commitlint configured with @commitlint/config-conventional via husky commit-msg hook that gets executed every time I commit locally rather than only in the CI pipeline. This was tested for its proper functionality with messages that were either invalid, which was rejected or valid which was accepted.

To ensure the consistent formatting, I set up the editorconfig file in the root of the repository with the following parameters: UTF-8 encoding, LF line ending and 2-space indentation.

In the course of setting up CI pipeline I encountered a problem because format:check passed locally, on my Windows machine, but failed in the CI, on GitHub Actions. It turned out to be the problem with the line endings since the default in Windows is CRLF and CI is run on Linux with LF line endings due to the endOfLine: "lf" parameter in my .prettierrc file. It was resolved by running npm run format command locally to make sure all files have LF line endings and committing them. Besides, I updated the Node version used in the CI workflow from 20 to 22 due to its deprecation in the GitHub actions that I use.

I spent quite a lot of time on this. I had to google, used Claude and Gemini to better understand the errors I was encountering, and finally everything clicked and I was happy, as I was used to just using the inbuilt code quality tools that come pre-installed when using create-next-app.

## Section 3 — Deployment & CI/CD

Public URL: https://afya-clinic-stock-console.vercel.app/

Deployment Branch: main

Pipeline: GitHub Actions is triggered for every pull request into the main branch and every push to the main branch. The actions include Prettier format:check, ESLint, commitlint check for the commit messages, and Jest test suite run as one job where failure in any of these results in the job failure. Branch protection on the main branch will not allow the merge of pull requests until the job passes. Deployment is automatic from the main branch to Vercel via the Vercel CLI.

## Section 4 — AI reflection

**1. What I used AI for, per section**

Scaffolding & tooling- initial project configuration, Prettier/ESLint/commitlint/husky configuration, debugging actual problems when they arose.

Section 1:Design- I did the write-up of the design and decision log by myself at first. As I have prior experience working with Next.js App Router, I already had a visual representation of how the structure and data flow will work, making it easy for me to think through it myself. AI helped with phrasing and pointed out one gap in my thinking , I didn't mention where auth state was stored even though I already decided to use zustand for that.

Section 2:Build- My first thought for handling url and filter state was to use localStorage. The idea occurred to me before I used claude at all. During our discussions claude showed me that it couldn't be done that way since localStorage is per-device and any shared url between colleagues would show their state, not mine. It influenced my approach to url state which is described in README's decision log.

Section 3:CI/CD- Although I have prior experience with CI/CD pipelines for Github Actions during my Teach2Give attachment, they were based on the use of Docker containerization, which is completely different from deployment via vercel. I queried Claude on how this method was done without using Docker, and he explained that I needed to set up a Vercel token, added to github secrets and variables and re-ran the actions which had previously failed as it couldn't find the token.

Section 4:AI reflection- Written by me .

**2. Tools and workflow**

Claude was my pair programmer for conversation, not a framework driven by any specification. I had worked with Jest previously when doing my attachment at Teach2Give, and when AI suggested Vitest, it was a new thing to me, which I wanted to refute and continue working with Jest through AI rather than take everything AI says. Since I was out of touch with the Jest set-up details, AI came handy in helping me write validation tests and integrate the test script with package.json. My workflow involved one file at a time, build, test, commit and then continue.

**3. Where an AI suggestion improved my work**

My previous experience with CI/CD involved Docker based GitHub Actions setup created when i was on attachment at Teach2Give. I sought help from Claude about how the same would be done in case the deployment process is not Docker based but Vercel based. It explained to me how to create the Vercel token and use Vercel CLI directly in the workflow, which proved much easier for me as compared to the Docker approach I already knew. This workflow also had a couple more steps than the one i had created so referencing the old one from one of my repos proved useless thus AI really improved my work.

**4. Where AI output was wrong**

My initial Zod schema for the stock data was correct, however, the test I wrote for the same was failing because of an assumption that an empty string would result in NaN whereas it results in 0 in JavaScript because of Number(""). Thus, an empty input would validate as a non-stock. I changed the schema to make sure that it includes a .finite() check and corrected the test as well.

At first, AI recommended useSearchParams inside a suspense boundary to get the state from the url. As I had some experience deploying with Vercel in the past, I knew about the danger of using useSearchParams without setting up the suspense boundary perfectly. Therefore, I suggested another method to implement the same logic without using this pattern.

**5. Two decisions I made without AI**

Refusing to use useSearchParams for state management of urls. Having had experience using it in the past, and having caused Vercel deployment issues due to incorrect implementation of the Suspense boundary, I refused to do so myself, before even proposing an alternative solution that did the same thing.

Using the colors of emerald green and warm white for my chosen color scheme, not a default one, or AI suggestion. I was looking for an approach that would evoke feelings of calmness and security, and this would suit well a tool for a clinic which people use every day, so I chose and defined these colors myself as design tokens.

**6. What I'd struggle to defend**

Token Refresh logic in api-client.ts. We are using the authentication endpoints provided by DummyJSON in this example, but in previous examples, I have written the authentication logic for CORS, refresh token, and access token myself and have faced problems there too. This is something that I am aware of but would like to learn further about. The debounce logic used in the stocks list is another example of such logic.
