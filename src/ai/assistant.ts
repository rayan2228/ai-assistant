import { ChatGroq } from "@langchain/groq";
import { app } from "./graph";
import { tools } from "./tools";

export const assistant = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0,
}).bindTools(tools);

async function main() {
  const response = await app.invoke({
    messages: [
      {
        role: "user",
        content: "what is today's weather in Dhaka?",
      },
    ],
  });
  console.log(
    "ai message",
    response.messages[response.messages.length - 1]?.content
  );
}

export default main;
