import pytesseract
from PIL import Image
import io

# Path to tesseract
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def extract_text_from_image(image_file):
    try:
        # Open image
        image = Image.open(io.BytesIO(image_file.read()))

        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')

        # Extract text using OCR
        extracted_text = pytesseract.image_to_string(
            image,
            lang='eng',
            config='--psm 6'
        )

        # Clean extracted text
        cleaned = extracted_text.strip()

        if not cleaned:
            return None, "No text found in image"

        return cleaned, None

    except Exception as e:
        return None, f"Image processing error: {str(e)}"