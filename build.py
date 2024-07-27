import os
import sys
import base64

def escape_backticks(text):
    return text.replace('`', '\\`')

def read_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        print(f"Successfully read {file_path}")
        return content
    except FileNotFoundError:
        print(f"Error: File not found - {file_path}")
        return None
    except Exception as e:
        print(f"Error reading {file_path}: {str(e)}")
        return None

def read_binary_file(file_path):
    try:
        with open(file_path, 'rb') as file:
            content = file.read()
        print(f"Successfully read binary file {file_path}")
        return content
    except FileNotFoundError:
        print(f"Error: File not found - {file_path}")
        return None
    except Exception as e:
        print(f"Error reading {file_path}: {str(e)}")
        return None

def encode_image_to_base64(image_path):
    image_content = read_binary_file(image_path)
    if image_content is None:
        return None
    base64_encoded = base64.b64encode(image_content).decode('utf-8')
    return f"data:image/webp;base64,{base64_encoded}"

def build_index_html():
    src_dir = './src'
    www_dir = './www'
    
    try:
        os.makedirs(www_dir, exist_ok=True)
        print(f"Output directory {www_dir} is ready")
    except Exception as e:
        print(f"Error creating output directory {www_dir}: {str(e)}")
        return
    
    # Read source files
    index_html = read_file(os.path.join(src_dir, 'index.html'))
    prompt = read_file(os.path.join(src_dir, 'prompt.txt'))
    nsfw_prompt = read_file(os.path.join(src_dir, 'nsfw_prompt.txt'))
    
    # Check if all files were read successfully
    if None in (index_html, prompt, nsfw_prompt):
        print("Error: One or more required files could not be read. Aborting.")
        return
    
    # Encode images to base64
    image_base64 = encode_image_to_base64(os.path.join(src_dir, 'image.webp'))
    image2_base64 = encode_image_to_base64(os.path.join(src_dir, 'image2.webp'))
    
    if None in (image_base64, image2_base64):
        print("Error: One or more image files could not be encoded. Aborting.")
        return
    
    # Replace image sources in HTML
    index_html = index_html.replace('src="image.webp"', f'src="{image_base64}"')
    index_html = index_html.replace("backgroundImage.src = 'image.webp'", f"backgroundImage.src = '{image_base64}'")
    index_html = index_html.replace("backgroundImage.src = 'image2.webp'", f"backgroundImage.src = '{image2_base64}'")
    
    print("Successfully embedded images into HTML")
    
    # Escape backticks in prompts
    prompt = escape_backticks(prompt)
    nsfw_prompt = escape_backticks(nsfw_prompt)
    print("Successfully escaped backticks in prompt files")
    
    # Prepare the content to be appended
    append_content = f"""
    const prompt_template = `
{prompt}
`;
    const nsfw_prompt_template = `
{nsfw_prompt}
`;
  </script>
</body>

</html>
"""
    
    # Combine the content
    full_html = index_html + append_content
    
    # Write the combined content to the output file
    output_path = os.path.join(www_dir, 'index.html')
    try:
        with open(output_path, 'w', encoding='utf-8') as outfile:
            outfile.write(full_html)
        print(f"Successfully wrote combined content to {output_path}")
    except Exception as e:
        print(f"Error writing to {output_path}: {str(e)}")
        return

    print("Build process completed successfully")

if __name__ == "__main__":
    print("Starting build process...")
    build_index_html()