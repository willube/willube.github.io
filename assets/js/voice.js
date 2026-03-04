/**
 * Voice/PeerJS logic.
 * @param {object} deps
 * @param {object} deps.state
 * @param {object} deps.dom
 * @param {object} deps.supabaseClient
 */
export const initVoice = ({ state, dom, supabaseClient }) => {
    let peer = null;
    let callInstance = null;

    const stopStream = (stream) => {
        if (!stream) return;
        stream.getTracks().forEach((t) => t.stop());
    };

    const getLocalStream = async () => {
        const existing = state.callState.localStream;
        const hasLiveTrack = existing?.getTracks().some((t) => t.readyState === "live");
        if (existing && hasLiveTrack) return existing;
        stopStream(existing);
        const constraints = {
            audio: {
                deviceId: state.callState.micDeviceId ? { exact: state.callState.micDeviceId } : undefined,
                echoCancellation: true,
                noiseSuppression: true,
            },
            video: false,
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        state.callState.localStream = stream;
        stream.getTracks().forEach((track) => {
            track.addEventListener("ended", () => {
                if (state.callState.localStream === stream) state.callState.localStream = null;
            });
        });
        return stream;
    };

    const setCallStatus = (status) => {
        state.callState.status = status;
        if (dom.callStatus) dom.callStatus.textContent = status;
    };

    const endCall = () => {
        if (callInstance) callInstance.close();
        callInstance = null;
        stopStream(state.callState.remoteStream);
        state.callState.remoteStream = null;
        stopStream(state.callState.localStream);
        state.callState.localStream = null;
        setCallStatus("Idle");
    };

    const initPeer = () => {
        if (peer) return peer;
        const peerId = state.currentUser?.id || `guest-${Math.random().toString(36).slice(2, 8)}`;
        peer = new window.Peer(peerId, { debug: 2 });
        peer.on("open", () => {
            state.peerId = peerId;
            if (dom.peerLabel) dom.peerLabel.textContent = peerId;
        });
        peer.on("call", async (call) => {
            setCallStatus("Incoming call…");
            const stream = await getLocalStream();
            call.answer(stream);
            call.on("stream", (remoteStream) => {
                state.callState.remoteStream = remoteStream;
                if (dom.remoteAudio) dom.remoteAudio.srcObject = remoteStream;
                setCallStatus("In call");
            });
            call.on("close", endCall);
            callInstance = call;
        });
        return peer;
    };

    const placeCall = async (targetPeerId) => {
        if (!targetPeerId) return;
        const stream = await getLocalStream();
        const p = initPeer();
        callInstance = p.call(targetPeerId, stream);
        setCallStatus("Calling…");
        callInstance.on("stream", (remoteStream) => {
            state.callState.remoteStream = remoteStream;
            if (dom.remoteAudio) dom.remoteAudio.srcObject = remoteStream;
            setCallStatus("In call");
        });
        callInstance.on("close", endCall);
    };

    const syncPeerId = async () => {
        if (!supabaseClient || !state.currentUser) return;
        const peerId = state.peerId;
        if (!peerId) return;
        await supabaseClient.from("profiles").update({ peer_id: peerId }).eq("id", state.currentUser.id);
    };

    const bindCallButton = () => {
        dom.callButton?.addEventListener("click", () => {
            const target = state.activeDm || dom.callInput?.value?.trim();
            if (target) void placeCall(target);
        });
    };

    const bindHangup = () => {
        dom.callEndBtn?.addEventListener("click", () => endCall());
    };

    const bindMicSelect = () => {
        dom.audioInputSelect?.addEventListener("change", async () => {
            state.callState.micDeviceId = dom.audioInputSelect.value || "";
            stopStream(state.callState.localStream);
            state.callState.localStream = null;
            if (callInstance) {
                const stream = await getLocalStream();
                const audioTrack = stream.getAudioTracks()[0];
                const sender = callInstance.peerConnection?.getSenders?.().find((s) => s.track?.kind === "audio");
                if (audioTrack && sender) {
                    await sender.replaceTrack(audioTrack).catch((error) => console.error("Replace track failed", error));
                }
            }
        });
    };

    const populateAudioDevices = async () => {
        if (!dom.audioInputSelect || !navigator.mediaDevices?.enumerateDevices) return;
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const audioInputs = devices.filter((d) => d.kind === "audioinput");
            dom.audioInputSelect.innerHTML = "";
            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "Standard Mikrofon";
            dom.audioInputSelect.appendChild(defaultOption);
            audioInputs.forEach((device, idx) => {
                const option = document.createElement("option");
                option.value = device.deviceId;
                option.textContent = device.label || `Mic ${idx + 1}`;
                dom.audioInputSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Enumerate devices failed", error);
        }
    };

    return {
        initPeer,
        placeCall,
        endCall,
        bindCallButton,
        bindHangup,
        syncPeerId,
        bindMicSelect,
        populateAudioDevices,
        getLocalStream,
    };
};
