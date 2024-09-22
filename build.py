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
        if filename.endswith('.yaml'):
            with open(os.path.join(prompts_dir, filename), 'r') as file:
                component_data = yaml.safe_load(file)
                key = os.path.splitext(filename)[0]
                components[key] = {
                    'default': component_data.get('default', False),
                    'universal': component_data.get('universal', ''),
                    'group': component_data.get('group', ''),
                    'name': component_data.get('name', key),
                    'hover': component_data.get('hover', ''),
                }
                
                for prompt_type in ['regular', 'nsfw']:
                    if prompt_type in component_data:
                        if isinstance(component_data[prompt_type], str):
                            components[key][prompt_type] = component_data[prompt_type]
                        elif isinstance(component_data[prompt_type], dict):
                            components[key][prompt_type] = {
                                'description': component_data[prompt_type].get('description', ''),
                                'dialogue_start': component_data[prompt_type].get('dialogue_start', []),
                                'dialogue_end': component_data[prompt_type].get('dialogue_end', [])
                            }
                        else:
                            components[key][prompt_type] = ''
                    else:
                        components[key][prompt_type] = ''
    
    return json.dumps(components)

def get_script_files(script_dir):
    regular_scripts = []
    main_js = None
    for root, _, files in os.walk(script_dir):
        for file in sorted(files):
            if file.endswith('.js'):
                full_path = os.path.join(root, file)
                if file == 'main.js':
                    main_js = full_path
                else:
                    regular_scripts.append(full_path)
    return regular_scripts, main_js

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

    # Get all JavaScript files recursively
    regular_scripts, main_js = get_script_files(script_dir)
    
    # Combine all JavaScript modules into one
    script_js = ''
    for script_file in regular_scripts:
        script_js += read_file(script_file) + '\n'
    
    # Add main.js at the end if it exists
    if main_js:
        script_js += read_file(main_js) + '\n'

    # Escape backticks in prompts
    prompt = escape_backticks(prompt)
    nsfw_prompt = escape_backticks(nsfw_prompt)

    # Process prompt components
    prompt_components = process_prompt_components()

    # Replace placeholders in script_js
    script_js = script_js.replace('__PROMPT__', prompt)
    script_js = script_js.replace('__NSFW_PROMPT__', nsfw_prompt)
    script_js = script_js.replace('__PROMPT_COMPONENTS__', prompt_components)

    # Replace placeholders in index_html
    index_html = index_html.replace('<!-- STYLES -->', f'<style>\n{style_css}\n</style>')
    index_html = index_html.replace('<!-- SCRIPTS -->', f'<script>\n{script_js}\n</script>')

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
