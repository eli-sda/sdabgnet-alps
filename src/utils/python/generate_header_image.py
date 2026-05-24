"""
Script to generate landscape header banners from any local image (jpg, png or webP format).
Creates a blurred and darkened background clone to fill the aspect ratio nicely.
Ensures the original image is fully visible without cropping.

Usage:
    python generate_header_image.py path/to/image.jpg
    python generate_header_image.py path/to/image.jpg --width 1920 --height 1080 -o custom_header.jpg
"""

import os
import argparse
from PIL import Image, ImageFilter, ImageEnhance, ImageOps

# Default configuration parameters
DEFAULT_WIDTH  = 1200
DEFAULT_HEIGHT = 630
BLUR_RADIUS   = 20
DARKEN_FACTOR = 0.50  # 0=completely black, 1=original brightness


def process_header_image(input_path: str, output_path: str, width: int, height: int) -> None:
    """
    Creates a clean header banner from an input image path:
    - Background: stretched, blurred, and darkened version of the image.
    - Foreground: original image, fitted entirely within the dimensions without cropping.
    """
    if not os.path.exists(input_path):
        print(f"Error: Input file '{input_path}' does not exist.")
        return

    try:
        # Load and convert image to RGB format
        with Image.open(input_path) as img:
            source_img = img.convert('RGB')
            
        canvas = Image.new('RGB', (width, height))

        # --- Background layer: stretch, blur and darken ---
        bg = source_img.copy().resize((width, height), Image.LANCZOS)
        bg = bg.filter(ImageFilter.GaussianBlur(radius=BLUR_RADIUS))
        bg = ImageEnhance.Brightness(bg).enhance(DARKEN_FACTOR)
        canvas.paste(bg, (0, 0))

        # --- Foreground layer: scale to fit within boundaries and center ---
        fg = ImageOps.contain(source_img, (width, height), Image.LANCZOS)

        x = (width - fg.width) // 2
        y = (height - fg.height) // 2
        canvas.paste(fg, (x, y))

        # Save the final image in the format matching the output file extension
        ext = os.path.splitext(output_path)[1].lower()
        if ext == '.webp':
            canvas.save(output_path, 'WEBP', quality=90, method=6)
        elif ext == '.png':
            canvas.save(output_path, 'PNG', optimize=True)
        else:
            canvas.save(output_path, 'JPEG', quality=90, optimize=True)
        print(f"✓ Successfully generated header: '{output_path}' ({width}x{height})")

    except Exception as e:
        print(f"Error processing image: {e}")


def main():
    parser = argparse.ArgumentParser(description="Generate blurred background header images.")
    parser.add_argument("input_image", help="Path to the local source image file")
    parser.add_argument("-o", "--output", help="Path to save the output image (format inferred from extension: .jpg, .webp, etc.)", default="header_output.jpg")
    parser.add_argument("--width", type=int, default=DEFAULT_WIDTH, help="Output image width")
    parser.add_argument("--height", type=int, default=DEFAULT_HEIGHT, help="Output image height")

    args = parser.parse_args()

    process_header_image(args.input_image, args.output, args.width, args.height)


if __name__ == '__main__':
    main()