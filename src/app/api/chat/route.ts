import { query, SDKUserMessage, type Options } from "@anthropic-ai/claude-code";
import type {
  ContentBlockParam,
  ImageBlockParam,
  TextBlockParam,
} from "@anthropic-ai/sdk/resources/messages/messages";
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  type UIMessage,
} from "ai";
import { getProviderConfig, getLanguageModel } from "@/lib/providers";

export const maxDuration = 60000;

const MAE_SYSTEM_PROMPT = `You are mae, an AI agent running on this Linux system.
Your job is to keep this machine updated, configured, and secure.
You have terminal access to the host system.

You have access to all mcp servers via mcp binary.

Example:
bunx mcp @modelcontextprotocol/server-puppeteer -- puppeteer_screenshot shot.png | jq -r '.content[1].data'
bunx mcp @modelcontextprotocol/server-filesystem -a '~/Desktop' -- list_directory '~/Desktop'

To read each mcp server's tools, run:
bunx mcp @modelcontextprotocol/server-puppeteer help`;

function buildPromptFromContentBlocks(
  blocks: ContentBlockParam[]
): string | AsyncIterable<SDKUserMessage> {
  if (blocks.length === 1 && blocks[0].type === "text") {
    return blocks[0].text;
  }

  const messages: SDKUserMessage[] = blocks
    .filter((block) => block.type === "text" || block.type === "image")
    .map((block) => {
      if (block.type === "text") {
        return {
          type: "user",
          message: { role: "user", content: [{ type: "text", text: block.text }] },
          parent_tool_use_id: null,
        } as SDKUserMessage;
      }
      return {
        type: "user",
        message: { role: "user", content: [block] },
        parent_tool_use_id: null,
      } as SDKUserMessage;
    });

  return (async function* () {
    for (const message of messages) {
      yield message;
    }
  })();
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const lastMessage = messages[messages.length - 1];

  console.log("[chat/route] received message:", lastMessage);

  const config = getProviderConfig();
  console.log("[chat/route] provider:", config.provider, "model:", config.model);

  // Non-anthropic providers: use Vercel AI SDK streamText
  if (config.provider !== "anthropic") {
    const model = await getLanguageModel(config);

    const result = streamText({
      model,
      system: MAE_SYSTEM_PROMPT,
      messages: messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.parts
          .filter((p) => p.type === "text")
          .map((p) => (p as { type: "text"; text: string }).text)
          .join(""),
      })),
    });

    return result.toTextStreamResponse();
  }

  // Anthropic: use Claude Code SDK query() path
  const contentBlocks: ContentBlockParam[] = [];

  for (const part of lastMessage.parts) {
    if (part.type === "text") {
      const textBlock: TextBlockParam = { type: "text", text: part.text };
      contentBlocks.push(textBlock);
    } else if (
      part.type === "file" &&
      (part.mediaType === "image/jpeg" ||
        part.mediaType === "image/png" ||
        part.mediaType === "image/gif" ||
        part.mediaType === "image/webp")
    ) {
      const imageBlock: ImageBlockParam = {
        type: "image",
        source: {
          type: "base64",
          media_type: part.mediaType || "image/jpeg",
          data: part.url,
        },
      };
      contentBlocks.push(imageBlock);
    }
  }

  const prompt = buildPromptFromContentBlocks(contentBlocks);
  const continueSession = messages.length > 1;

  const stream = createUIMessageStream({
    execute: async (options) => {
      const { writer } = options;

      const claudeOptions: Options = {
        appendSystemPrompt: MAE_SYSTEM_PROMPT,
        permissionMode: "bypassPermissions",
      };

      if (continueSession) {
        claudeOptions.continue = true;
      }

      for await (const message of query({ prompt, options: claudeOptions })) {
        console.log("[chat/route] received message:", message.type);

        if (message.type === "assistant" && message.message?.content) {
          writer.write({ type: "text-start", id: "0" });

          for (const part of message.message.content) {
            if (part.type === "text") {
              writer.write({ type: "text-delta", delta: part.text, id: "0" });
            }
          }

          writer.write({ type: "text-end", id: "0" });
        }
      }

      console.log("[chat/route] stream complete");
    },
  });

  return createUIMessageStreamResponse({ stream });
}
