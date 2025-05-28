import base64
from io import BytesIO
from PIL import Image

def save_image(image_data):
    """
    Save image data from base64 string and return the binary data
    """
    try:
        # Remove the data URL prefix if present
        if image_data.startswith('data:image'):
            image_data = image_data.split(',')[1]
            
        # Decode base64 string to binary
        image_binary = base64.b64decode(image_data)
        
        # Open image using PIL
        image = Image.open(BytesIO(image_binary))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
            
        # Resize image if too large (optional)
        max_size = (800, 800)
        image.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        # Save to BytesIO
        output = BytesIO()
        image.save(output, format='JPEG', quality=85)
        
        return output.getvalue()
        
    except Exception as e:
        raise Exception(f"Error processing image: {str(e)}") 