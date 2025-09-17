function injectCBInterfce() {
	window.clarifyrChatbotId = '<<CHATBOT_ID>>';
	getChatId();

	const container = document.createElement("div");
	container.id = "clarifyr-open-chat-icon";
	container.innerHTML = `<<OPEN_CHAT_BUTTON>>`;

	const chatWindow = document.createElement("div");
	chatWindow.id = "clarifyr-chat-window";
	chatWindow.innerHTML = `<<CHAT_WINDOW>>`;

	document.body.appendChild(container);
	document.body.appendChild(chatWindow);

	attachOpenChatEvent();
	attachCloseChatEvent();
	attachEnterEvent();
	textInputResize();
}

function attachOpenChatEvent() {
	const openChatButton = document.getElementById("clarifyr-open-chat-icon");
	openChatButton.addEventListener("click", () => {
		const chatIcon = document.querySelector('.clarifyr-open-chat-icon');
		chatIcon.classList.add("clarifyr-hide-button-animation");
		chatIcon.classList.remove("clarifyr-show-button-animation");
		const chatWindow = document.querySelector(".clarifyr-chat-window");
		chatWindow.classList.remove("clarifyr-hide-chat-animation");
		chatWindow.classList.add("clarifyr-show-chat-animation");
	});
}

function attachCloseChatEvent() {
	const closeChatButton = document.querySelector(".clarifyr-close-chat-button");
	closeChatButton.addEventListener("click", () => {
		const chatIcon = document.querySelector('.clarifyr-open-chat-icon');
		chatIcon.classList.remove("clarifyr-hide-button-animation");
		chatIcon.classList.add("clarifyr-show-button-animation");
		const chatWindow = document.querySelector('.clarifyr-chat-window');
		chatWindow.classList.remove("clarifyr-show-chat-animation");
		chatWindow.classList.add("clarifyr-hide-chat-animation");
	});
}

function attachEnterEvent() {
	const chatInput = document.querySelector('.clarifyr-chat-input');
	chatInput.addEventListener('keydown', (event) => {
		if (event.key === 'Enter' && !event.shiftKey && chatInput.focus) {
			event.preventDefault();
			sendMessage();
		}
	});

}

function textInputResize() {
	const textarea = document.querySelector('.clarifyr-chat-input');

	function autoResize() {
		textarea.rows = 1;
		const lines = textarea.value.split('\n').length;
		textarea.rows = lines;
	}

	autoResize();
	textarea.value = '';

	textarea.addEventListener('input', autoResize);
}

async function getChatId() {
	const chatId = localStorage.getItem('clarifyr-chat-id');

	if (!chatId) {
		try {
			const response = await fetch('http://localhost:3000/start_new_chat?cid=' + window.clarifyrChatbotId, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			localStorage.setItem('clarifyr-chat-id', data.uuid);
		} catch (error) {
			localStorage.removeItem('clarifyr-chat-id');
		}
	}
}

function appendMessage(message, role) {
	const chatMessages = document.querySelector('#clarifyr-chat-messages');
	chatMessages.appendChild(document.createElement('div'));
	chatMessages.lastChild.classList.add('clarifyr-chat-message-' + role);
	chatMessages.lastChild.innerHTML = `<div class="clarifyr-chat-message-text-${role}">${message}</div>`;
}

function sendMessage() {
	const typingMessage = document.querySelector('#clarifyr-typing-message');
	const chatMessages = document.querySelector('#clarifyr-chat-messages');
	const chatBox = document.querySelector('.clarifyr-chat-input');

	const message = chatBox.value;
	const chatId = localStorage.getItem('clarifyr-chat-id');

	appendMessage(message, 'user');

	fetch('http://localhost:3000/send_message', {
		method: 'POST',
		body: JSON.stringify({
			message: message,
			chat_id: chatId
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	})
	.then((response) => {
		response.json().then((data) => {
			appendMessage(data.message, 'bot');
			typingMessage.style.display = 'none';
			chatBox.disabled = false;
			chatBox.style.backgroundColor = '#fff';
		});
	})
	.catch((error) => {
		typingMessage.style.display = 'none';
		chatBox.disabled = false;
		chatBox.style.backgroundColor = '#fff';
	});

	typingMessage.style.display = 'block';
	chatBox.value = '';
	chatBox.disabled = true;
	chatBox.style.backgroundColor = '#f1f0f0';
	textInputResize();
}

injectCBInterfce();