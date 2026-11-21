// Entrée de l'appli Android : connexion PRONOTE directe + modules natifs
// (notifications programmées, reconnaissance vocale).
import './pronote-browser.mjs';
import { LocalNotifications } from '@capacitor/local-notifications';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';

window.MLPNative = { LocalNotifications, SpeechRecognition };
