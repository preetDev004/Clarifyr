import os
import re

STATIC_FOLDER = 'chatbot-interface-static'

def read_html_template(template_name, params):
	# Get template path
	static_files_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', STATIC_FOLDER, 'templates'))
	file_path = os.path.join(static_files_dir, template_name+'.html')

	template = None
	try:
		# Read a template file
		with open(file_path, 'r') as f:
			template = f.read()
	except:
		return ''
	
	for key, value in params.items():
		template = template.replace("{{"+key+"}}", value)

	template = obfuscate_html(template)
	
	return template

def insert_templates(text, params):
	for key, value in params.items():
		text = text.replace(f"<<{key}>>", value)
	return text

def obfuscate_html(html: str) -> str:
    # Remove comments
    html = re.sub(r'<!--.*?-->', '', html, flags=re.DOTALL)
    
    # Remove unnecessary spaces, tabs, and newlines
    html = re.sub(r'\s+', ' ', html)
    
    # Remove leading/trailing spaces from the HTML
    html = html.strip()
    
    return html
