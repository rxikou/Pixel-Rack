# Product Requirements Document (PRD) : PixelRack

## 1. Problem Statement
Hot Wheels collectors lack a dedicated, visually engaging platform to catalog and display their physical collections in a fun, digital format. 

## 2. Target Audience
Hot Wheels collectors, die-cast car enthusiasts, and hobbyists who appreciate pixel art aesthetics.

## 3. Feature MVP Checklist
* User Authentication: Sign up, log in, and secure session management.
* Image Upload: Users can upload photos of their physical Hot Wheels.
* Pixelation Engine: Backend service processes the image into a 16-bit/8-bit style pixel art sprite via a Gemini API + sharp hybrid pipeline (AI normalizes background/angle/style, sharp locks the final palette and sprite dimensions).
* Core Display (The Rack): A default virtual wooden rack to display the pixelated cars.
* Alternative Environments: At least two unlocked environments, each its own page with a fixed number of car
  slots rather than a backdrop swapped behind the rack. Virtual Garage holds 2 cars, the Japanese convenience
  store lot (Mt Fuji view) holds 3. Slot assignments persist per user.
* Collection Management: Ability to name, categorize, and delete cars from the digital rack.

## 4. Explicit Non-Goals (Out of Scope for MVP)
* Trading or selling cars between users.
* Multiplayer lobbies or real-time chat.
* Mobile app deployment (React Native/Flutter). This is strictly a responsive web app.
* 3D rendering of the cars, and any sprite-level animation (no walk cycles, no multi-frame sprites).
  Lightweight CSS effects triggered by clicking a placed car (a wash in the garage, a gleam at the konbini)
  are in scope: they decorate the scene rather than animate the sprite, and they are disabled under
  `prefers-reduced-motion`.
