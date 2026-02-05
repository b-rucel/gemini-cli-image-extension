#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { generateImage } from './imageGen.js';

class OAuthImageServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'oauth-image-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      },
    );

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'oauth_generate_image',
            description: 'Generate images using Gemini OAuth (Login with Google)',
            inputSchema: {
              type: 'object',
              properties: {
                prompt: {
                  type: 'string',
                  description: 'The image description',
                },
                count: {
                  type: 'number',
                  description: 'Number of images (default 1)',
                  default: 1,
                },
              },
              required: ['prompt'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      if (name === 'oauth_generate_image') {
        const prompt = args?.prompt as string;
        const count = (args?.count as number) || 1;

        try {
          const files = await generateImage(prompt, count);
          return {
            content: [
              {
                type: 'text',
                text: `Successfully generated ${files.length} image(s):\n${files.join('\n')}`,
              },
            ],
          };
        } catch (error) {
          return {
            isError: true,
            content: [
              {
                type: 'text',
                text: `Error generating image: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
          };
        }
      }

      throw new Error(`Unknown tool: ${name}`);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('OAuth Image MCP server running on stdio');
  }
}

const server = new OAuthImageServer();
server.run().catch(console.error);
