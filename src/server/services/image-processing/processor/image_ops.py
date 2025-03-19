from PIL import Image
from io import BytesIO

def has_transparency(image: Image):
    return image.mode in ('RGBA', 'LA', 'PA', 'La') or (image.mode == 'P' and 'transparency' in image.info)

def create_variants(image_data: bytes) -> dict:
    image = Image.open(BytesIO(image_data)) 
    original_format = image.format
    variants = {} 
    thumbnail = resize_image(image, 250)
    lowres = resize_image(image, 1000)
    
    if original_format == 'PNG':
        new_format = 'PNG'
        # Converting non-transparent PNGs to JPEGs to save on space since the alpha channel is unused.
        if not has_transparency(image) and image.mode == 'RGB':
            new_format = 'JPEG'
        variants['thumbnail'] = image_to_bytes(thumbnail, quality=90, saveAsFormat=new_format)
        variants['low_res'] = image_to_bytes(lowres, quality=85, saveAsFormat=new_format)
    else:
        variants['thumbnail'] = image_to_bytes(thumbnail, quality=90)
        variants['low_res'] = image_to_bytes(lowres, quality=85)
    return variants

def resize_image(image: Image, max_width: int, compression_level: int = 6) -> Image:
    if has_transparency(image) and image.mode != 'RGBA':
        image = image.convert('RGBA')

    ratio = max_width / image.width
    new_height = int(image.height * ratio)
    if ratio < 1:  # No need to resize images that are already smaller than max width
        return image.resize((max_width, new_height), Image.LANCZOS)
    return image

def image_to_bytes(image: Image, quality: int, saveAsFormat: str = None, compression_level: int = 6) -> bytes:
    buffer = BytesIO()
    format_to_use = saveAsFormat if saveAsFormat else image.format or 'JPEG'
    if format_to_use.upper() == 'PNG':
        image.save(buffer, format=format_to_use, optimize=True, compression=compression_level)
    else:
        image.save(buffer, format=format_to_use, quality=quality)
    return buffer.getvalue()