import easyocr
import numpy as np
from PIL import Image
import io

# Initialize OCR reader
reader = easyocr.Reader(['en'])

def extract_text_from_image(image_file):
    try:
        # Open image
        image = Image.open(io.BytesIO(image_file.read()))

        # Convert to numpy array
        img_array = np.array(image)

        # OCR detection
        result = reader.readtext(img_array)

        # Extract text
        text = " ".join([r[1] for r in result])

        if text.strip() == "":
            return None, "No text detected"

        return text, None

    except Exception as e:
        return None, str(e)