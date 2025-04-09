import random
import time
import hashlib
from loguru import logger

cache = {}
CACHE_LIFETIME = 600

hexchars = [chr(i) for i in range(97,103)]
numers = [chr(i) for i in range(49,58)]
def randomComplexHex():
    return '0x' + random.choice(hexchars) + str(random.randint(10,15))
def randomHHex():
    return '0x' + random.choice(numers)+ random.choice(numers)+ random.choice(numers)
def randomHex():
    return '0x' + random.choice(numers)+ random.choice(numers)
class JSObfuscator:
    def charToExp(letter):
        exp= randomComplexHex() + '+-' + randomHHex() + '+' + randomHex()+'*'+randomHex()+'-'+randomHex()+'*0x'+random.choice(numers)
        return exp+'+-'+str(hex(eval(exp)-ord(letter)))
    def sentToExp(string):
        return ','.join(JSObfuscator.charToExp(i) for i in string)
    def codeToExp(code):
        return 'window["\\x65\\x76\\x61\\x6C"](window["\\x65\\x76\\x61\\x6C"]("\\x74\\x68\\x69\\x73\\x5b\\x22\\x53\\x74\\x72\\x69\\x6e\\x67\\x22\\x5d\\x5b\\x22\x66\\x72\\x6f\\x6d\\x43\\x68\\x61\\x72\\x43\\x6f\\x64\\x65\\x22\\x5d")('+JSObfuscator.sentToExp(code)+'))'
    def ezObfuscate(code):
        return "window['\\x65\x76\\x61\\x6C']('{}')".format("".join("\\x{:02x}".format(ord(c)) for c in code))

def obfuscate_js(js_code):
	logger.debug("Obfuscating chatbot JavaScript")
	hash = hashlib.sha256(js_code.encode('utf-8')).hexdigest()

	if hash in cache:
		logger.debug("Cached obfuscation found")
		cached_data = cache[hash]
		
		# Check if cache expired expiry
		if time.time() - cached_data['timestamp'] < CACHE_LIFETIME:
			return cached_data['obfuscated_code']
		else:
			logger.debug("Cache expired...")

	js_code = JSObfuscator.ezObfuscate(js_code)

	cache[hash] = {
		"timestamp": time.time(),
		"obfuscated_code": js_code
	}

	logger.debug("Finished obfuscation")

	return js_code