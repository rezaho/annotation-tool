# Import Spacy Tokenizer
from spacy.tokenizer import Tokenizer
from spacy.lang.en import English

nlp = English()
# Create a Tokenizer with the default settings for English
# including punctuation rules and exceptions
tokenizer = nlp.Defaults.create_tokenizer(nlp)

def tokenize_doc(doc):
    tokens = tokenizer(doc).to_json()
    for i, tok in enumerate(tokens.copy()["tokens"]):
        tokens["tokens"][i]["text"] = tokens["text"][tok["start"]:tok["end"]]

    return tokens