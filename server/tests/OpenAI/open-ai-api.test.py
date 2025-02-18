from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI()

prompt = input("Enter a prompt: ")

completion = client.chat.completions.create(
    model="gpt-4o-mini",
    store=True,
    messages=[
        {"role": "user", "content": prompt}
    ]
)

print("Bot:", completion.choices[0].message.content)