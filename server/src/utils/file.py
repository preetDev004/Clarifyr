from config.file_upload import allowed_file_extensions, maximum_file_size

import textract
import uuid
import os

def extract_file_data(file):
	data = {
		"name": "",
		"type": "",
		"data": None
	}

	# Save file
	file_id = str(uuid.uuid4())
	generated_file_name = file_id + '.' + file.filename
	path = os.path.join('./user_documents', generated_file_name)

	file.save(path)

	# Extract data using textract
	data = textract.process(data["data"], output_encoding='utf-8')

	if file:
		data["name"] = file.filename
		data["type"] = file.content_type
		data["data"] = data.decode('utf-8')

	return data

def validate_file(data):
	# Check file type
	if data["type"] not in allowed_file_extensions.values():
		return False, "Invalid file type, only pdf, docx, and txt are allowed"

	# Check file size
	if len(data["data"]) > maximum_file_size:
		return False, "File size exceeds the maximum limit of 25MB"

	return True, None
