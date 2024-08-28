# GetInstaMedia-InstaMemer

**GetInstaMedia-InstaMemer** is a monolithic application designed for downloading media content from Instagram posts. It offers a seamless experience for users by providing both a web interface and a Discord bot that can fetch and display Instagram media content directly within Discord servers.

## Key Features

- **Web Interface**: A React-based website that allows users to view and download Instagram post media by simply providing a link.
- **Discord Bot**: A bot that automatically responds to messages containing Instagram post links by embedding the media and additional post information directly in the chat.

## Architecture Overview

The application is composed of four main components, each serving a specific role:

- **Express Server**: Manages API requests and serves the web client.
- **Discord Bot Agent**: Listens for Instagram post links in Discord channels and responds with media content and post details.
- **Instagram Agent**: Handles interactions with Instagram's API, including login, session management, and media retrieval.
- **React Client**: A modern, responsive web interface for users to interact with the application.

## Technology Stack

### Client-Side Technologies

- **[TypeScript](https://www.typescriptlang.org/)**: Enhances JavaScript with static typing, providing better code quality and maintainability.
- **[Vite](https://vitejs.dev/)**: A next-generation frontend tool that offers a fast and optimized development experience.
- **[React](https://reactjs.org/)**: A popular library for building user interfaces, enabling the creation of dynamic and responsive web pages.
- **[Axios](https://github.com/axios/axios)**: A promise-based HTTP client for making API requests.
- **[Lodash](https://lodash.com/)**: A utility library offering modular methods for common programming tasks.

### Server-Side Technologies

- **[Express](https://expressjs.com/)**: A minimal and flexible Node.js web application framework for building robust APIs.
- **[Discord.js](https://github.com/discordjs/discord.js)**: A powerful library for interacting with the Discord API, enabling the creation of bots and other integrations.
- **[Instagram Private API](https://github.com/instagram-private-api/instagram-private-api)**: A reverse-engineered API for interacting with Instagram, allowing advanced functionalities like session management and media retrieval.
- **[Axios](https://github.com/axios/axios)**: Used here as well for server-side HTTP requests.
- **[Lodash](https://lodash.com/)**: Used on the server for efficient data manipulation.
- **[Nanoid](https://github.com/ai/nanoid)**: A tiny, secure URL-friendly unique ID generator.

## Development History

**GetInstaMedia-InstaMemer** began as a simple Discord bot that responded to Instagram post links with a modified URL using the [InstaFix](https://github.com/Wikidepia/InstaFix) service. However, due to inconsistencies with InstaFix, the project evolved significantly.

### Evolution of the Project

1. **Initial Challenges**:
    - The need for reliable media retrieval from Instagram led to the development of a custom solution, bypassing external services in favor of direct interactions with Instagram’s servers.
    - Initial experiments with scraper APIs were costly and restrictive, prompting the move to self-managed Instagram sessions.

2. **Technical Innovations**:
    - Bypassing Instagram’s API limitations required a sophisticated session management system, initially implemented using Puppeteer for login automation. Due to resource constraints, this approach was later optimized with direct HTTP requests.
    - The transition to using the `instagram-private-api` library, after extensive testing and modifications, allowed for reliable session management and media retrieval, supporting a high volume of requests.

3. **Current Limitations**:
    - **Discord.js File Size Limitation**: Media content over 25MB cannot be sent directly through Discord.js, though this is rarely encountered due to typical media sizes.
    - **Future Architecture Goals**: Plans include splitting the application into microservices with load balancing to enhance reliability and scalability.

## License

This project is licensed under the [PolyForm Noncommercial License](LICENSE.txt). You are free to view and study the code, but commercial use, modification, and distribution are prohibited.

## Future Enhancements

Moving forward, the goal is to transition this application into a microservices architecture, further enhancing its scalability and resilience. Additionally, efforts will be made to address current limitations, ensuring robust performance in diverse environments.
