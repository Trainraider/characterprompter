import re
import os

def extract_content(file_path):
    # Ensure the directory exists
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    # Read the content of the file
    with open(file_path, 'r') as f:
        content = f.read()

    # Extract and replace style content
    style_pattern = re.compile(r'<style[^>]*>(.*?)</style>', re.DOTALL)
    styles = style_pattern.findall(content)
    content = style_pattern.sub('<!-- STYLES -->', content)

    # Extract and replace script content
    script_pattern = re.compile(r'<script[^>]*>(.*?)</script>', re.DOTALL)
    scripts = script_pattern.findall(content)
    content = script_pattern.sub('<!-- SCRIPTS -->', content)

    # Write modified HTML content back to the same file
    with open(file_path, 'w') as f:
        f.write(content)

    # Write extracted styles to style.css in the same directory as the HTML file
    style_path = os.path.join(os.path.dirname(file_path), 'style.css')
    with open(style_path, 'w') as f:
        f.write('\n\n'.join(styles))

    # Write extracted scripts to script.js in the same directory as the HTML file
    script_path = os.path.join(os.path.dirname(file_path), 'script.js')
    with open(script_path, 'w') as f:
        f.write('\n\n'.join(scripts))

# Usage
file_path = 'src/index.html'
extract_content(file_path)

print(f"Processed and updated {file_path}")
print(f"Styles extracted to {os.path.join(os.path.dirname(file_path), 'style.css')}")
print(f"Scripts extracted to {os.path.join(os.path.dirname(file_path), 'script.js')}")