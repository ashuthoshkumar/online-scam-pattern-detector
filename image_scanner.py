import requests

def extract_text_from_image(image_file):
    try:
        url = "https://api.ocr.space/parse/image"

        files = {"file": image_file}
        data = {
            "apikey": "helloworld",  # free public API key
            "language": "eng"
        }

        response = requests.post(url, files=files, data=data)
        result = response.json()

        if result.get("IsErroredOnProcessing"):
            return None, "OCR error"

        parsed = result.get("ParsedResults")

        if not parsed:
            return None, "No text detected"

        text = parsed[0]["ParsedText"].strip()

        if text == "":
            return None, "No text found"

        return text, None

    except Exception as e:
        return None, str(e)