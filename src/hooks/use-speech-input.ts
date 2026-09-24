"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

type Recognizer = InstanceType<NonNullable<Window["webkitSpeechRecognition"]>>;

const noopSubscribe = () => () => {};
const getRecognition = () =>
  typeof window === "undefined" ? undefined : window.SpeechRecognition ?? window.webkitSpeechRecognition;

/**
 * Dictation via the browser's Web Speech API. Unsupported browsers (e.g.
 * Firefox) report `supported: false` and the mic button is simply hidden.
 */
export function useSpeechInput(onText: (text: string) => void) {
  const supported = useSyncExternalStore(noopSubscribe, () => Boolean(getRecognition()), () => false);
  const [listening, setListening] = useState(false);
  const recognition = useRef<Recognizer | null>(null);
  const onTextRef = useRef(onText);

  useEffect(() => {
    onTextRef.current = onText;
  }, [onText]);

  useEffect(() => () => recognition.current?.abort(), []);

  const stop = useCallback(() => recognition.current?.stop(), []);

  const start = useCallback(() => {
    const Recognition = getRecognition();
    if (!Recognition) return;
    recognition.current?.abort();
    const r = new Recognition();
    r.continuous = true;
    r.interimResults = false;
    r.lang = navigator.language || "en-US";
    r.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) onTextRef.current(result[0].transcript.trim());
      }
    };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    recognition.current = r;
    r.start();
    setListening(true);
  }, []);

  return { supported, listening, start, stop };
}
