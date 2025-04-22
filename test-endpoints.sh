#!/bin/bash

# Base URL for the MCP server
BASE_URL="http://localhost:8787/v1/mcp"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to test an endpoint and report status
test_endpoint() {
    local function_name=$1
    local request_body=$2
    
    echo -n "Testing $function_name endpoint... "
    
    # Make the request and capture the response
    response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL" \
        -H "Content-Type: application/json" \
        -d "$request_body")
    
    # Split response into body and status code
    body=$(echo "$response" | head -n -1)
    status_code=$(echo "$response" | tail -n 1)
    
    # Check if the response is valid JSON
    if echo "$body" | jq . >/dev/null 2>&1; then
        # Check for error in response
        error=$(echo "$body" | jq -r '.error // empty')
        if [ -n "$error" ]; then
            echo -e "${RED}ERROR: $error${NC}"
            echo "Response:"
            echo "$body" | jq '.'
        elif [ "$status_code" -eq 200 ]; then
            echo -e "${GREEN}SUCCESS${NC}"
        else
            echo -e "${RED}FAILED (Status: $status_code)${NC}"
            echo "Response:"
            echo "$body" | jq '.'
        fi
    else
        echo -e "${RED}INVALID JSON RESPONSE${NC}"
        echo "Raw response:"
        echo "$response"
    fi
    
    echo "----------------------------------------"
}

echo "Starting MCP endpoint tests..."
echo "----------------------------------------"

# Test chat endpoint
test_endpoint "chat" '{
    "request": {
        "function": "chat",
        "parameters": {
            "model": "llama-3",
            "messages": [
                {
                    "role": "user",
                    "content": "Hello, how are you?"
                }
            ],
            "temperature": 0.1,
            "max_tokens": 500,
            "top_p": 1,
            "stream": false,
            "logprobs": false
        }
    }
}'

# Test cortext-chat endpoint
test_endpoint "cortext-chat" '{
    "request": {
        "function": "cortext-chat",
        "parameters": {
  "messages": [
    {
      "role": "user",
      "content": "What is the capital of France?"
    }
  ],
  "model": "unsloth/Llama-3.2-3B-Instruct",
  "temperature": 0.5,
  "max_tokens": 500,
  "top_p": 0.5,
  "stream": false
}
    }
}'

# Test qna endpoint
test_endpoint "qna" '{
    "request": {
        "function": "qna",
        "parameters": {
            "messages": [
                {
                    "role": "user",
                    "content": "Need help calculating the tip, what is 10% tip on a bill totalling $100"
                }
            ],
            "tools": [
                {
                    "name": "tip_calculator",
                    "description": "Calculate the tip amount",
                    "arguments": {
                        "bill_amount": {
                            "required": true,
                            "type": "number",
                            "description": "the bill amount in dollars"
                        },
                        "tip_percent": {
                            "required": true,
                            "type": "number",
                            "description": "the tip percentage as a whole number"
                        }
                    }
                }
            ]
        }
    }
}'

# Test search endpoint
test_endpoint "search" '{
    "request": {
        "function": "search",
        "parameters": {
            "prompt": "What is Bittensors approach to decentralized machine learning?",
            "tools": [
                "web",
                "reddit",
                "hackernews",
                "arxiv"
            ],
            "model": "NOVA",
            "date_filter": "PAST_MONTH",
            "streaming": true,
            "result_type": "LINKS_WITH_FINAL_SUMMARY",
            "system_message": "Focus on technical details and recent developments."
        }
    }
}'

# Test cortext-text-to-image endpoint
test_endpoint "cortext-text-to-image" '{
    "request": {
        "function": "cortext-text-to-image",
        "parameters": {
            "prompt": "A beautiful sunset over mountains",
            "model": "cortext-image",
            "style": "vivid",
            "size": "1024x1024",
            "quality": "hd",
            "steps": 30,
            "cfg_scale": 8,
            "seed": 0
        }
    }
}'

# Test vision-chat endpoint
test_endpoint "vision-chat" '{
    "request": {
        "function": "vision-chat",
        "parameters": {
            "messages": [
                {
                    "role": "user",
                    "content": "Hello, how are you?"
                }
            ],
            "model": "llama-3",
            "temperature": 0.1,
            "max_tokens": 100,
            "top_p": 1,
            "stream": false,
            "logprobs": false
        }
    }
}'

# Test vision-text-to-image endpoint
test_endpoint "vision-text-to-image" '{
    "request": {
        "function": "vision-text-to-image",
        "parameters": {
            "text_prompts": [
                {
                    "text": "4 hedgehogs, wearing tuxedos, riding on the back of a crocodile."
                }
            ],
            "cfg_scale": 2,
            "height": 1024,
            "width": 1024,
            "steps": 8,
            "engine": "proteus"
        }
    }
}'

# Test detect-image endpoint
test_endpoint "detect-image" '{
    "request": {
        "function": "detect-image",
        "parameters": {
            "image": "https://picsum.photos/256"
        }
    }
}'

# Test analyze-text endpoint
test_endpoint "analyze-text" '{
    "request": {
        "function": "analyze-text",
        "parameters": {
            "text": "This is a sample text to analyze. This is a sample text to analyze."
        }
    }
}'

echo "Test complete!" 