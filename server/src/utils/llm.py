from openai import OpenAI
import json
from datetime import datetime
from bson import ObjectId

from utils.mongodb import get_database
from utils.nlp import model as embedder_model, cosine_similarity
from utils.context_search import search_context
from utils.md_to_html import md_to_html

llm = OpenAI()

tools = [
    {
        "type": "function",
        "name": "search_knowledge_base",
        "description": "Search the knowledge base for information to answer the user's question",
        "parameters": {
            "type": "object",
            "properties": {
                "queries": {
                    "type": "array",
                    "items": {
                        "type": "string",
                        "description": "A short query to search the knowledge base for"
                    },
                    "maxItems": 3,
                }
            },
            "required": ["queries"],
            "strict": True,
            "additionalProperties": False,
        },
    }
]

def add_system_prompt(input_list, chatbot):
    return [
        {
            "role": "system",
            "content": "You are a helpful assistant that can answer questions according to the knowledge base.\n" +
                        f"Your name is [{chatbot['name']}] and your description is [{chatbot['description']}].\n" +
                        f"You need to act according to your personality traits: [{chatbot['personality_traits']}].\n" +
                        "You must only answer the questsions you can find answers to in the knowledge base.\n" +
                        "You must politely inform the user that you don't know the answer to the question.\n" +
                        "If the question is related to your domain, you must always use the Knowledge Base Search tool to answer the question.\n" +
                        "You can give answers in the markdown format if it will help the user understand the answer better.\n"
        }
    ] + input_list

def filter_input_list(input_list, limit=5):
    if len(input_list) < limit:
        return input_list

    if input_list[-1]["role"] != "user":
        return input_list

    encoded_list = embedder_model.encode(input_list)
    message_embedding = encoded_list[-1]

    result = []

    for message, embedding in zip(input_list, encoded_list):
        distance = cosine_similarity(message_embedding, embedding)
        if distance > 0.5:
            result.append(message)

    return result

def generate_response(input_list, chatbot, chat_id):
    messages_collection = get_database()["messages"]
    documents_collection = get_database()["documents"]
    response = None

    expertise_docs = chatbot["expertise_docs"]
    expertise_docs = list(map(lambda x: documents_collection.find_one({"_id": ObjectId(x)})["name"], expertise_docs))

    tool_choice = "required"
    input_list = filter_input_list(input_list)

    while True:
        response = llm.responses.create(
            model="gpt-4o-mini",
            input=add_system_prompt(input_list, chatbot),
            tools=tools,
            tool_choice=tool_choice,
        )
        tool_choice = "auto"

        input_list += response.output
        tool_calls = []

        for item in response.output:
            if item.type == "function_call":
                if item.name == "search_knowledge_base":
                    args = json.loads(item.arguments)
                    context = search_context(args["queries"], expertise_docs)

                    tool_calls.append({
                        "type": "function_call_output",
                        "call_id": item.call_id,
                        "output": json.dumps({
                            "results": context
                        }),
                    })

        if len(tool_calls) > 0:
            input_list += tool_calls
        else:
            break

    messages_collection.insert_one({
        "created_at": datetime.now(),
        "chat_id": ObjectId(chat_id),
        "message": response.output_text,
        "role": "assistant"
    })

    return md_to_html(response.output_text)
        