import pickle
from ml.preprocess import preprocess_text, translate_to_english

def predict_message(text):
    # Load model and vectorizer
    with open('ml/model.pkl', 'rb') as f:
        model = pickle.load(f)
    with open('ml/vectorizer.pkl', 'rb') as f:
        vectorizer = pickle.load(f)

    # Translate to English first
    translated_text, detected_lang = translate_to_english(text)

    # Preprocess and predict
    cleaned = preprocess_text(translated_text)
    vectorized = vectorizer.transform([cleaned])
    prediction = model.predict(vectorized)[0]
    probability = model.predict_proba(vectorized)[0]

    confidence = round(max(probability) * 100, 2)

    if prediction == 1:
        return {
            "result": "SCAM",
            "confidence": confidence,
            "detected_lang": detected_lang,
            "translated_text": translated_text
        }
    else:
        return {
            "result": "LEGITIMATE",
            "confidence": confidence,
            "detected_lang": detected_lang,
            "translated_text": translated_text
        }