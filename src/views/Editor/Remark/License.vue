<template>
    <div class="license-container">
      <!-- Clickable text that triggers the popup -->
      <span 
        @click="isPopupOpen = true" 
        class="license-trigger"
      >
        LICENSE
      </span>
  
      <!-- Full-screen popup/modal -->
      <div 
        v-if="isPopupOpen" 
        class="license-popup-overlay"
        @click.self="isPopupOpen = false"
      >
        <div class="license-popup-content">
          <div class="license-popup-inner">
            <div class="license-header">
              <h2 class="license-title">License Information</h2>
              <button 
                @click="isPopupOpen = false" 
                class="license-close-button"
                aria-label="Close"
              >
                X
              </button>
            </div>
  
            <div class="license-body">
              <!-- License Statement -->
              <div class="license-statement">
                <p class="license-statement-text">
                  This software is licensed under the GNU Affero General Public License version 3.0 (AGPL-3.0).
                </p>
              </div>
  
              <!-- License Link -->
              <div class="license-section">
                <h3 class="license-section-title">Full License Text</h3>
                <p>
                  You can view the complete AGPL-3.0 license at: 
                  <a 
                    href="https://www.gnu.org/licenses/agpl-3.0.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="license-link"
                  >
                    https://www.gnu.org/licenses/agpl-3.0.html
                  </a>
                </p>
              </div>
  
              <!-- Copyright Notices -->
              <div class="license-section">
                <h3 class="license-section-title">Copyright Notices</h3>
                <div class="license-notice-box">
                  <p>{{ copyrightNotices }}</p>
                </div>
              </div>
  
              <!-- Modified Version Statement -->
              <div class="license-section">
                <h3 class="license-section-title">Modified Version</h3>
                <p>
                  This project is a modified version of {{ originalProjectName }}. 
                  The source code for this modified version is available on GitHub: 
                  <a 
                    :href="githubRepositoryLink" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="license-link"
                  >
                    {{ githubRepositoryLink }}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  // Props for customizing the license information
  interface Props {
    originalProjectName: string;
    githubRepositoryLink: string;
    copyrightNotices: string;
  }
  
  const props = withDefaults(defineProps<Props>(), {
    originalProjectName: 'Original Project',
    githubRepositoryLink: 'https://github.com/yourusername/your-repository',
    copyrightNotices: 'Copyright (C) [Year] [Original Author]. All rights reserved.'
  });
  
  // State for controlling popup visibility
  const isPopupOpen = ref(false);
  </script>
  
  <style scoped>
  .license-container {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    height: 100%;
    display: flex;
    align-items: center;
}
  
  .license-trigger {
    color: #2563eb;
    cursor: pointer;
    text-decoration: none;
    font-size: 13px;
    color: gray;

  }
  
  .license-trigger:hover {
    color: #1d4ed8;
    text-decoration: underline;
    color: gray;
  }
  
  .license-popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    overflow-y: auto;
  }
  
  .license-popup-content {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    max-width: 64rem;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .license-popup-inner {
    padding: 1.5rem;
  }
  
  .license-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .license-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #111827;
    margin: 0;
  }
  
  .license-close-button {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 0.25rem;
  }
  
  .license-close-button:hover {
    color: #374151;
  }
  
  .license-close-icon {
    height: 1.5rem;
    width: 1.5rem;
  }
  
  .license-body {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    color: #374151;
  }
  
  .license-statement {
    padding: 1rem;
    background-color: #f3f4f6;
    border-radius: 0.5rem;
  }
  
  .license-statement-text {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0;
  }
  
  .license-section {
    margin-bottom: 1rem;
  }
  
  .license-section-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #111827;
  }
  
  .license-notice-box {
    padding: 1rem;
    background-color: #f3f4f6;
    border-radius: 0.5rem;
  }
  
  .license-link {
    color: #2563eb;
    text-decoration: none;
  }
  
  .license-link:hover {
    text-decoration: underline;
  }
  
  </style>