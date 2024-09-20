import os
import base64
import json
import yaml

def escape_backticks(text):
    return text.replace('`', '\\`')

def read_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()

def read_binary_file(file_path):
    with open(file_path, 'rb') as file:
        return file.read()

def encode_image_to_base64(image_path):
    image_content = read_binary_file(image_path)
    base64_encoded = base64.b64encode(image_content).decode('utf-8')
    return f"data:image/webp;base64,{base64_encoded}"

def process_prompt_components():
    prompts_dir = './src/prompts'
    components = {}
    for filename in os.listdir(prompts_dir):
        if filename.endswith('.txt'):
            with open(os.path.join(prompts_dir, filename), 'r') as file:
                component_data = yaml.safe_load(file)
                key = os.path.splitext(filename)[0]
                components[key] = {
                    'default': component_data.get('default', 'off'),
                    'universal': component_data.get('universal', ''),
                    'regular': component_data.get('regular', ''),
                    'nsfw': component_data.get('nsfw', '')
                }
    return json.dumps(components)

def build_index_html():
    src_dir = './src'
    script_dir = './src/scripts'
    docs_dir = './docs'

    os.makedirs(docs_dir, exist_ok=True)

    # Read source files
    index_html = read_file(os.path.join(src_dir, 'index.html'))
    prompt = read_file(os.path.join(src_dir, 'prompt.txt'))
    nsfw_prompt = read_file(os.path.join(src_dir, 'nsfw_prompt.txt'))
    style_css = read_file(os.path.join(src_dir, 'style.css'))

    # Dynamically get all JavaScript files in src/scripts
    script_files = [f for f in os.listdir(script_dir) if f.endswith('.js')]
    script_files.sort()  # Ensure consistent order
    
    # Move main.js to the end of the list
    if 'main.js' in script_files:
        script_files.remove('main.js')
        script_files.append('main.js')

    # Combine all JavaScript modules into one
    script_js = ''
    for script_file in script_files:
        script_js += read_file(os.path.join(script_dir, script_file)) + '\n'

    # Escape backticks in prompts
    prompt = escape_backticks(prompt)
    nsfw_prompt = escape_backticks(nsfw_prompt)

    # Process prompt components
    prompt_components = process_prompt_components()

    # Replace placeholders in script_js
    script_js = script_js.replace('{{PROMPT}}', prompt)
    script_js = script_js.replace('{{NSFW_PROMPT}}', nsfw_prompt)
    script_js = script_js.replace('{{PROMPT_COMPONENTS}}', prompt_components)

    # Replace placeholders in index_html
    index_html = index_html.replace('<!-- STYLES -->', f'{style_css}')
    index_html = index_html.replace('<!-- SCRIPTS -->', f'{script_js}')

    # Encode images to base64
    image_base64 = encode_image_to_base64(os.path.join(src_dir, 'image.webp'))
    image2_base64 = encode_image_to_base64(os.path.join(src_dir, 'image2.webp'))

    # Replace image sources in index_html
    index_html = index_html.replace('src="image.webp"', f'src="{image_base64}"')
    index_html = index_html.replace('src="image2.webp"', f'src="{image2_base64}"')
    index_html = index_html.replace("'image.webp'", f"'{image_base64}'")
    index_html = index_html.replace("'image2.webp'", f"'{image2_base64}'")

    # Write the combined content to the output file
    output_path = os.path.join(docs_dir, 'index.html')
    with open(output_path, 'w', encoding='utf-8') as outfile:
        outfile.write(index_html)

if __name__ == "__main__":
    build_index_html()
