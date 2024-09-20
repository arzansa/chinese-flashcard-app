import React from 'react';
import './HomePage.css';

export default function HomePage({ user }) {
  return (
    <main>
      <h1>Bing Qilin</h1>
      {user ? (
        <div class="info">
          <h2>Welcome, {user.name}!</h2>
          <p class="par1">Email: {user.email}</p>
          <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      ) : (
        <div class="info">
          <h2>Welcome to Bing Qilin!</h2>
          <p class="par1">Discover and study Chinese flashcards with ease.</p>
          <p>Create an account to track your progress and access personalized content.</p>
        </div>
      )}
    </main>
  );
}