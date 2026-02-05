# Gemini CLI Image Extension

This **Gemini Extension** enables you to generate images—specifically using models like **Introduction (Nano Banana)** and **Gemini 2.5/3**—without managing separate API keys or incurring unnecessary charges.

It leverages your existing local **Gemini CLI** authentication (`gemini auth login`) to access these models directly.

## Why this exists?

The primary goal is to **avoid using a raw Gemini API Key** and leverage the **Gemini CLI** ecosystem.

### Authentication Strategy
The standard Gemini API typically requires a separate API Key. This extension uses the **Gemini CLI's built-in OAuth flow** (requesting the `cloud-platform` scope), which allows you to:

1.  **Eliminate API Keys**: Authenticate safely as your Google user.
2.  **Leverage Free Tiers**: Use the **Gemini 2.5 Flash (Nano Banana)** model which is accessible via this CLI scope.
3.  **Access Vertex AI**: Gain bonus access to enterprise-grade models like **Imagen 3**.

## Features
- **Primary**: Support for `gemini-2.5-flash-image` (Nano Banana).
- **Bonus**: Support for `imagen-3.0-generate-001`.
- **Seamless Auth**: Reuses credentials from `~/.gemini/oauth_creds.json`.

## Installation

### Prerequisites
1.  **Node.js**: Ensure you have Node.js installed.
2.  **Gemini CLI Authentication**: You must be logged in via the Gemini CLI tools.
    *   This extension looks for credentials at `~/.gemini/oauth_creds.json`.
3.  **Google Cloud Project**: A project with the **Vertex AI API** enabled.

### Install via Gemini CLI

You can install this extension directly from GitHub or a local directory.

**From GitHub:**
```bash
gemini extensions install https://github.com/your-username/gemini-cli-image-extension
```

**Local Development:**
```bash
gemini extensions link .
```
This links the current directory as an extension, so changes are reflected immediately.

## Usage

This extension provides a single tool `generate_image` to your AI assistant.

**Tool Arguments:**
- **`prompt`** (string, required): Description of the image you want to generate.
- **`count`** (number, optional): Number of images to generate (default: 1).
- **`model`** (string, optional): The Vertex AI model ID to use.
    - **Default**: `imagen-3.0-generate-001`
    - **Models**: `gemini-2.5-flash-image`, 
    `gemini-3-pro-image-preview` <-- this does not work

### Examples

**User:** "Generate a futuristic city using the Nano Banana model."
**Assistant:** Calls `oauth_generate_image` with `{ "prompt": "futuristic city", "model": "gemini-2.5-flash-image" }`

**User:** "Create a painting of a cat."
**Assistant:** Calls `oauth_generate_image` with `{ "prompt": "painting of a cat" }` (uses default Imagen 3)

## Troubleshooting

**"Vertex AI API is not enabled..."**
Ensure you have enabled the Vertex AI API in your Google Cloud Console for the project ID specified in your config.

**"Request had insufficient authentication scopes..."**
Ensure your `~/.gemini/oauth_creds.json` has the correct scopes. You may need to re-authenticate with your CLI tool to grant Vertex AI permissions.

## License
MIT
