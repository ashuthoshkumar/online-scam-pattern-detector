import pytesseract
from PIL import Image
import io

pytesseract.pytesseract.tesseract_cmd = "/usr/bin/tesseract"

def extract_text_from_image(image_file):
    try:
        image = Image.open(io.BytesIO(image_file.read()))

        if image.mode != "RGB":
            image = image.convert("RGB")

        extracted_text = pytesseract.image_to_string(image)

        print("OCR TEXT:", extracted_text)   # DEBUG LINE

        if not extracted_text.strip():
            return None, "No text found in image"

        return extracted_text.strip(), None

    except Exception as e:
        return None, str(e)