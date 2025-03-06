#rag logic based on https://tomstechacademy.com/build-a-chatbot-with-rag-retrieval-augmented-generation/
from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_chroma import Chroma
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable cross-origin requests if your frontend is hosted separately

# --- Configuration & Initialization ---
DATA_PATH = os.getenv("DATA_PATH", "data")
CHROMA_PATH = os.getenv("CHROMA_PATH", "chroma_db")

# Initialize the embeddings model and LLM
embeddings_model = OpenAIEmbeddings(model="text-embedding-3-large")
llm = ChatOpenAI(temperature=0.5, model='gpt-4o-mini')

# Connect to the Chroma vector store
vector_store = Chroma(
    collection_name="example_collection",
    embedding_function=embeddings_model,
    persist_directory=CHROMA_PATH,
)

# Set up the retriever to get top 5 relevant document chunks
num_results = 5
retriever = vector_store.as_retriever(search_kwargs={'k': num_results})

@app.route('/api/query', methods=['POST'])
def query_endpoint():
    # Retrieve JSON payload from the POST request
    data = request.get_json()
    message = data.get('query', '')
    history = data.get('history', '')
    character = "Hatter"  # Change the character if desired

    # Retrieve relevant documents (you can switch to get_relevant_documents if needed)
    docs = retriever.invoke(message)
    knowledge = "\n\n".join(doc.page_content for doc in docs)

    # Build the prompt for the LLM
    rag_prompt = f"""
This is a NPC roleplaying game between the user and a character from the knowledge context.
You will be playing the role of the {character} from the knowledge context.
You will provide dialogue and responses based exactly on how the characters converse in the knowledge provided.
The question: {message}
Conversation history: {history}
The knowledge: {knowledge}
    """

    # Generate a response from the LLM (streaming if available)
    response_text = ""
    if hasattr(llm, "stream"):
        for response in llm.stream(rag_prompt):
            response_text += response.content
    else:
        # Fallback to synchronous call if streaming is not available
        result = llm(rag_prompt)
        response_text = result.content

    return jsonify({"response": response_text})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
