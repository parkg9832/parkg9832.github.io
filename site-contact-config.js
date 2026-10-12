// Public contact configuration. Use digits only, including country code.
// Official WhatsApp Business number corrected by MOKDA on 2026-10-12.
window.MOKDA_CONTACT = {
  whatsappNumber: '821022127815',
};

// Public Worker URL only. AI credentials never belong in the website.
window.MOKDA_CHAT_AI = { enabled: true, endpoint: 'https://mokda-chat.mokda-chat-worker.workers.dev/chat' };

// Public widget key only. Server verification secrets stay in server settings.
window.MOKDA_BOT_PROTECTION = Object.freeze({ sitekey: '0x4AAAAAAFUpkDmjb4iDE1aD' });
