SKILLS = [
    # Languages
    "python", "java", "javascript", "typescript", "c++", "c#", "go", "rust",
    "ruby", "php", "swift", "kotlin", "scala", "r", "matlab",

    # Web
    "react", "vue", "angular", "next.js", "node.js", "express", "django",
    "flask", "fastapi", "html", "css", "tailwind",

    # Data & ML
    "machine learning", "deep learning", "natural language processing", "nlp",
    "computer vision", "tensorflow", "pytorch", "keras", "scikit-learn",
    "pandas", "numpy", "matplotlib", "data analysis", "data science",

    # Cloud & DevOps
    "aws", "azure", "gcp", "google cloud", "docker", "kubernetes", "terraform",
    "jenkins", "github actions", "ci/cd", "linux",

    # Databases
    "sql", "postgresql", "mysql", "mongodb", "redis", "cassandra",
    "elasticsearch", "sqlite",

    # Other
    "git", "agile", "scrum", "rest api", "graphql", "microservices",
    "spark", "hadoop", "kafka", "airflow"
]

def extract_skills(text):
    text = text.lower()
    found_skills = []

    for skill in SKILLS:
        if skill in text:
            found_skills.append(skill)

    return list(set(found_skills))