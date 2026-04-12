from langchain.embeddings import HuggingFaceEmbeddings

# Load embedding model (FREE, no API key needed)
embedding_model = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2"
)

def get_embedding(text):
    return embedding_model.embed_query(text)