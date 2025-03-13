from config.file_upload import allowed_file_extensions, maximum_file_size

def extract_file_data(file):
	data = {
		"name": "",
		"type": "",
		"data": None
	}

	if file:
		data["name"] = file.filename
		data["type"] = file.content_type
		data["data"] = file.read()

	return data

def validate_file(data):
	# Check file type
	if data["type"] not in allowed_file_extensions.values():
		return False, "Invalid file type, only pdf, docx, and txt are allowed"

	# Check file size
	if len(data["data"]) > maximum_file_size:
		return False, "File size exceeds the maximum limit of 25MB"

	return True, None