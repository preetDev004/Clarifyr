# Clarifyr

[Demo_Video](https://www.youtube.com/watch?v=8IuvCANgKfo)

## Developers

Name | Role | Github | Email   
--- | --- | --- | ---   
Vladyslav Huziienko | Back-end / AI Dev | Vlad005 |  [vhuziienko@myseneca.ca](mailto:vhuziienko@myseneca.ca)  
Daniel Krause | Front-end Dev / Scrum Specialist | codesend | [dkrause1@myseneca.ca](mailto:dkrause1@myseneca.ca)  
Maksym Volkovynskyi | Back-end / DBM Dev | callmecposu | [mvolkovynskyi@myseneca.ca](mailto:mvolkovynskyi@myseneca.ca)  
Preet Dineshkumar Patel | Front-end Dev / UI-UX Designer | preetDev004 | [Pdpatel51@myseneca.ca](mailto:Pdpatel51@myseneca.ca) 

## Project Description

Our project is a service for other businesses to create AI customer support bots. Our service provides an intuitive user interface with a minimal learning curve to create, customize, and publish customer support bots. Each bot will rely on a set of expert documents, so all the answers are aligned with the business information of the clients. Whenever the bot is created, it can be embedded in the target website by simply inserting one line of code into its codebase. As easy as that, the chatbot will become ready for business’ customers’ use.

### Chatbot creation

The chatbot creation process starts with users uploading their expertise materials, which can include documents, raw text, or parsed website content. Assuming they haven't exceeded their chatbot limit, users can proceed to create a new chatbot by providing essential details like the bot's name and welcome message, then selecting which of their uploaded expertise materials to use. The customization continues as users personalize their chatbot's appearance by choosing five colors for the theme and uploading a bot image, while also selecting specific behavior traits to define the bot's personality. For security, users specify which domains are allowed to host their chatbot. The process concludes with users receiving an embedment link that they can use to integrate their customized chatbot into their website.

### Embedded chat on client website

The interface launches with a chat icon that automatically restores previous chats for returning users or initializes new sessions for first-time visitors. The system processes user messages through an AI backend while rendering responses seamlessly in the frontend chat window. Users can interact with the chat until they choose to end their session.

### Chat usage statistics

The chat usage statistics dashboard displays key metrics about chatbot performance, including total conversations, message volumes, user engagement rates, and popular topics. Users can track their chatbot's effectiveness through metrics like average response times and resolution rates, helping them optimize their customer service experience.

### Subscription plans (future)

We offer four subscription plans to meet diverse user needs. The free plan lets users test our service with basic features. Plus and Pro plans provide increasing chat and message limits, with Pro offering more capabilities at a higher price. For large organizations, our Enterprise plan allows custom limits and personalized pricing through direct negotiation. This flexible approach ensures every user finds a suitable option matching their specific requirements and budget.

### Offline Human Chat Option (future)

When an AI can't solve a user's problem completely, the system offers a simple backup plan of connecting with a real human support agent. If human support is available and the website allows it, users can smoothly switch from AI to human assistance. This ensures that complex or unique issues get resolved quickly and effectively, providing a reliable support experience.

## Tech Stack

### Backend

The website will consume our own API, which is to be developed with Python Flask. To leverage AI technology, we are going to utilize OpenAI API to generate embeddings and chatbot responses.

### Frontend

The website’s UI is to be developed with Next.js. Frontend is also going to rely on usage of Tailwind CSS styling framework and shadcnUI component library.

### Database

To make it possible for our team to work with the same data set coming from a single source of truth, we have chosen to use the cloud MongoDB Atlas database for storing persistent data.

### Development Tools

During the development process, our team is going to utilize Visual Studio Code for an IDE, git for a version control system, Postman for an API testing framework, Prettier and ESLint for automatic code formatting and linting, and Github Actions for automated testing. 

### Deployment

Our app’s frontend and backend applications are going to be deployed on a single VPS provided by Digital Ocean. The applications are going to be individually packaged with Docker and run in a bundle with Docker Compose.
