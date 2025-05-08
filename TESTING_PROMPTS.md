# Bittensor MCP Server - Test Prompts

This document provides a collection of example natural language prompts and corresponding explicit MCP tool calls to test the various subnets and functionalities of the Bittensor MCP server. The goal is for the natural language prompts, which now mention the target subnet, to automatically trigger the correct tool due to the improved descriptions added to the API definitions.

## Claude Desktop Configuration for Local Testing

To test your local build of the Bittensor MCP server with Claude Desktop, use the following configuration. Replace `/Users/canvi/Documents/BitMind/bittensor-mcp/build/index.js` with the actual path to your built `index.js` file if it's different.

```json
{
  "mcpServers": {
    "bittensor_local": {
      "command": "node",
      "args": ["/Users/canvi/Documents/BitMind/bittensor-mcp/build/index.js"],
      "env": {
        "BITMIND_API_TOKEN": "YOUR_BITMIND_API_TOKEN"
      }
    }
  }
}
```
**Note:** Replace `"YOUR_BITMIND_API_TOKEN"` with your actual BitMind API token.

---

**General Notes on Prompts:**

*   The "Prompt Idea" sections provide natural language examples that mention the target Bittensor subnet. Test if Claude automatically selects the correct tool based on these prompts.
*   The `Tool Name` (e.g., `bittensor_local.1-chat`) shows the likely explicit name for reference or direct invocation testing. Adjust the `bittensor_local.` prefix based on your Claude Desktop configuration.
*   The `Example MCP Tool Call (Explicit Invocation)` shows the structure for calling the tool directly.
*   Replace placeholder values (like API tokens, image URLs, or specific model names if you want to test others listed in the enums) with actual data.

---

## Testing Bittensor Subnet 1 (API Path: `/1/chat`)

This subnet provides chat functionalities, often with models like Llama-3.

-   **Tool Name:** `bittensor_local.1-chat` (or similar, based on your MCP client config)
-   **Prompt Idea:** "Using Bittensor Subnet 1, write a short poem about a robot dreaming of electric sheep."
-   **Example MCP Tool Call (Explicit Invocation):**
    ```json
    {
    "tool_name": "bittensor_local.1-chat",
    "arguments": {
      "model": "llama-3",
        "messages": [
          {
            "role": "user",
            "content": "Write a short poem about a robot dreaming of electric sheep."
          }
        ],
        "temperature": 0.7,
        "max_tokens": 150,
        "stream": false
      }
    }
    ```

---

## Testing Bittensor Subnet 18 (API Path: `/18/predict`)

This subnet provides temperature predictions for specific locations and times.

-   **Tool Name:** `bittensor_local.18-predict`
-   **Prompt Idea:** "Using Bittensor Subnet 18, predict the temperature for latitude 40.71, longitude -74.00 between timestamp 1739377986 and 1739464386."
-   **Example MCP Tool Call (Explicit Invocation):**
    ```json
    {
    "tool_name": "bittensor_local.18-predict",
    "arguments": {
      "lat": 40.71,
      "lon": -74.00,
      "start_timestamp": 1739377986,
      "end_timestamp": 1739464386
      }
    }
    ```

---

## Testing Bittensor Subnet 19 (API Paths: `/19/...`)

This subnet provides access to various AI models for text generation, image generation, and image manipulation.

### Chat Completions (API Path: `/19/chat/completions`)
-   **Tool Name:** `bittensor_local.19-chat-completions`
-   **Prompt Idea:** "Using Bittensor Subnet 19, what are three interesting facts about the planet Mars?"
-   **Example MCP Tool Call (Explicit Invocation):**
    ```json
    {
    "tool_name": "bittensor_local.19-chat-completions",
    "arguments": {
      "model": "unsloth/Llama-3.2-3B-Instruct",
        "messages": [
          {
            "role": "user",
            "content": "What are three interesting facts about the planet Mars?"
          }
        ]
      }
    }
    ```

### Text Completions (API Path: `/19/completions`)
-   **Tool Name:** `bittensor_local.19-completions`
-   **Prompt Idea:** "Using Bittensor Subnet 19, continue this story: Once upon a time, in a land filled with magical creatures and towering castles, there lived a..."
-   **Example MCP Tool Call (Explicit Invocation):**
    ```json
    {
    "tool_name": "bittensor_local.19-completions",
    "arguments": {
      "model": "unsloth/Llama-3.2-3B-Instruct",
        "prompt": "Once upon a time, in a land filled with magical creatures and towering castles, there lived a...",
        "max_tokens": 150
      }
    }
    ```

### Text-to-Image (API Path: `/19/text-to-image`)
-   **Tool Name:** `bittensor_local.19-text-to-image`
-   **Prompt Idea:** "Using Bittensor Subnet 19, generate an image of a vibrant cyberpunk city street at night, with neon signs reflecting in puddles, and flying vehicles."
-   **Example MCP Tool Call (Explicit Invocation):**
    ```json
    {
    "tool_name": "bittensor_local.19-text-to-image",
    "arguments": {
      "model": "dataautogpt3/ProteusV0.4-Lightning",
        "prompt": "A vibrant cyberpunk city street at night, with neon signs reflecting in puddles, and flying vehicles.",
        "width": 1024,
        "height": 1024,
        "steps": 10
      }
    }
    ```

### Image-to-Image (API Path: `/19/image-to-image`)
-   **Tool Name:** `bittensor_local.19-image-to-image`
-   **Prompt Idea:** (Provide an image URL) "Using Bittensor Subnet 19 and the image at [Your Image URL], transform the portrait into a watercolor painting style."
-   **Example MCP Tool Call (Explicit Invocation):**
    ```json
    {
    "tool_name": "bittensor_local.19-image-to-image",
    "arguments": {
      "model": "dataautogpt3/ProteusV0.4-Lightning",
        "init_image": "https://example.com/your-image.jpg",
        "prompt": "Transform this portrait into a watercolor painting style.",
        "image_strength": 0.6
      }
    }
    ```

### Avatar Generation (API Path: `/19/avatar`)
-   **Tool Name:** `bittensor_local.19-avatar`
-   **Prompt Idea:** (Provide an image URL) "Using Bittensor Subnet 19 and the image at [Your Image URL], create a fantasy-style avatar based on this image, with elven ears and glowing eyes."
-   **Example MCP Tool Call (Explicit Invocation):**
    ```json
    {
    "tool_name": "bittensor_local.19-avatar",
    "arguments": {
      "init_image": "https://example.com/your-face-image.jpg",
        "prompt": "Create a fantasy-style avatar based on this image, with elven ears and glowing eyes.",
        "ipadapter_strength": 0.7,
        "control_strength": 0.6
      }
    }
    ```

---

## Testing Bittensor Subnet 20 (API Path: `/20/chat`)

This subnet focuses on agentic chat capabilities, allowing the model to potentially use tools.

-   **Tool Name:** `bittensor_local.20-chat`
-   **Prompt Idea:** "Using Bittensor Subnet 20, I need help booking a flight from London to New York for next Tuesday. Can you use the flight search tool to find available options?" (This tests natural language triggering tool use).
-   **Example MCP Tool Call (Explicit Invocation):**
    ```json
    {
    "tool_name": "bittensor_local.20-chat",
    "arguments": {
      "messages": [
          {
            "role": "user",
            "content": "I want to book a flight from London to New York for next Tuesday. Can you find available flights?"
          }
        ],
        "tools": [
          {
            "name": "flight_search_tool",
            "description": "Searches for available flights between two cities on a given date.",
            "arguments": {
              "origin_city": {"type": "string", "description": "The departure city."},
              "destination_city": {"type": "string", "description": "The arrival city."},
              "departure_date": {"type": "string", "description": "The date of departure (YYYY-MM-DD)."}
            }
          }
        ]
      }
    }
    ```

---

## Testing Bittensor Subnet 22 (API Paths: `/22/...`)

This subnet provides web search and extensive Twitter integration functionalities.

### General Search (API Path: `/22/search`)
-   **Tool Name:** `bittensor_local.22-search`
-   **Prompt Idea:** "Using Bittensor Subnet 22, what are the latest advancements in quantum computing? Search web, arxiv, and hackernews from the past month and give me a summary."
-   **Example MCP Tool Call (Explicit Invocation):**
    ```json
    {
    "tool_name": "bittensor_local.22-search",
    "arguments": {
      "prompt": "What are the latest advancements in quantum computing?",
        "tools": ["web", "arxiv", "hackernews"],
        "model": "NOVA",
        "date_filter": "PAST_MONTH",
        "result_type": "LINKS_WITH_FINAL_SUMMARY"
      }
    }
    ```

### Twitter Search (General) (API Path: `/22/twitter`)
-   **Tool Name:** `bittensor_local.22-twitter` (Note: This is a GET request, parameters are sent in the query string)
-   **Prompt Idea:** "Using Bittensor Subnet 22, find recent tweets about 'bittensor' from verified accounts, sorted by 'Latest'."
    *   (Invocation requires client to handle GET with query params: `query=Bittensor&verified=true&sort=Latest`)

### Fetching Specific Tweet URLs (API Path: `/22/twitter/urls`)
-   **Tool Name:** `bittensor_local.22-twitter-urls` (Note: GET request)
-   **Prompt Idea:** "Using Bittensor Subnet 22, get details for these tweet URLs: https://x.com/user/status/123, https://x.com/anotheruser/status/456"
    *   (Invocation requires client to handle GET with query param: `urls=["https://x.com/user/status/123","https://x.com/anotheruser/status/456"]`)

### Fetching User's Tweets (API Path: `/22/twitter/user/posts`)
-   **Tool Name:** `bittensor_local.22-twitter-user-posts` (Note: GET request)
-   **Prompt Idea:** "Using Bittensor Subnet 22, show the latest 5 tweets from the user 'opentensor' that mention 'subnet'."
    *   (Invocation requires client to handle GET with query params: `user=opentensor&count=5&query=subnet`)

*(Other Twitter endpoints like `/22/twitter/post`, `/22/twitter/user/latest`, `/22/twitter/user/replies`, `/22/twitter/post/replies`, `/22/twitter/post/retweets`, `/22/twitter/user` follow a similar GET request pattern with specific parameters as defined in `openapi.json`. Update Prompt Ideas similarly for explicit invocation testing.)*

---

## Testing Bittensor Subnet 32 (API Path: `/32/detect-text`)

This subnet is for AI-generated text detection.

-   **Tool Name:** `bittensor_local.32-detect-text`
-   **Prompt Idea:** (Provide a block of text) "Using Bittensor Subnet 32, can you analyze if this text was likely written by an AI?: [Your text here]."
-   **Example MCP Tool Call (Explicit Invocation):**
    ```json
    {
    "tool_name": "bittensor_local.32-detect-text",
    "arguments": {
      "text": "This is a sample text to check if it was generated by an AI. It contains several complex sentences and nuanced vocabulary to test the detection capabilities. We are exploring the boundaries of artificial intelligence and its impact on content creation."
      }
    }
    ```

---

## Testing Bittensor Subnet 34 (API Paths: `/34/detect-image`, `/34/detect-video`)

This subnet is for detecting AI-generated images and videos.

### AI Image Detection (API Path: `/34/detect-image`)
-   **Tool Name:** `bittensor_local.34-detect-image`
-   **Prompt Idea:** (Provide an image URL) "Using Bittensor Subnet 34, check if the image at [Your Image URL] is AI-generated."
-   **Example MCP Tool Call (Explicit Invocation):**
    ```json
    {
    "tool_name": "bittensor_local.34-detect-image",
    "arguments": {
      "image": "https://example.com/test-image.jpg"
      }
    }
    ```

### AI Video Detection (API Path: `/34/detect-video`)
-   **Tool Name:** `bittensor_local.34-detect-video`
-   **Note:** This endpoint expects `multipart/form-data` with a video file. Testing via a simple JSON prompt is not directly applicable. You would need a client capable of file uploads.
-   **Prompt Idea (Conceptual for client):** "Using Bittensor Subnet 34, analyze the uploaded video file `my_video.mp4` for AI generation."

---

## Testing Bittensor Subnet 42 (API Paths: `/42/...`)

This subnet provides asynchronous job-based Twitter search capabilities.

### Initiate Search Job (API Path: `/42/search`)
-   **Tool Name:** `bittensor_local.42-search`
-   **Prompt Idea:** "Using Bittensor Subnet 42, start a Twitter search job for tweets mentioning 'AI safety' with max 50 results."
-   **Example MCP Tool Call (Explicit Invocation):**
    ```json
    {
    "tool_name": "bittensor_local.42-search",
    "arguments": {
      "type": "twitter-scraper",
      "arguments": {
        "type": "searchbyquery",
        "query": "AI safety",
        "max_results": 50
        }
      }
    }
    ```

### Check Job Status (API Path: `/42/status/{jobUUID}`)
-   **Tool Name:** `bittensor_local.42-status` (Note: GET request with path parameter)
-   **Prompt Idea:** "Using Bittensor Subnet 42, check the status for Twitter search job UUID [Job UUID]."
    *   (Invocation requires client to handle GET with path parameter)

### Get Job Result (API Path: `/42/result/{jobUUID}`)
-   **Tool Name:** `bittensor_local.42-result` (Note: GET request with path parameter)
-   **Prompt Idea:** "Using Bittensor Subnet 42, get the results for completed Twitter search job UUID [Job UUID]."
    *   (Invocation requires client to handle GET with path parameter)

---

## Testing Bittensor Subnet 47 (API Paths: `/47/compress/text`, `/47/compress/messages`)

This subnet provides text and message compression services.

### Text Compression (API Path: `/47/compress/text`)
-   **Tool Name:** `bittensor_local.47-compress-text`
-   **Prompt Idea:** (Provide a long paragraph) "Using Bittensor Subnet 47, please compress this text for me: [Your long paragraph here]."
-   **Example MCP Tool Call (Explicit Invocation):**
    ```json
    {
    "tool_name": "bittensor_local.47-compress-text",
    "arguments": {
      "text": "The quick brown fox jumps over the lazy dog. This sentence is often used to demonstrate all the letters of the alphabet. It is a classic pangram and serves as a good example for text processing tasks such as compression or analysis. Furthermore, effective compression can lead to significant savings in storage and transmission costs, especially for large datasets."
      }
    }
    ```

### Message Compression (API Path: `/47/compress/messages`)
-   **Tool Name:** `bittensor_local.47-compress-messages`
-   **Prompt Idea:** (Provide a chat history) "Using Bittensor Subnet 47, can you compress this conversation history?: User: 'Hello, how are you today?', Assistant: 'I am functioning optimally, thank you for your inquiry! How may I be of service to you on this fine day?', User: 'I require detailed information regarding advanced text compression algorithms, specifically those suitable for natural language.'"
-   **Example MCP Tool Call (Explicit Invocation):**
    ```json
    {
    "tool_name": "bittensor_local.47-compress-messages",
    "arguments": {
      "messages": [
          {"role": "user", "content": "Hello, how are you today?"},
          {"role": "assistant", "content": "I am functioning optimally, thank you for your inquiry! How may I be of service to you on this fine day?"},
          {"role": "user", "content": "I require detailed information regarding advanced text compression algorithms, specifically those suitable for natural language."}
        ]
      }
    }
    ```

---

## Testing Bittensor Subnet 64 (API Paths: `/64/chat/completions`, `/64/completions`)

This subnet offers advanced chat and text completion functionalities, potentially using models like Qwen or DeepSeek V3.

### Chat Completions (API Path: `/64/chat/completions`)
-   **Tool Name:** `bittensor_local.64-chat-completions`
-   **Prompt Idea:** "Using Bittensor Subnet 64, generate a comprehensive plan for learning Rust, including recommended resources, a 3-month timeline, and key project ideas for practice."
-   **Example MCP Tool Call (Explicit Invocation):**
    ```json
    {
    "tool_name": "bittensor_local.64-chat-completions",
    "arguments": {
      "model": "Qwen/Qwen2.5-VL-32B-Instruct",
        "messages": [
          {
            "role": "user",
            "content": "Generate a comprehensive plan for learning a new programming language like Rust, including recommended resources, a structured timeline for 3 months, and key project ideas for practice."
          }
        ],
        "max_tokens": 700
      }
    }
    ```

### Text Completions (API Path: `/64/completions`)
-   **Tool Name:** `bittensor_local.64-completions`
-   **Prompt Idea:** "Using Bittensor Subnet 64, complete this sentence: The future of renewable energy depends heavily on advancements in battery technology, grid modernization, and..."
-   **Example MCP Tool Call (Explicit Invocation):**
    ```json
    {
    "tool_name": "bittensor_local.64-completions",
    "arguments": {
      "model": "deepseek-ai/DeepSeek-V3-0324",
        "prompt": "The future of renewable energy depends heavily on advancements in battery technology, grid modernization, and...",
        "max_tokens": 250
      }
    }
    ```

---

This list should provide a good starting point for testing the Bittensor MCP server. You can create variations of these prompts to test different parameters and edge cases.
