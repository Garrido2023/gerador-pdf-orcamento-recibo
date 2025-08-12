import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCt-yg00PhZX0UzgYnBF48GKSTzK5lRoHs",
  databaseURL: "https://esp32ledcontrol-9fc3e-default-rtdb.firebaseio.com",
  projectId: "esp32ledcontrol-9fc3e"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);