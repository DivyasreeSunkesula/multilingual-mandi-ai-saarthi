from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import spacy
# uvicorn main:app --reload

app = FastAPI()

# allow frontend calls from browser
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

nlp = spacy.load("en_core_web_sm")

# fair mandi prices (demo data)
FAIR_PRICES = {
    "onion": 20,
    "potato": 18,
    "tomato": 25
}

# multilingual word mapping → English item
MULTI_MAP = {
    "onion": ["onion", "onions", "ullipaya", "ulli", "kanda"],
    "potato": ["potato", "potatoes", "aloo", "bangaladumpa"],
    "tomato": ["tomato", "tomatoes", "tamata"]
}

class InputText(BaseModel):
    text: str

def detect_item(word):
    for item, words in MULTI_MAP.items():
        if word in words:
            return item
    return None

@app.post("/analyze")
def analyze(data: InputText):
    text = data.text.lower()
    doc = nlp(text)

    price = None
    item_found = None

    for token in doc:
        # number detection
        if token.like_num and price is None:
            try:
                price = int(token.text)
            except:
                pass

        # multilingual item detection
        item = detect_item(token.lemma_)
        if item and item_found is None:
            item_found = item

    if not item_found or not price:
        return {"error": "Could not find item or price"}

    fair_price = FAIR_PRICES[item_found]

    if price <= fair_price:
        status = "GOOD"
        color = "green"
        suggested = fair_price
    elif price <= fair_price * 1.2:
        status = "OK"
        color = "orange"
        suggested = fair_price
    else:
        status = "HIGH"
        color = "red"
        suggested = fair_price

    return {
        "item": item_found,
        "spoken_price": price,
        "fair_price": fair_price,
        "status": status,
        "color": color,
        "suggested_counter": suggested
    }
