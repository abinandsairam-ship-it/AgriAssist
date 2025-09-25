# **App Name**: AgriAssist AI

## Core Features:

- Image Upload: Allows users to upload images of crops for analysis either through file upload or by capturing a photo using the device's camera.
- AI Crop Analysis: Uses a pre-trained AI model to predict the crop type and assess its health status (healthy, pest-attacked, nutrient deficiency) based on the uploaded image. Also shows prediction confidence level.
- Instant Results Dashboard: Displays the prediction results instantly on the dashboard in a clean card format, including crop type, condition details, and prediction confidence.
- Firestore Data Storage: Stores each uploaded crop image and its prediction details in a Firestore database, including userID (if available), timestamp, crop type, condition/disease, and image URL.
- Prediction History: A dashboard history section that lists past predictions retrieved from Firestore for the user, allowing them to track previous analyses.
- Multi-language Support: Provides multi-language support with a language selector for English and major Indian languages, catering to a diverse user base. The LLM powering the AI model is equipped with a tool enabling the generation of texts in different languages based on detected user locale.
- Theme Toggle: Includes a dark/light theme toggle option for user preference, improving accessibility and user experience.

## Style Guidelines:

- Primary color: A muted green (#7CB342), reflecting agriculture and growth, maintaining a professional and calming feel.
- Background color: Light green (#E8F5E9), offering a clean and fresh look.
- Accent color: A warm yellow (#FFB300) for highlights and call-to-action buttons, providing a friendly touch.
- Body and headline font: 'PT Sans', a humanist sans-serif for a modern yet approachable feel, ensuring readability for all users.
- Use crop-related icons to make the UI more user-friendly for farmers with varying technical expertise.
- Ensure a responsive layout, optimized for both desktop and mobile devices, with a focus on clear navigation and intuitive user flows.
- Implement subtle animations for user interactions (e.g., loading states, transitions) to provide a smooth and engaging user experience.