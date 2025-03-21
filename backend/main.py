from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from openai import OpenAI  # Import OpenAI client
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Request Models
class CodeRequest(BaseModel):
    prompt: str
    language: str

class ModifyRequest(BaseModel):
    code: str
    modification: str

@app.post("/generate_code/")
def generate_code(request: CodeRequest):
    try:
        response = client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[
                {
                    "role": "user",
                    "content": f"Write a valid, executable {request.language} program for the following prompt:\n"
                               f"'{request.prompt}'.\n"
                               f"Ensure the output is pure {request.language} code only—no explanations, comments, markdown, or extra text."
                }
            ]
        )

        # Extract code from OpenAI response
        code_output = response.choices[0].message.content.strip()

        # Remove Markdown-style code block syntax
        if code_output.startswith("```"):
            code_output = code_output.split("\n", 1)[-1]
        if code_output.endswith("```"):
            code_output = code_output.rsplit("\n", 1)[0]

        return {"language": request.language, "code": code_output}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/modify_code/")
def modify_code(request: ModifyRequest):
    try:
        response = client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[
                {
                    "role": "user",
                    "content": f"Modify the following code:\n"
                               f"{request.code}\n\n"
                               f"Modification required: {request.modification}.\n"
                               f"Ensure the output is pure code only—no explanations, comments, markdown, or extra text."
                }
            ]
        )

        modified_code = response.choices[0].message.content.strip()

        # Ensure the response does NOT contain markdown formatting
        if modified_code.startswith("```"):
            modified_code = "\n".join(modified_code.split("\n")[1:])  # Remove first line
        if modified_code.endswith("```"):
            modified_code = "\n".join(modified_code.split("\n")[:-1])  # Remove last line

        return {"modified_code": modified_code.strip()}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def home():
    return {"message": "Conversational Code Generation API is running!"}