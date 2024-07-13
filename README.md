<p align="center">
  <img src="https://utfs.io/f/26c998a9-e8a2-42e7-a84e-7e3dd8cc9d03-44c9wd.png" width="100" alt="project-logo">
</p>
<p align="center">
    <h1 align="center">Spireo</h1>
</p>
<p align="center">
    <em>Boost your LinkedIn presence using AI</em>
</p>
<p align="center">
	<img src="https://img.shields.io/github/last-commit/dhruvbansal26/spireo-ai?style=default&logo=git&logoColor=white&color=0080ff" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/dhruvbansal26/spireo-ai?style=default&color=0080ff" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/dhruvbansal26/spireo-ai?style=default&color=0080ff" alt="repo-language-count">
<p>
<p align="center">
	<!-- default option, no dependency badges. -->
</p>

<br><!-- TABLE OF CONTENTS -->

<details>
  <summary>Table of Contents</summary><br>

- [ Overview](#-overview)
- [ Features](#-features)
- [ Repository Structure](#-repository-structure)
- [ Modules](#-modules)
- [ Getting Started](#-getting-started)
  - [ Installation](#-installation)
  - [ Usage](#-usage)
  - [ Tests](#-tests)
- [ Project Roadmap](#-project-roadmap)
- [ Contributing](#-contributing)
- [ License](#-license)
- [ Acknowledgments](#-acknowledgments)
</details>
<hr>

## Overview

**Spreio** is a comprehensive software project that allows users to leverage AI and boos their presence on LinkedIn. The platform offers multiple features include post and idea generations, eye-catching carousels and scheduling for posts.

---

## Features

|     | Feature          | Description                                                                                                                                                                                                                           |
| --- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ⚙️  | **Architecture** | The project architecture utilizes a diverse range of dependencies and libraries for various functionalities.                                                                                                                          |
| 🔩  | **Code Quality** | The codebase includes a wide array of libraries and integrations, which might pose challenges for code readability and maintenance. However, the use of TypeScript can contribute to better code quality and consistency.             |
| 🔌  | **Integrations** | Key integrations include Next.js, React, PostgreSQL, Tailwind CSS, and various UI libraries including Aceternity, shad/cn, and MagicUI. These integrations enable the project to leverage a rich ecosystem of tools for frontend dev. |
| ⚡️ | **Performance**  | The performance evaluation requires further analysis based on the specific implementation and optimization strategies employed within the project. Monitoring and optimizing resource usage could enhance overall performance.        |
| 🛡️  | **Security**     | The project uses Auth.js (i.e. NextAuth.js) for authentication of users via the LinkedIn provider. Currently doesn't support any other providers.                                                                                     |
| 📦  | **Dependencies** | Key external libraries and dependencies include Next.js, React, Tailwind CSS, PostgreSQL, and various UI and utility libraries.                                                                                                       |

---

## Repository Structure

```sh
└── spireo-ai/
    ├── README.md
    ├── components.json
    ├── drizzle.config.ts
    ├── dump.rdb
    ├── next.config.js
    ├── package.json
    ├── pnpm-lock.yaml
    ├── postcss.config.cjs
    ├── prettier.config.js
    ├── public
    ├── src
    │   ├── app
    │   ├── components
    │   ├── env.js
    │   ├── lib
    │   ├── middleware.ts
    │   ├── server
    │   ├── store
    │   └── styles
    ├── start-database.sh
    ├── tailwind.config.ts
    └── tsconfig.json
```

---

## Modules

<details closed><summary>src</summary>

| File                                                                                      | Summary                                                                                                                                                                                                                                                                                   |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [middleware.ts](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/middleware.ts) | Implements middleware for authentication and access control based on user tokens in specified routes like /dashboard and APIs. Handles redirection for unauthorized users, ensuring secure access. Configuration includes authorized callbacks and defined route matchers for protection. |
| [env.js](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/env.js)               | Enhances repository structure by defining server and client-side environment variables schemas. Ensures app integrity by validating and setting runtime environment variables, facilitating automatic validation and error handling during the build process.                             |

</details>

<details closed><summary>src.app</summary>

| File                                                                                    | Summary                                                                                                                                                                                                                                   |
| --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [layout.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/layout.tsx) | Defines the layout for Spireo app, including metadata, fonts, and footer integration. Enhances user experience by providing consistent styling and navigation elements across the application.                                            |
| [page.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/page.tsx)     | Defines homepage layout with modular sections like Navbar, Hero, Image, New Features, Testimonials, Pricing, and Call to Action. Utilizes components for easy maintenance and scalability within the repositorys structured architecture. |

</details>

<details closed><summary>src.server</summary>

| File                                                                                   | Summary                                                                                                                                                                                                                                                                                                                                              |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [redis.ts](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/server/redis.ts) | Implements Redis functions for job management in Bull queue. Defines key structure, saves job ID, retrieves job ID, and deletes job ID in Redis. Facilitates efficient job tracking and storage within the systems architecture.                                                                                                                     |
| [auth.ts](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/server/auth.ts)   | Defines authentication options for Next.js app with LinkedIn integration. Customizes user session and JWT token structure. Utilizes DrizzleAdapter for database operations. Implements callback functions for user and session handling. Configures LinkedInProvider with specified settings. Exposes method for accessing server-side auth session. |

</details>

<details closed><summary>src.styles</summary>

| File                                                                                         | Summary                                                                                                                                                                                         |
| -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [globals.css](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/styles/globals.css) | Defines global design tokens for light and dark themes, setting color variables and styles. Enhances consistency and maintainability across UI components by centralizing design system values. |

</details>

<details closed><summary>src.components</summary>

| File                                                                                                                 | Summary                                                                                                                                                                                                                                                                              |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [color-input.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/color-input.tsx)             | Enables interactive color selection within input fields through a sleek UI component. Integrates color picker functionality for real-time updates. Essential for enhancing user experience in form input customization.                                                              |
| [generated-content.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/generated-content.tsx) | Generates dynamic content for displaying LinkedIn posts, including text parsing and draft creation. Handles loading states, errors, and post editing functionality within the parent repositorys front-end architecture.                                                             |
| [post-formatter.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/post-formatter.tsx)       | Enables selecting and displaying post formats categorized by theme for content creation. Allows users to interactively choose a template and trigger the selection of a specific post format. Supports dynamic rendering of templates and interaction with a Use Post Format button. |
| [secondary-navbar.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/secondary-navbar.tsx)   | Enhances UI with secondary navigation and company logo display. Utilizes Next.js Image component, Lucide icons, and NextAuth for user authentication. Facilitates seamless navigation and sign-out functionality within the web application.                                         |
| [sidebar.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/sidebar.tsx)                     | Enables** sidebar navigation **with** dynamic links **for** AI tools, content, **and** settings. **Handles** sidebar toggle **and** sign-out feature **to** enhance user experience **in\*\* the app interface.                                                                      |

</details>

<details closed><summary>src.lib</summary>

| File                                                                                | Summary                                                                                                          |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| [utils.ts](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/lib/utils.ts) | Combines CSS classes using Tailwind CSS utilities and Classnames for cleaner styling in the projects components. |

</details>

<details closed><summary>src.store</summary>

| File                                                                                          | Summary                                                                                                                                                                                                         |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [postStore.ts](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/store/postStore.ts) | Enables managing and retrieving post data in the app state with unique IDs. Offers functionality to add, update, get, and clear posts. Enhances state management for posts within the overarching architecture. |

</details>

<details closed><summary>src.app.types</summary>

| File                                                                                      | Summary                                                                                                                                                                           |
| ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [types.ts](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/types/types.ts) | Defines the structure for slides, including title, description, styling options, colors, and background. Essential for managing content display within the SPiREO AI application. |

</details>

<details closed><summary>src.app.actions</summary>

| File                                                                                        | Summary                                                                                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [draft.ts](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/actions/draft.ts) | Implements functions to save, fetch, schedule, and delete drafts, enforcing user authentication and status checks. Interacts with a database to manage draft creation, updates, and deletions within a backend system.                         |
| [idea.ts](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/actions/idea.ts)   | Implements CRUD operations for ideas in the database, ensuring data integrity and user authentication. Enables saving, fetching, and deleting ideas with success/failure messages. Enhances user experience by managing idea data efficiently. |
| [user.ts](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/actions/user.ts)   | Implements user-related actions by retrieving user information from the server and database. Functions include fetching user ID, user data, LinkedIn ID, and access token based on the user ID.                                                |

</details>

<details closed><summary>src.app.(private).dashboard</summary>

| File                                                                                                          | Summary                                                                                                                                                                                                                |
| ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [layout.tsx](<https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/(private)/dashboard/layout.tsx>) | Defines DashboardLayout component with Sidebar and SecondaryNavbar for a cohesive dashboard experience. Integrates with React to render a user-friendly layout structure within the repositorys frontend architecture. |
| [page.tsx](<https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/(private)/dashboard/page.tsx>)     | Establish client-side rendering state and display Getting Started content conditionally based on client status in the DashboardPage component.                                                                         |

</details>

<details closed><summary>src.app.(private).dashboard.saved</summary>

| File                                                                                                            | Summary                                                                                                                                                                                                                                           |
| --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [page.tsx](<https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/(private)/dashboard/saved/page.tsx>) | Displays saved content from ideas and drafts, allowing users to switch between tabs. Fetches and lists ideas or drafts with create, edit, and delete options. Handles loading states and errors efficiently. Promotes seamless user interactions. |

</details>

<details closed><summary>src.app.(private).dashboard.post</summary>

| File                                                                                                           | Summary                                                                                                                                                                                                        |
| -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [page.tsx](<https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/(private)/dashboard/post/page.tsx>) | Empowers users to create posts using AI. Displays Repurpose and Template categories with customizable cards for different post types. Promotes content creation with unique gradients, tags, and descriptions. |

</details>

<details closed><summary>src.app.(private).dashboard.setup</summary>

| File                                                                                                            | Summary                                                                                                                                                                                                                                           |
| --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [page.tsx](<https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/(private)/dashboard/setup/page.tsx>) | Empower users to manage their accounts with a dynamic dashboard setup page. Display user info, trial end date, and a button linked to the customer portal with prefilled email. Enhance UX with responsive design and user-centric functionality. |

</details>

<details closed><summary>src.app.(private).dashboard.scheduler</summary>

| File                                                                                                                | Summary                                                                                                                                                                                                |
| ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [page.tsx](<https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/(private)/dashboard/scheduler/page.tsx>) | Enables visualizing scheduled drafts on a calendar in the dashboard. Fetches drafts, maps them to calendar events, and displays content as tooltips. Implements event styling and navigation controls. |

</details>

<details closed><summary>src.app.(private).dashboard._components</summary>

| File                                                                                                                                      | Summary                                                                                                                                                                                                                                                                               |
| ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [content-viewer.tsx](<https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/(private)/dashboard/_components/content-viewer.tsx>) | Generates formatted content view based on Slate elements with dynamic expand-collapse functionality and overflow detection.                                                                                                                                                           |
| [date-picker.tsx](<https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/(private)/dashboard/_components/date-picker.tsx>)       | Implements a date picker component for the dashboard, allowing users to select a date. Integrates with lucide-react for calendar icon rendering and provides a popover with a calendar for date selection.                                                                            |
| [editor-section.tsx](<https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/(private)/dashboard/_components/editor-section.tsx>) | Enables editing and publishing posts with formatting options and scheduling functionality. Implements bold and italic text toggling, character count validation, and post scheduling. Supports slate editor features for a seamless writing experience within the application.        |
| [linkedin-post.tsx](<https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/(private)/dashboard/_components/linkedin-post.tsx>)   | Enables rendering LinkedIn post previews with user information, content, and interactive icons for engagement. Fetches user data dynamically and adjusts layout based on device type. An integral component enhancing the visualization of social media posts within the application. |

</details>

<details closed><summary>src.app.(private).dashboard.ideas</summary>

| File                                                                                                            | Summary                                                                               |
| --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| [page.tsx](<https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/(private)/dashboard/ideas/page.tsx>) | Defines a dashboard page to display ideas using `IdeasPageContent` wrapper component. |

</details>

<details closed><summary>src.app.(private).dashboard.draft.[id]</summary>

| File                                                                                                                 | Summary                                                                                                                                                                                                                                                      |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [page.tsx](<https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/(private)/dashboard/draft/[id]/page.tsx>) | Enables editing and saving drafts with device preview options. Fetches draft content, updates editor, and handles saving functionality. Renders editor and device preview components based on draft content. Displays loading indicator while fetching data. |

</details>

<details closed><summary>src.app.(private).dashboard.post.share-story</summary>

| File                                                                                                                       | Summary                                                                                                                                                                                                                   |
| -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [page.tsx](<https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/(private)/dashboard/post/share-story/page.tsx>) | Enables users to share stories through a form submission, processing the data via an API call. It dynamically updates the LinkedIn post content based on server-side responses, providing real-time feedback to the user. |

</details>

<details closed><summary>src.app.(private).dashboard.post.youtube-linkedin</summary>

| File                                                                                                                            | Summary                                                                                                                                                                                               |
| ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [page.tsx](<https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/(private)/dashboard/post/youtube-linkedin/page.tsx>) | Enables repurposing content between YouTube and LinkedIn platforms. Handles form submission, async API requests, streaming responses, and content display. Facilitates seamless conversion for users. |

</details>

<details closed><summary>src.app.(private).dashboard.post.scratch-story</summary>

| File                                                                                                                         | Summary                                                                                                                                                                                                                          |
| ---------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [page.tsx](<https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/(private)/dashboard/post/scratch-story/page.tsx>) | Enables posting with AI-generated content. Manages form data submission, content loading, and error handling for a creative post creation experience. Dynamically updates LinkedIn post content for interactive user engagement. |

</details>

<details closed><summary>src.app.(private).dashboard.post.learnings</summary>

| File                                                                                                                     | Summary                                                                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [page.tsx](<https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/(private)/dashboard/post/learnings/page.tsx>) | Enables sharing learnings globally, displaying dynamically updated LinkedIn posts. Handles form submission, streaming API responses for real-time post updates, with error handling and loading indicators. |

</details>

<details closed><summary>src.app.(private).dashboard.post.tips</summary>

| File                                                                                                                | Summary                                                                                                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [page.tsx](<https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/(private)/dashboard/post/tips/page.tsx>) | Enables sharing tips via LinkedIn integration, handling content submission, stream processing, and display. Implements data fetching with error handling. Key features include a form for tip submission and dynamic content rendering based on API responses. |

</details>

<details closed><summary>src.app.(private).dashboard.post.x-linkedin</summary>

| File                                                                                                                      | Summary                                                                                                                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [page.tsx](<https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/(private)/dashboard/post/x-linkedin/page.tsx>) | Creates a LinkedIn repurposing page for converting content cross-platform. Handles form submission, fetches content via streaming API, and displays resulting content. Aimed at facilitating platform content migration. |

</details>

<details closed><summary>src.app.(public)._pricing</summary>

| File                                                                                                    | Summary                                                                                                                                                          |
| ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [page.tsx](<https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/(public)/_pricing/page.tsx>) | Implements a dynamic pricing page with navigation components. Features a sticky Navbar, VariablePricing section, and FAQComponent for seamless user interaction. |

</details>

<details closed><summary>src.app.(public).privacy-policy</summary>

| File                                                                                                          | Summary                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [page.tsx](<https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/(public)/privacy-policy/page.tsx>) | Presents Privacy Policy content.-Describes data collection and usage.-Outlines security measures.-Lists user rights and choices.-Provides contact information. |

</details>

<details closed><summary>src.app.(public).signout</summary>

| File                                                                                                   | Summary                                                                                                                                                                                                  |
| ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [page.tsx](<https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/(public)/signout/page.tsx>) | Implements a sign-out page for Spireo app. Allows users to sign out, providing a confirmation prompt with options to proceed or cancel. Maintains a user-friendly interface for managing account access. |

</details>

<details closed><summary>src.app.(public).signin</summary>

| File                                                                                                  | Summary                                                                                                                                                                                                            |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [page.tsx](<https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/(public)/signin/page.tsx>) | Enables LinkedIn authentication for user sign-in with a visually appealing interface. Promotes professional networking and showcases AI-powered features. Enhances user experience through seamless login process. |

</details>

<details closed><summary>src.app.(public).terms-of-service</summary>

| File                                                                                                            | Summary                                                                                                                                                                                                                                     |
| --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [page.tsx](<https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/(public)/terms-of-service/page.tsx>) | Generates terms of service page with key sections like Introduction, User Responsibilities, Intellectual Property, and Contact Us. Displays relevant information in a structured layout for users to understand platform guidelines easily. |

</details>

<details closed><summary>src.app.api.schedule</summary>

| File                                                                                             | Summary                                                                                                                                                                                       |
| ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [route.ts](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/api/schedule/route.ts) | Implements POST, DELETE, and PUT API routes to schedule, remove, and update posts. Validates input, schedules posts based on time, and manages job processing in a Redis-backed queue system. |

</details>

<details closed><summary>src.app.api.publish</summary>

| File                                                                                            | Summary                                                                                                                                                                                                                       |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [route.ts](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/api/publish/route.ts) | Publishes drafted content to LinkedIn via API, handling authentication and error cases. Retrieves user data, saves drafts, and posts to LinkedIn with specified visibility. Updates draft status upon successful publication. |

</details>

<details closed><summary>src.app.api.queue</summary>

| File                                                                                          | Summary                                                                                                                                                     |
| --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [route.ts](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/api/queue/route.ts) | Retrieves queue length and handles clearing of jobs in the queue seamlessly. Influences queue processing functionality within the repositorys architecture. |

</details>

<details closed><summary>src.app.api.webhook.stripe</summary>

| File                                                                                                   | Summary                                                                                                                                                                                                           |
| ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [route.ts](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/api/webhook/stripe/route.ts) | Handles incoming Stripe webhook events, verifies signatures, processes checkout sessions, updates user access based on subscriptions, and logs errors. Utilizes Stripe API, database queries, and Next.js server. |

</details>

<details closed><summary>src.app.api.auth.[...nextauth]</summary>

| File                                                                                                       | Summary                                                                                                          |
| ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| [route.ts](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/api/auth/[...nextauth]/route.ts) | Enables authentication routes for the app using NextAuth and authentication options defined in the server setup. |

</details>

<details closed><summary>src.app.api.ai.share-story</summary>

| File                                                                                                   | Summary                                                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [route.ts](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/api/ai/share-story/route.ts) | Defines an endpoint to generate LinkedIn story posts using Anthropic AI. Processes user input to create engaging narratives aligned with professional context. Returns a text stream for seamless consumption. |

</details>

<details closed><summary>src.app.api.ai.rewrite</summary>

| File                                                                                               | Summary                                                                                                                                                                                                                                                                   |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [route.ts](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/api/ai/rewrite/route.ts) | Implements an AI-based content enhancement route using Anthropics SDK for Spireo AI. Parses original content to generate engaging and professional LinkedIn posts, emphasizing tone, hashtags, and structure for user engagement. Returns enhanced content as a response. |

</details>

<details closed><summary>src.app.api.ai.share-tips</summary>

| File                                                                                                  | Summary                                                                                                                                                                                                                                                                                    |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [route.ts](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/api/ai/share-tips/route.ts) | Defines a route that utilizes a server to handle POST requests for generating LinkedIn post content using Anthropic AI SDK. Parses input data for tips, instructions, and format templates, then generates a professional post catering to specified guidelines and user-provided content. |

</details>

<details closed><summary>src.app.api.ai.learning-story</summary>

| File                                                                                                      | Summary                                                                                                                                                                                                                                  |
| --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [route.ts](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/api/ai/learning-story/route.ts) | Handles generating LinkedIn post content using Anthropic AI SDK based on provided user inputs for learning, acquisition method, takeaways, instructions, and format template. Returns a text event stream response for user interaction. |

</details>

<details closed><summary>src.app.api.ai.scratch-story</summary>

| File                                                                                                     | Summary                                                                                                                                                                                                                                              |
| -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [route.ts](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/api/ai/scratch-story/route.ts) | Generates real-time AI-assisted LinkedIn story creation using the Anthropic AI SDK, based on input content, tone, and instructions. Handles processing, generation, and streaming of personalized story drafts for professional audience engagement. |

</details>

<details closed><summary>src.app.api.ai.generate-ideas</summary>

| File                                                                                                      | Summary                                                                                                                                                                                                                                  |
| --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [route.ts](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/api/ai/generate-ideas/route.ts) | Generates LinkedIn post ideas based on user input using Anthropic AI, catering to professional networking guidelines and language-specific context. Polite responses if the idea isnt fit for LinkedIn. Outputs a concise list of ideas. |

</details>

<details closed><summary>src.app.api.ai.repurpose-content.youtube</summary>

| File                                                                                                                 | Summary                                                                                                                                                                                                                                                                                        |
| -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [route.ts](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/api/ai/repurpose-content/youtube/route.ts) | Generates LinkedIn posts from YouTube video transcripts by processing instructions and format templates. Utilizes Anthropic AI for content creation based on video context, key points, and audience engagement. Handles YouTube transcript retrieval, text conversion, and URL normalization. |

</details>

<details closed><summary>src.app.api.ai.repurpose-content.x</summary>

| File                                                                                                           | Summary                                                                                                                                                                                                                         |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [route.ts](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/app/api/ai/repurpose-content/x/route.ts) | Enables content repurposing by integrating server-side logic for processing YouTube transcripts with Anthropic AI SDK. Aids in transforming content for enhanced user engagement within the Spireo AI application architecture. |

</details>

<details closed><summary>src.server.bull</summary>

| File                                                                                        | Summary                                                                                                                                                                                                      |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [queue.ts](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/server/bull/queue.ts) | Implements a Redis queue for processing LinkedIn posts. Connects to a Redis instance, processes job data, and posts content to LinkedIn using user access tokens. Handles job completion and failure events. |

</details>

<details closed><summary>src.server.db</summary>

| File                                                                                        | Summary                                                                                                                                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [schema.ts](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/server/db/schema.ts) | Defines schema for multi-project database usage with tables for drafts, ideas, users, accounts, and content styles. Establishes relationships between tables for user accounts and content styles, ensuring data integrity and structured storage in the repositorys backend architecture. |
| [index.ts](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/server/db/index.ts)   | Creates a cached database connection for development in the parent repository architecture, leveraging Drizzle ORM with PostgreSQL. Ensures efficient connection handling without recreating it on every Hot Module Replacement (HMR) update.                                              |

</details>

<details closed><summary>src.components.ui</summary>

| File                                                                                                                            | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [theme-provider.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/theme-provider.tsx)               | Enables theming functionality for UI components using Next.js ThemesProvider integration.                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| [animated-beam.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/animated-beam.tsx)                 | Creates an animated beam between two elements based on props. Utilizes Framer Motion for smooth animations and dynamic gradient effects, enhancing UI interactivity. Ensures responsive behavior with ResizeObserver. A visually engaging component within the UI architecture.                                                                                                                                                                                                                                                                            |
| [tabs.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/tabs.tsx)                                   | Defines reusable UI components for tabs using Radix UI in the parent repositorys React architecture. The components include Tabs, TabsList, TabsTrigger, and TabsContent for managing tab functionality and visual presentation.                                                                                                                                                                                                                                                                                                                           |
| [card.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/card.tsx)                                   | Defines UI components for cards including header, title, description, content, and footer, enhancing visual appeal and user experience within the parent repositorys frontend architecture.                                                                                                                                                                                                                                                                                                                                                                |
| [popover.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/popover.tsx)                             | Implements popover functionality using Radix UI in the spireo-ai repository. The code defines the structure for triggering and displaying popovers with customizable alignment, styles, and animations for interactive user interfaces.                                                                                                                                                                                                                                                                                                                    |
| [progress.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/progress.tsx)                           | Implements a custom progress bar component using a third-party library, enhancing visual feedback for loading states.                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| [techy-card.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/techy-card.tsx)                       | Enhances** TechyCard component in repos UI package. **Displays** TechyCard item with gradient background, title, description, and tags. **Links** to dashboard post based on type. **Maintains\*\* visual coherence and interactivity in project UI.                                                                                                                                                                                                                                                                                                       |
| [cool-mode.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/cool-mode.tsx)                         | Enhances user interaction by triggering confetti animation on button click. Dynamically configurable duration, particle count, spread, and colors to create a captivating visual effect. Integration with Canvas Confetti library for seamless implementation within the parent repositorys UI components.                                                                                                                                                                                                                                                 |
| [ripple.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/ripple.tsx)                               | Creates dynamic ripple effect with multiple animated circles for visual feedback in UI. Utilizes React for managing components and styling. Enhances user experience by displaying engaging ripple animations based on configurable circle size, opacity, and number.                                                                                                                                                                                                                                                                                      |
| [sheet.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/sheet.tsx)                                 | Defines UI components handling overlay display & content for modals. Allows customizing sheet positions, styles, and triggers. Facilitates easy creation of interactive sheets with headers, footers, titles, and descriptions in a flexible and accessible manner within the app.                                                                                                                                                                                                                                                                         |
| [rounded-border-button.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/rounded-border-button.tsx) | Implements a customizable gradient button component for user interfaces in the project. Enables specifying gradient colors and styling while maintaining a consistent design across the application.                                                                                                                                                                                                                                                                                                                                                       |
| [scroll-area.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/scroll-area.tsx)                     | Implements custom scroll area components for UI in the project, enhancing user experience through smooth scrolling functionality and visual feedback. The ScrollArea and ScrollBar components offer seamless integration and advanced customization options within the applications interface.                                                                                                                                                                                                                                                             |
| [label.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/label.tsx)                                 | Implements a custom label component with predefined styling variants using React and Radix UI. Integrates variance authority for dynamic class application.                                                                                                                                                                                                                                                                                                                                                                                                |
| [dot-pattern.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/dot-pattern.tsx)                     | Creates a customizable Dot Pattern component using SVG for UI elements. Adds a visually appealing, interactive design feature to enhance user experience within the repositorys front-end interface.                                                                                                                                                                                                                                                                                                                                                       |
| [navigation-menu.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/navigation-menu.tsx)             | Implements a responsive navigation menu interface with customizable styles and motion effects using Radix UI for React components. Enables easy integration and management of interactive menu elements for web applications.                                                                                                                                                                                                                                                                                                                              |
| [marquee.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/marquee.tsx)                             | Implements a flexible Marquee component for dynamic content display with customizable animation controls.                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| [avatar-circles.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/avatar-circles.tsx)               | Creates a dynamic UI component for displaying avatar circles with customizable number of people and avatar images. Supports responsive layouts and includes a link to show additional avatars.                                                                                                                                                                                                                                                                                                                                                             |
| [drawer.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/drawer.tsx)                               | Defines reusable UI components for a responsive drawer interface. Includes triggers, overlays, content structure, header, footer, title, and description components. Facilitates cohesive layout and interaction within the applications user interface.                                                                                                                                                                                                                                                                                                   |
| [tooltip.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/tooltip.tsx)                             | Defines and exports tooltip components for UI interaction within the repositorys React application. Handles tooltip display and behavior, enhancing user experience.                                                                                                                                                                                                                                                                                                                                                                                       |
| [switch.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/switch.tsx)                               | Implements a custom switch component with accessibility features for the UI. It enhances user interactions with a visually appealing toggle functionality within the larger repositorys architecture.                                                                                                                                                                                                                                                                                                                                                      |
| [calendar.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/calendar.tsx)                           | Implements a customizable calendar UI component for the repository using DayPicker. Provides navigation buttons, styling options, and component icons for enhanced user experience.                                                                                                                                                                                                                                                                                                                                                                        |
| [radio-group.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/radio-group.tsx)                     | Implements RadioGroup and RadioGroupItem components using Radix UI for a custom radio group interface. Handles styling, accessibility, and interactivity for radio input selections within the UI architecture.                                                                                                                                                                                                                                                                                                                                            |
| [command.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/command.tsx)                             | Enables interactive command UI components for dialog-based user interactions within the repositorys frontend architecture. Implements various components like Command, CommandDialog, CommandInput, CommandList, CommandGroup, CommandItem, and CommandShortcut for intuitive command-driven user experiences.                                                                                                                                                                                                                                             |
| [toggle-group.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/toggle-group.tsx)                   | Enables customizable UI toggle groups in React, providing flexible styling and size options. Uses a context for consistent appearance throughout components within the toggle group. Facilitates seamless integration and management of toggle items.                                                                                                                                                                                                                                                                                                      |
| [fade-separator.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/fade-separator.tsx)               | Defines a reusable UI component `FadeSeparator` for creating a fading divider using a gradient effect. It enhances visual appeal by seamlessly integrating with other UI elements in the repository.                                                                                                                                                                                                                                                                                                                                                       |
| [dialog.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/dialog.tsx)                               | Implements dialog UI components for interactive user interactions within the repositorys architecture. Includes elements for triggering, styling, and managing dialog content. Facilitates creating visually appealing and functional dialog boxes.                                                                                                                                                                                                                                                                                                        |
| [badge.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/badge.tsx)                                 | Implements badge variations for UI components using Class Variance Authority. Defines badge styles based on given variants, enabling easy customization of badges across the application.                                                                                                                                                                                                                                                                                                                                                                  |
| [primary-button.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/primary-button.tsx)               | Defines a customizable Primary Button component for React UI with specified onClick behavior, background and text colors, and optional custom styling class. Helps streamline button creation in the UI components section of the repository.                                                                                                                                                                                                                                                                                                              |
| [mode-toggle.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/mode-toggle.tsx)                     | Enables theme switching with icons in UI dropdown menu using Next.js Theming API. Facilitates seamless toggling between light, dark, and system modes. Integrates well within the UI architecture for enhanced user experience.                                                                                                                                                                                                                                                                                                                            |
| [table.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/table.tsx)                                 | Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption. Optimized for displaying data with customizable styling and accessibility features. Enhances UI consistency and maintainability within the parent repositorys frontend architecture.                                                                                                                                                                                                                                                                             |
| [separator.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/separator.tsx)                         | Implements a UI Separator component utilizing Radix-UI for styling consistency. Renders a flexible separator with customizable orientation, decorative appearance, and dynamic sizing. Promotes code reusability and modular design within the repositorys UI components.                                                                                                                                                                                                                                                                                  |
| [card-demo.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/card-demo.tsx)                         | This code file in the `spireo-ai` repository serves the critical function of configuring the frontend build process. It defines the projects settings for compiling assets, optimizing performance, and setting up the development environment. By customizing configurations in this file, the project can efficiently bundle resources, enhance user experience, and streamline the development workflow. This pivotal file plays a significant role in shaping the overall architecture and functionality of the frontend components in the repository. |
| [button.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/button.tsx)                               | Defines button variants with styles and sizes, enhancing button components. Utilizes Class Variance Authority for variant management. Exports a Button component with customizable variants for size and appearance, catering to various design needs within the UI elements.                                                                                                                                                                                                                                                                              |
| [toggle.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/toggle.tsx)                               | Implements a customizable toggle component using Radix UI, allowing easy styling variations and sizes. The component handles state changes and interactions with a clean, concise approach.                                                                                                                                                                                                                                                                                                                                                                |
| [bento-grid.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/bento-grid.tsx)                       | Enables constructing responsive grid layouts with dynamic card components, fostering cohesive design and enhancing user engagement.                                                                                                                                                                                                                                                                                                                                                                                                                        |
| [checkbox.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/checkbox.tsx)                           | Implements a custom checkbox UI component utilizing Radix-UI Checkbox, styled with Tailwind CSS. Responsible for rendering a checkbox input and a checkmark icon. Facilitates interactive user input handling within the front-end of the repositorys application.                                                                                                                                                                                                                                                                                         |
| [dropdown-menu.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/dropdown-menu.tsx)                 | Enables interactive dropdown menu UI components with various styles and functionalities. Includes triggers, content, items (checkbox, radio), labels, separators, and shortcuts. Supports nested structures for a seamless user experience within the repositorys architecture.                                                                                                                                                                                                                                                                            |
| [select.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/select.tsx)                               | Enables custom styling and functionality for select elements in the UI using Radix UI components. Provides enhanced trigger appearance, scrolling buttons, content positioning, labels, items with indicators, separators, and grouping. Enhances user experience by offering a polished and interactive selection interface.                                                                                                                                                                                                                              |
| [textarea.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/textarea.tsx)                           | Enhances UI by defining a customizable Textarea component in the repositorys UI folder. Utilizes React to create a versatile input field with styling and functional properties, promoting reusability across the project.                                                                                                                                                                                                                                                                                                                                 |
| [input.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/input.tsx)                                 | Enhances UI input components with dynamic styling and behavior. Integrates seamlessly with the repositorys architecture for streamlined development and maintenance.                                                                                                                                                                                                                                                                                                                                                                                       |
| [sparkles-text.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/sparkles-text.tsx)                 | Generates dynamic sparkles effect over text, enhancing UI visually. Dynamically creates and updates sparkling elements with varying colors, positions, and animations. Implements interactive framer-motion rendering.                                                                                                                                                                                                                                                                                                                                     |
| [form.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/form.tsx)                                   | Empower form creation with reusable form components including labels, fields, descriptions, and messages. Facilitate seamless integration into React projects, promoting efficient form building and management within the repositorys UI component architecture.                                                                                                                                                                                                                                                                                          |
| [carousel.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/ui/carousel.tsx)                           | Enables interactive carousels with navigation controls, supporting horizontal or vertical orientation within the web application. Exposes components for carousel items, previous and next buttons, fostering a seamless user experience for dynamic content exploration and engagement.                                                                                                                                                                                                                                                                   |

</details>

<details closed><summary>src.components.wrappers</summary>

| File                                                                                                                          | Summary                                                                                                                                                                                |
| ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [idea-page-content.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/wrappers/idea-page-content.tsx) | Generates post ideas and allows saving or creating posts based on these ideas. Displays trending topics for inspiration. Dynamically updates content while providing loading feedback. |

</details>

<details closed><summary>src.components.forms</summary>

| File                                                                                                                         | Summary                                                                                                                                                                                                                                                                                               |
| ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [youtube-form.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/forms/youtube-form.tsx)             | Creates a YouTube repurpose form handling URL, instructions, and format selection. Utilizes zod for form validation and react-hook-form for managing form state. Dynamically updates format template based on user input, enhancing content repurposing experience.                                   |
| [share-story-form.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/forms/share-story-form.tsx)     | Enables creation of interactive story-sharing forms for diverse experiences. Captures details like story type, content, outcome, emotions, and lessons. Supports custom post formats and instructions. Facilitates seamless submission with real-time validation.                                     |
| [idea-form.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/forms/idea-form.tsx)                   | Empowers users to generate post ideas by submitting topics, handling form validation, and triggering an AI backend call. Implements dynamic form components and state management for form submission.                                                                                                 |
| [x-form.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/forms/x-form.tsx)                         | Enables form submission with dynamic format selection, URL input, and custom instructions for repurposing content. Handles state updates and form validation using Zod schemas, React Hook Form, and UI components within the repositorys component structure.                                        |
| [learnings-form.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/forms/learnings-form.tsx)         | Enables users to create structured learning posts with dynamic formatting options. Handles form validation and submission with React Hook Form and Zod. Facilitates customization of post content and generation.                                                                                     |
| [tips-form.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/forms/tips-form.tsx)                   | Enables form submission with validation and dynamic formatting options. Handles input for tips, instructions, and post formatting. Supports real-time format editing and submission with loading state feedback.                                                                                      |
| [scratch-story-form.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/forms/scratch-story-form.tsx) | Enables users to create engaging posts with custom formats, tones, and instructions. Utilizes zod for form validation and react-hook-form for efficient form handling. Facilitates dynamic format selection and clear post content input. Empowers users to generate personalized content seamlessly. |

</details>

<details closed><summary>src.components.auth</summary>

| File                                                                                                              | Summary                                                                                                                                                                                                                       |
| ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [signin-button.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/auth/signin-button.tsx) | Implements a sign-in button UI component handling authentication flow using NextAuth. Integrates with Next.js and Lucide icons. Visual design includes gradient background and interactive hover effects for user engagement. |

</details>

<details closed><summary>src.components.navigation</summary>

| File                                                                                                                                                    | Summary                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [fixed-pricing.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/navigation/fixed-pricing.tsx)                                 | Generates a FixedPricing component with AI-powered LinkedIn boosting details, testimonials, and Pro Plan features. Accesses a server session for authentication and offers a subscription link based on the environment.                                                                                                                                                   |
| [navbar.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/navigation/navbar.tsx)                                               | Implements interactive navbar with responsive design, enabling seamless navigation between sections and a call-to-action button for signup.                                                                                                                                                                                                                                |
| [macbook-scroll.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/navigation/macbook-scroll.tsx)                               | Implements a Macbook scrolling effect with dynamic animations and perspective transformations based on the users scroll position. Displays a lid component with a customizable image source. Handles responsive behavior for mobile devices.                                                                                                                               |
| [animated-tooltip.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/navigation/animated-tooltip.tsx)                           | Implements animated tooltips for navigation items based on mouse hover, showcasing member details elegantly with motion effects.                                                                                                                                                                                                                                           |
| [before-after-section.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/navigation/before-after-section.tsx)                   | Illustrates Before and After sections of Spireos AI impact on LinkedIn. Displays benefits like instant inspiration, tailored content, and streamlined tools visually using Lucide icons. Designed for easy understanding and engagement.                                                                                                                                   |
| [variable-pricing.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/navigation/variable-pricing.tsx)                           | Creates a dynamic pricing display for different subscription plans, offering users monthly or yearly options. Displays plan details, pricing, and features in an interactive card format. Allows users to toggle between plan durations and start a trial.                                                                                                                 |
| [navigation-menu.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/navigation/navigation-menu.tsx)                             | Illustrates a dynamic navigation menu showcasing AI-powered features, pricing, and resources in the Spireo AI platform. Employs React components with specific content for post, idea, carousel generation, post scheduling, and LinkedIn content creation. Highlighting features, pricing, and resources for enhanced user engagement and seamless navigation experience. |
| [footer.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/navigation/footer.tsx)                                               | Defines Footer component rendering company info, help links, and extra resources. Adjusts UI based on the current page path in a Next.js app. Enhances user experience through responsive design and easy navigation.                                                                                                                                                      |
| [animated-beam-multiple-inputs.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/navigation/animated-beam-multiple-inputs.tsx) | Implements an interactive demo showcasing multiple animated beams connecting various circular icons with custom visual elements, enhancing user engagement and demonstrating UI/UX design capabilities.                                                                                                                                                                    |
| [image-component.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/navigation/image-component.tsx)                             | Showcases a dynamic image component rendering with motion effects on scroll. Enhances user experience through engaging animations.                                                                                                                                                                                                                                         |
| [testimonial-section.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/navigation/testimonial-section.tsx)                     | Showcases engaging customer testimonials with images, quotes, and company affiliations in a visually appealing layout. Designed to highlight user experiences and success stories, enhancing the overall marketing strategy of the Spireo AI platform.                                                                                                                     |
| [hero-section.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/navigation/hero-section.tsx)                                   | Defines HeroSection component rendering LinkedIn AI boosting features with animated elements. Integrates Lucide icons, GradientButton, and AnimatedTooltip for engaging UI. Employs SignIn button for user authentication. Displays benefits appealing to professionals, emphasizing trust, one-time payment, and quality content.                                         |
| [cta-section.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/navigation/cta-section.tsx)                                     | Showcases engaging UI features with a compelling call-to-action for Spireo AI. Promotes easy content creation and boosts LinkedIn presence using AI tools. Ensures user data security.                                                                                                                                                                                     |
| [feature-section.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/navigation/feature-section.tsx)                             | Showcases interactive features like carousel generator, ideas generator, repurposing tools, and scheduler using visually appealing UI components. Provides a dynamic way to engage with content and tasks within the application.                                                                                                                                          |
| [faq.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/navigation/faq.tsx)                                                     | Provides FAQ section for Spireo, displaying common queries and detailed responses. Enhances user understanding of AI content generation, post scheduling, free trial availability, and data security measures. Promotes customer engagement with a support team contact option.                                                                                            |
| [new-feature-section.tsx](https://github.com/dhruvbansal26/spireo-ai/blob/master/src/components/navigation/new-feature-section.tsx)                     | Creates engaging sections showcasing new features for LinkedIn content creation. Employs dynamic layout with images, descriptions, quotes, and author details. Enables easy sharing and repurposing, enhancing content strategy and visual impact. Improves workflow efficiency and content value while promoting timely scheduling and trend following.                   |

</details>

---

## Getting Started

### Installation

<h4>From <code>source</code></h4>

> 1. Clone the spireo-ai repository:
>
> ```console
> $ git clone https://github.com/dhruvbansal26/spireo-ai
> ```
>
> 2. Change to the project directory:
>
> ```console
> $ cd spireo-ai
> ```
>
> 3. Install the dependencies:
>
> ```console
> $ pnpm install
> ```

### Usage

<h4>From <code>source</code></h4>

> Run spireo-ai using the command below:
>
> ```console
> $ pnpm dev
> ```

> Run the stripe webhook using:
>
> ```console
> $ stripe listen --forward-to http://localhost:3000/api/webhook/stripe
> ```

---

## Contributions

<br>
<p align="center">
   <a href="https://github.com{/dhruvbansal26/spireo-ai/}graphs/contributors">
      <img src="https://contrib.rocks/image?repo=dhruvbansal26/spireo-ai">
   </a>
</p>

---
