from PIL import Image
from io import BytesIO

def create_variants(image_data: bytes) -> dict:
    image = Image.open(BytesIO(image_data))
    
    variants = {}
    
    thumbnail = resize_image(image, 300)
    variants['thumbnail'] = image_to_bytes(thumbnail, quality=70)
    
    lowres = resize_image(image, 1200)
    variants['low-res'] = image_to_bytes(lowres, quality=80)
    
    return variants

def resize_image(image: Image, max_width: int) -> Image:
    ratio = max_width / image.width
    new_height = int(image.height * ratio)
    
    if ratio < 1:  # No need to resize images that are already smaller than max width
        return image.resize((max_width, new_height), Image.LANCZOS)
    return image

def image_to_bytes(image: Image, quality: int, saveAsFormat: str = None) -> bytes:
    buffer = BytesIO()
    format_to_use = saveAsFormat if saveAsFormat else image.format or 'JPEG'
    image.save(buffer, format=format_to_use, quality=quality)
    return buffer.getvalue()