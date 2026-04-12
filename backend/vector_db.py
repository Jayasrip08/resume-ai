import chromadb
from chromadb.utils import embedding_functions

# Embedding model
embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)

# Persistent client — data survives server restarts
client = chromadb.PersistentClient(path="./chroma_store")

# Create or load collection
collection = client.get_or_create_collection(
    name="resumes",
    embedding_function=embedding_function
)