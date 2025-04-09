function injectCBInterfce() {
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
	textInputResize();
}

function attachOpenChatEvent() {
	const openChatButton = document.getElementById("clarifyr-open-chat-icon");
	openChatButton.addEventListener("click", () => {
		const chatIcon = document.querySelector('.clarifyr-open-chat-icon');
		chatIcon.classList.add("clarifyr-hide-button-animation");
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
		chatIcon.classList.remove("clarifyr-show-button-animation");
		const chatWindow = document.querySelector('.clarifyr-chat-window');
		chatWindow.classList.remove("clarifyr-show-chat-animation");
		chatWindow.classList.add("clarifyr-hide-chat-animation");
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

injectCBInterfce();