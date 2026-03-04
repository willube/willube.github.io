import { createSupabaseClient } from "./supabase-client.js";
import { qs, initUi } from "./ui.js";
import { initAuth } from "./auth.js";
import { initChat } from "./chat.js";
import { initVoice } from "./voice.js";
import { sanitizeUsername, buildUsername } from "./profile-utils.js";

const dom = {
    // General UI
    root: document.documentElement,
    body: document.body,
    appContainer: qs("[data-app]"),
    views: Array.from(document.querySelectorAll(".view")),
    sidebar: qs(".sidebar"),
    channelBar: qs(".channel-bar"),
    settingsToggle: qs("[data-settings-toggle]"),
    settingsOverlay: qs("[data-settings-overlay]"),
    settingsModal: qs("[data-settings-modal]"),
    settingsClose: qs("[data-settings-close]"),
    settingsTabs: Array.from(document.querySelectorAll("[data-settings-tab]")),
    settingsPanels: Array.from(document.querySelectorAll("[data-settings-panel]")),
    neonToggle: qs("[data-neon-toggle]"),
    // Profile/auth
    profileChip: qs(".profile-chip"),
    profileAvatar: qs("[data-profile-avatar]"),
    profileUsername: qs("[data-current-username]"),
    settingsUsername: qs("[data-settings-username]"),
    authLayer: qs("[data-auth-layer]"),
    authForms: Array.from(document.querySelectorAll("[data-auth-form]")),
    authSwitches: Array.from(document.querySelectorAll("[data-auth-switch]")),
    loginForm: document.querySelector("[data-auth-form='login']"),
    registerForm: document.querySelector("[data-auth-form='register']"),
    registerUsernameInput: document.querySelector("#reg-username"),
    registerSubmitButton: document.querySelector("[data-auth-form='register'] button[type='submit']"),
    authHeading: document.querySelector("#auth-title"),
    logoutBtn: qs("[data-logout]"),
    passwordInput: qs("[data-password-input]"),
    passwordSave: qs("[data-password-save]"),
    passwordMsg: qs("[data-password-msg]"),
    // Friend/DM
    dmButton: qs("[data-dm]"),
    dmBadge: qs("[data-dm-badge]"),
    dmList: qs("[data-dm-list]"),
    dmThread: qs("[data-dm-thread]"),
    dmComposer: qs("[data-dm-composer]"),
    dmInput: document.querySelector("[data-dm-composer] input[name='dm-message']"),
    activeDmLabel: qs("[data-active-dm]"),
    addFriendNav: qs("[data-open-friend-page]"),
    backToDmBtn: qs("[data-back-to-dm]"),
    friendForm: qs("[data-friend-form]"),
    friendInput: document.querySelector("[data-friend-form] input[name='friend-handle']"),
    friendError: qs("[data-friend-error]"),
    friendSuccess: qs("[data-friend-success]"),
    pendingList: qs("[data-pending-list]"),
    // Channels/server
    channelButtons: Array.from(document.querySelectorAll("[data-channel]")),
    serverButtons: Array.from(document.querySelectorAll("[data-server]")),
    composer: qs("[data-composer]"),
    composerInput: document.querySelector("[data-composer] input[name='message']"),
    activeChannelLabel: qs("[data-active-channel]"),
    messageList: qs("[data-message-list]"),
    // Call
    callButton: qs("[data-call-button]"),
    callOverlay: qs("[data-call-overlay]"),
    callStatus: qs("[data-call-status]"),
    callSub: qs("[data-call-sub]"),
    callAvatar: qs("[data-call-avatar]"),
    callAcceptBtn: qs("[data-call-accept]"),
    callEndBtn: qs("[data-call-end]"),
    remoteAudio: qs("[data-remote-audio]"),
    audioInputSelect: qs("[data-audio-input-select]"),
};

const state = {
    mode: "dm",
    currentUser: null,
    profile: null,
    friends: [],
    pending: [],
    messages: [],
    dmMessages: {},
    activeDm: null,
    activeServer: "core",
    activeChannel: "general",
    peerId: null,
    callState: {
        status: "Idle",
        localStream: null,
        remoteStream: null,
        micDeviceId: "",
    },
};

const supabaseUrl = document.querySelector("meta[name='supabase-url']")?.content;
const supabaseKey = document.querySelector("meta[name='supabase-key']")?.content;

const supabaseClient = createSupabaseClient(supabaseUrl, supabaseKey);
const ui = initUi(state, dom);
const chat = initChat({ state, dom, ui, supabaseClient });
const voice = initVoice({ state, dom, supabaseClient });

const init = async () => {
    const auth = initAuth({ state, dom, ui, supabaseClient, onAuthed: bootstrap });
    chat.bindDmButton();
    chat.bindChannels();
    chat.bindServers();
    chat.bindDmComposer();
    chat.bindComposer();
    chat.bindFriendNavigation();
    chat.bindFriendForm();
    voice.bindCallButton();
    voice.bindHangup();
    voice.bindMicSelect();
    await voice.populateAudioDevices();
    await auth.bootstrap();
};

const bootstrap = async () => {
    await chat.loadFriends();
    await chat.loadPending();
    ui.renderDmList();
    ui.renderPending();
    ui.updateBadge();
    chat.bindDmList();
    await chat.loadMessagesForFriend(state.activeDm);
    ui.renderDmThread();
    voice.initPeer();
    await voice.syncPeerId();
    await chat.subscribeFriendships();
    await chat.subscribeMessages();
};

window.addEventListener("DOMContentLoaded", init);

// Expose for debugging
window.__app = { state, dom, ui, chat, voice, sanitizeUsername, buildUsername };
